const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware để xác thực token
const authenticateToken = (req, res, next) => {
     const token = req.cookies.access_token; // Lấy token từ cookie
     if (!token) {
          // return res.status(401).send("Access Denied");
          return res.redirect("/login");
     }

     jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
          if (err) {
               // return res.status(403).send("Invalid token");
               res.clearCookie("access_token");
               return res.redirect("/login");
          }
          req.username = user.user.username;
          // console.log(user.user.username);
          next();
     });
};

const generateAccessToken = (user) => {
     // console.log(user);
     return jwt.sign({ user }, process.env.JWT_SECRET_KEY, {
          expiresIn: "1d",
     }); // Thời hạn của token là 1 giờ
};

module.exports = { authenticateToken, generateAccessToken };
