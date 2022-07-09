require("dotenv").config();
require("./db/configs");

const express = require("express");
const hbs = require("express-handlebars");
const path = require("path");
const server = express();
const port = process.env.port || 3000;

server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(express.static("storage"));

//Statics Bootstrap
server.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
server.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))

//Handlebars
server.set("view engine", "hbs");
server.set("views", path.join("./views")) 
server.engine("hbs", hbs.engine({ extname: "hbs" }))

server.listen(port, (err) => {
  err
    ? console.warn(`Hubo un error {
      message: ${err} }`)
    : console.log(`Servidor corre en http://localhost:${port}`);
});
//Endpoints
server.get("/", (req, res) => {
  const content = `
    <h1>API whit Express</h1>
    <pre>Buenas tardes MUNDO</pre>`;
  res.send(content);
});

//Router for  endpoint /users
server.use("/users", require("./useres/useresRoute"));



//Router for  endpoint /posts
server.use("/posts", require("./posts/postsRoutes"));



//Catch all route (404)
server.use((req, res, next) => {
  let error = new Error("Resource not found");
  error.status = 404;
  next(error);
});



//Error handler
server.use((error, req, res, next) => {
  if (!error.status) {
    error.status = 500;
  }
  res.status(error.status);
  res.json({ status: error.status, message: error.message });
});
