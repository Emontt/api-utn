const router = require("express").Router();
const {
  validatorCreateUser,
  validatorEditUser,
  validatorResetPassword,
} = require("../validators/users");
const {
  showAll,
  showOne,
  createOne,
  deleteById,
  editOne,
  login,
  forgot,
  saveNewPass,
  reset,
} = require("./usersController");
const uploadFile = require("../utils/handleStorage");
//show all users
router.get("/", showAll);

//show one user
router.get("/:id", showOne);

//New user
router.post(
  "/register",
  uploadFile.single("file"),
  validatorCreateUser,
  createOne
);

//login
router.post("/login", login);

//Forgot password
router.post("/forgot-password", forgot);

router.get("/reset/:token", reset);

router.post("/reset/:token", validatorResetPassword, saveNewPass);

//Edit user
router.patch("/:id", uploadFile.single("file"), validatorEditUser, editOne);

//Delete user by ID
router.delete("/:id", deleteById);

module.exports = router;
