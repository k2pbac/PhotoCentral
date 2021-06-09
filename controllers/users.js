const User = require("../models/user");


module.exports.renderUserForm = (req, res) => {
    res.render("users/register");
};

module.exports.createUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = await new User({ email, username });
        const newUser = await User.register(user, password);
        req.login(newUser, err => {
            if (err) return next();
        });
        req.flash("success", "Welcome to Photo Central!");
        res.redirect("/photos");
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}
    };

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login");
};

module.exports.userLogin = async (req, res) => {
    req.flash("success", `Welcome back ${req.user.username[0].toUpperCase() + req.user.username.slice(1)}!`);
    const redirectUrl = req.session.returnTo || "/photos";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.userLogout = (req, res) => {
    req.logout();
    delete res.locals.user;
    req.flash("success", "Logged you out!");
    res.redirect("/photos");
};