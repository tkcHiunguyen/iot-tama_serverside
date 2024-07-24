const { connection } = require("../DB");
const { Mutex } = require("async-mutex");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateAccessToken } = require("../middleware/jwt");
const mutex = new Mutex();

let post_login = async (req, res) => {
     let username = req.body.username_login;
     let password = req.body.password_login;
     try {
          const [rows] = await connection.execute(
               "SELECT * FROM account WHERE username=?",
               [username]
          );
          if (rows.length > 0) {
               const user = rows[0];
               const isPasswordValid = bcryptjs.compareSync(
                    password,
                    user.password
               );
               if (isPasswordValid) {
                    // Successful login
                    const accessToken = generateAccessToken({ username:username });
                    // console.log(accessToken);
                    res.cookie("access_token", accessToken, { httpOnly: true }); // Store token in cookie for client
                    res.redirect("/dashboard"); // Adjust this according to your route
               } else {
                    // Incorrect password
                    res.render("login", { loginError: "Incorrect password" });
               }
          } else {
               // User not found
               res.render("login", { loginError: "User not found" });
          }
     } catch (err) {
          console.log(err);
          res.render("login", { loginError: "An error occurred during login" });
     }
};

let post_register = async (req, res) => {
     let username = req.body.username_register;
     let password = req.body.password_register;
     let email = req.body.email;
     let hashPassword = bcryptjs.hashSync(password, 10);

     mutex.acquire().then(async (release) => {
          try {
               const [rows] = await connection.execute(
                    "SELECT * FROM account WHERE username=? OR email=?",
                    [username, email]
               );
               if (rows.length > 0) {
                    // User or email already exists
                    res.render("login", {
                         registerError: "Username or email already exists",
                    });
               } else {
                    await connection.execute(
                         "INSERT INTO account (username, password, email) VALUES (?, ?, ?)",
                         [username, hashPassword, email]
                    );
                    res.redirect("/login");
               }
          } catch (error) {
               console.log(error);
               res.render("login", {
                    registerError: "An error occurred during registration",
               });
          } finally {
               release();
          }
     });
};

let post_refresh_token = (req, res) => {
     res.send("post refresh token");
};

let delete_token = (req, res) => {
     res.send("delete token");
};

module.exports = {
     post_login,
     post_register,
     post_refresh_token,
     delete_token,
};
