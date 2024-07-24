const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const fs = require('fs-extra');
const path = require("path");
const { join } = require("path");
const initWebRoute = require("./routes/route");
const initAuthRoute = require("./routes/auth");
const initApiRoute = require("./routes/api");
const database = require("./DB");
const cookieParser = require("cookie-parser");
const http = require('http')
const server = http.createServer(app)
const io = require('socket.io')(server);
const moment = require("moment");
const { checkAndSendData } = require("./utils/data")
// require("dotenv").config({ path: "./server.env" });
require("./socketHandler")(io)

//init session
require("dotenv").config();
app.use(cookieParser());
// template engine
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//middleware

// app.use(fileUpload())
app.use(express.static(path.join(__dirname, "public")));
// app.use(
//      "/build/",
//      express.static(path.join(__dirname, "node_modules/three/build"))
// );
// app.use(
//      "/jsm",
//      express.static(path.join(__dirname, "node_modules/three/examples/jsm"))
// );
initAuthRoute(app);
initWebRoute(app);
initApiRoute(app);
//run app
var device1 = "T300-30";
app.use((req, res, next) => {
     next(createHttpErrors.NotFound());
});

app.use((error, req, res, next) => {
     error.status = error.status || 500;
     res.status(error.status);
     res.render("404");
});
setInterval(() => { checkAndSendData() }, 5000)


const port = process.env.PORT;
server.listen(port, () =>
     console.log(`App listening at http://localhost:${port}`)
);
