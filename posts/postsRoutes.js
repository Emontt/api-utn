const router = require("express").Router();
const { listAll, addOne } = require("./postsController");
const isAuth = require("../authorizations/isAuth");
const validatorCreatePost = require("../validators/posts");

router.get("/", listAll);
router.post("/", isAuth, validatorCreatePost, addOne);
module.exports = router;
