const express = require("express");
const path = require("path");
const app = express();
const mysql = require("mysql2");
var methodOverride = require("method-override");
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
const { faker } = require("@faker-js/faker");

let getdata = () => {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    // faker.image.avatar(),
    faker.internet.password(),
    // faker.date.birthdate(),
    // faker.date.past(),
  ];
};

app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
let port = 8080;
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "college",
  password: "nandini>samarth",
});
let q = "insert into user values ?";
try {
  connection.query(q, [users], (err, resul) => {
    if (err) {
      throw err;
    }
    console.log(resul);
  });
} catch {}
// connection.end();
let users = [];

app.listen(port, () => {
  console.log(`listening to ${port}`);
});
// for (let i = 0; i < 100; i++) {
//   users.push(getdata());
// }

app.get("/", (req, res) => {
  let q = "select count(*) from user";
  try {
    connection.query(q, (err, resul) => {
      if (err) throw err;
      console.log(resul);
      let count = resul[0]["count(*)"];
      console.log(count);
      res.render("index.ejs", { count });
      // res.send("h");
    });
  } catch (err) {
    console.log(err);
  }
});
app.get("/user", (req, res) => {
  let q = "select * from user";
  try {
    connection.query(q, (err, resul) => {
      if (err) throw err;
      console.log(resul);
      let users_info = resul;

      res.render("info.ejs", { users_info });
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;

  let q = `select * from user where userid='${id}'`;
  try {
    connection.query(q, (err, resul) => {
      if (err) {
        throw err;
      }
      console.log(resul);
      let user = resul[0];

      res.render("edit.ejs", { user });
    });
  } catch (err) {
    console.log(err);
    res.send("failed");
  }
});

app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { username: formuser, password: formpassword } = req.body;
  let q = `select * from user where userid='${id}'`;

  try {
    connection.query(q, (err, resul) => {
      if (err) {
        throw err;
      }
      console.log(resul);

      let user = resul[0];
      if (formpassword != user.password) {
        res.send("wrong password");
      } else {
        let q2 = `update user set username='${formuser}' where userid='${id}'`;
        connection.query(q2, (err, resul) => {
          res.redirect("/user");
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.send("failed");
  }
});
