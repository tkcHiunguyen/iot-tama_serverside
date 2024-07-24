const Express = require("express");
const controller = require("../controllers/controller");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const { authenticateToken } = require("../middleware/jwt");

let router = Express.Router();
const storage = multer.diskStorage({
     destination: function (req, file, cb) {
          cb(null, "public/upload");
     },
     filename: function (req, file, cb) {
          // console.log(file)
          cb(null, Date.now() + path.extname(file.originalname));
     },
     fileFilter: function (req, file, res) {
          // Chỉ chấp nhận file type là png hoặc jpg
          const allowedMimeTypes = ["image/jpeg", "image/png"];
          if (allowedMimeTypes.includes(file.mimetype)) {
               res(null, true);
          } else {
               res(
                    new Error(
                         "Invalid file type. Only JPEG and PNG files are allowed."
                    ),
                    false
               );
          }
     },
});
var upload_img = multer({ storage: storage });

function resizeImage(req, res, next) {
     if (req.file) {
          sharp(req.file.path)
               .resize(8192, 4096)
               .toFile("public/upload/" + req.file.filename, function (err) {
                    if (err) {
                         // Xử lý lỗi nếu cần
                         console.error(err);
                         return res.status(500).send("Internal Server Error");
                    }
                    req.resizedImagePath = "public/upload/" + req.file.filename;

                    // Tiếp tục middleware chain
                    next();
               });
     } else {
          // Nếu không có tệp tin, tiếp tục middleware chain
          next();
     }
}

const initWebRoute = (app) => {
     router.get("/", controller.gethome);
     router.get("/home", (req, res) => {
          res.redirect("/");
     });
     router.get("/login", controller.get_login);
     router.get("/register", controller.get_login);
     router.get("/dashboard", authenticateToken, controller.get_dashboard);
     router.get("/tama", controller.gettama);
     return app.use("/", router);
};
module.exports = initWebRoute;
