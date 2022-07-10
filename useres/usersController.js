const {
  showAllUsers,
  showUserByID,
  addNewUser,
  deleteUserById,
  editUserById,
  loginUser,
} = require("./usersModel");
const notNumber = require("../utils/notNumber");
const { encrypt, compare } = require("../utils/handlePassword");
const { matchedData } = require("express-validator");
const public_url = process.env.public_url;
const { tokenSign, tokenVerify } = require("../utils/handleJWT");

//show all users
const showAll = async (req, res, next) => {
  const dbResponse = await showAllUsers();
  if (dbResponse instanceof Error) return next(dbResponse);

  const responseUser = dbResponse.map((user) => {
    const filteredUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    };
    return filteredUser;
  });
  dbResponse.length ? res.status(200).json(responseUser) : next();
};

//show one user
const showOne = async (req, res, next) => {
  if (notNumber(req.params.id, next)) return;
  const dbResponse = await showUserByID(+req.params.id);
  if (dbResponse instanceof Error) return next(dbResponse);
  if (!dbResponse.length) return next();
  const { id, name, email, image } = dbResponse[0];
  const responseUser = {
    id,
    name,
    email,
    image,
  };
  res.status(200).json(responseUser);
};

//New user
const createOne = async (req, res, next) => {
  const cleanBody = matchedData(req);
  const image = public_url + req.file.filename;
  const password = await encrypt(req.body.password);
  const dbResponse = await addNewUser({ ...cleanBody, password, image });
  if (dbResponse instanceof Error) return next(dbResponse);

  const user = {
    id: cleanBody.id,
    name: cleanBody.name,
    email: cleanBody.email,
  };
  const token = await tokenSign(user, "3h");
  res.status(201).json({ message: "User Created!", JWT: token });
};

//Log in
const login = async (req, res, next) => {
  const dbResponse = await loginUser(req.body.email);
  if (!dbResponse.length) return next();
  if (await compare(req.body.password, dbResponse[0].password)) {
    const user = {
      id: dbResponse[0].id,
      name: dbResponse[0].name,
      email: dbResponse[0].email,
    };
    const token = await tokenSign(user, "3h");
    res.status(200).json({ message: "User logged in", JWT: token });
  } else {
    let error = new Error("Unauthorized");
    error.status = 401;
    next(error);
  }
};
// Servicio mailtrap

const nodemailer = require("nodemailer");
const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.mail_user,
    pass: process.env.mail_pass,
  },
});

//Forgot
const forgot = async (req, res, next) => {
  console.log("req.body", req.body);
  const dbResponse = await loginUser(req.body.email);
  console.log(dbResponse);
  if (!dbResponse.length) return next();
  const user = {
    id: dbResponse[0].id,
    name: dbResponse[0].name,
    email: dbResponse[0].email,
  };
  const token = await tokenSign(user, "15m");
  console.log(token);
  const link = `${public_url}users/reset/${token}`;
  console.log(link);
  let mailDetails = {
    from: "aasd@sasd.com",
    to: user.email,
    subject: "Pasword Recovery ",
    html: `<h2>Password Recovery Service</h2>
      <p>To reset your password, please click the link and follow the instructions</p>
      <a href="${link}">click to recover your password</a>
      `,
  };
  transport.sendMail(mailDetails, (error, data) => {
    if (error) {
      error.message = "Internal Server Error";
      next(error);
    } else
      res
        .status(200)
        .json({
          message: `Hi ${user.name}, we've sent an email with instructions to ${user.email}`,
        });
  });
};

//Form reset pass
const reset = async (req, res, next) => {
  const { token } = req.params;
  const tokenStatus = await tokenVerify(token);
  if (tokenStatus instanceof Error) {
    res.send(tokenStatus);
  } else res.render("reset", { tokenStatus, token });
};

const saveNewPass = async (req, res, next) => {
  const { token } = req.params;
  const tokenStatus = await tokenVerify(token);
  if (tokenStatus instanceof Error) return res.send(tokenStatus);
  const newPassword = await encrypt(req.body.password_1);
  const dbResponse = await editUserById(tokenStatus.id, {
    password: newPassword,
  });
  dbResponse instanceof Error
    ? next(dbResponse)
    : res
        .status(200)
        .json({ message: `Password changed for user ${tokenStatus.name}` });
};

//Edit one
const editOne = async (req, res, next) => {
  if (notNumber(req.params.id, next)) return;
  const image = `${public_url}/${req.file.filename}`;
  const dbResponse = await editUserById(+req.params.id, { ...req.body, image });
  if (dbResponse instanceof Error) return next(dbResponse);
  dbResponse.affectedRows
    ? res.status(200).json({ message: "User modified!" })
    : next();
};

//Delete user by ID
const deleteById = async (req, res, next) => {
  if (notNumber(req.params.id, next)) return;
  const dbResponse = await deleteUserById(+req.params.id);
  if (dbResponse instanceof Error) return next(dbResponse);
  !dbResponse.affectedRows ? next() : res.status(204).end();
};

module.exports = {
  showAll,
  showOne,
  createOne,
  deleteById,
  editOne,
  login,
  forgot,
  reset,
  saveNewPass,
};
