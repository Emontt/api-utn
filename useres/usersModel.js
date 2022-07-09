const connection = require("../db/configs");

const showAllUsers = async () => {
  const query = "SELECT * FROM users";
  try {
    return await connection.query(query);
  } catch (error) {
    error.message = error.code;
    return error;
  }
};

const showUserByID = async (id) => {
  const query = `SELECT * FROM users WHERE id = ${id}`;
  try {
    return await connection.query(query);
  } catch (error) {
    error.message = error.code;
    return error;
  }
};

const addNewUser = async (user) => {
  const query = `INSERT INTO users SET ?`;
  try {
    return await connection.query(query, user);
  } catch (error) {
    error.message = error.code;
    return error;
  }
};

const loginUser = async (email) => {
  const query = `SELECT * FROM users WHERE email = '${email}'`;
  try {
    return await connection.query(query);
  } catch (error) {
    error.message = error.code;
    return error;
  }
};




const editUserById = async (id, user) => {
  const query = `UPDATE users SET ? WHERE id = ${id}`;
  try {
    return await connection.query(query, user);
  } catch (error) {
    error.message = error.code;
    return error;
  }
};

const deleteUserById = async (id) => {
  const query = `DELETE FROM users WHERE id = ${id}`;
  try {
    return await connection.query(query);
  } catch (error) {
    error.message = error.code;
    return error;
  }
};

module.exports = {
  showAllUsers,
  showUserByID,
  addNewUser,
  deleteUserById,
  editUserById,
  loginUser,
};
