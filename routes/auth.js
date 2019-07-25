const express = require("express");
var router = express.Router();

var User = require("./../model/user");

router.get("/home", (req, res) => {
    if (req.session) {
        if (req.session.isUser) {
            res.render("dashboard");
        } else {
            res.redirect("/login");
        }
    } else {}
});

router.get("/register", (req, res) => {
    res.render("register", {
        name: "MrSdk",
        success: false,
        errors: []
    });
});

router.get("/login", (req, res) => {
    res.render("login", {
        success: false,
        errors: []
    });
});

router.post("/register", (req, res) => {
    var errors = [];
    var allow = true;

    var { name, email, login, password, password2 } = req.body;

    if (password != password2) {
        errors.push("Password not valid");
        allow = false;
    }
    if (password.length < 6) {
        errors.push("Password must bigger than 6");
        allow = false;
    }

    if (errors.length == 0) {

        User.findAll().then(result => {
            for (let i = 0; i < result.length; i++) {
                if (result[i].dataValues.login == login) {
                    errors.push("This login already exist");
                    allow = false;
                }
            }

            if (errors.length == 0) {
                User.create({
                        name: name,
                        email: email,
                        login: login,
                        password: password
                    })
                    .then(result => {

                        req.session.isUser = true;

                        res.status(200).render("register", {
                            success: allow,
                            errors: errors
                        });
                    })
                    .catch(e => {
                        console.log(e);
                        res.status(400).render("register", {
                            success: allow,
                            errors: errors
                        });
                    });
            } else {
                res.status(400).render("register", {
                    success: allow,
                    errors: errors
                });
            }
        });
    } else {
        res.status(400).render("register", {
            success: allow,
            errors: errors
        });
    }
});

router.post("/login", (req, res) => {
    var errors = [];
    var allow = true;

    var { login, password } = req.body;

    User.findAll()
        .then(result => {
            let isUser = false;
            result.forEach(user => {
                if (
                    user.dataValues.login == login &&
                    user.dataValues.password == password
                ) {
                    isUser = true;
                }
            });
            if (isUser) {
                req.session.isUser = true;
                res.redirect("/home");
            } else {
                errors.push("Login or password is incorrect !");
                res.status(400).render("login", {
                    success: false,
                    errors: errors
                });
            }
        })
        .catch(e => {
            console.log(e);
            res.status(400).render("login", {
                success: allow,
                errors: errors
            });
        });
});

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});

module.exports = router;