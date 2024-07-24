let gethome = (req, res) => {
     res.render("home");
};
let get_login = (req, res) => {
     res.render("login");
};
let get_dashboard = (req, res) => {
     res.render("dashboard", { username: req.username });
     // res.render("dashboard");
};
let gettama = (req, res) => {
     res.render("tama");
};

module.exports = {
     gethome,
     get_login,
     get_dashboard,
     gettama,
};
