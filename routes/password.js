const express = require("express");
var router = express.Router();

var nodemailer = require("nodemailer");

var User = require("./../model/user");

var transporter = nodemailer.createTransport({
    // host: "smtp.gmail.com",
    // port: 587,
    // secure: false,
    // requireTLS: true,
    service: "gmail",
    auth: {
        user: "mrsdk1902@gmail.com", // "mrsdk1902@gmail.com",
        pass: "developer.sdk" // "developer.sdk"
    }
});

router.get("/writeEmail", (req, res) => {
    res.render("forgot/selectEmail", {
        success: false,
        errors: []
    });
});

router.post("/verify", (req, res) => {
    var { email } = req.body;
    var errors = [];

    if (email == "") {
        errors.push("Email required");
    }

    User.findAll().then(result => {
        let has = false;
        let user;
        for (let i = 0; i < result.length; i++) {
            if (result[i].dataValues.email == email) {
                has = true;
                user = result[i].dataValues;
            }
        }

        if (!has) {
            errors.push("This email doesn't exist");
        }

        if (errors.length == 0) {

            var output = `
            <h1>Hello ${user.name}</h1>
            <h2>You can follow this link for change your password in TestingAuthenticate.com </h2> <br>
            <span>http://localhost:8080/password/verify-email/${user.id}</span>
            `;

            let mailOptions = {
                from: "mrsdk1902@gmail.com", // sender address
                to: email, // list of receivers
                subject: "SMS ✔", // Subject line
                html: output // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (err, ress) => {
                if (err) {
                    console.log(err);
                    console.log("AAAAAAAAAAAAAAAAAAAAAAA");

                }

                console.log(ress);

                res.status(200).render("forgot/verify", {
                    success: false,
                    errors: errors,
                    email: email
                });

            });
        } else {
            res.status(400).render("forgot/selectEmail", {
                success: false,
                errors: errors
            });
        }
    });
});

router.get('/verify-email/:id', (req, res) => {
    var id = req.params.id
    var errors = []

    User.findAll().then(result => {
        let has = false;
        let user;
        for (let i = 0; i < result.length; i++) {
            if (result[i].dataValues.id == id) {
                has = true;
                user = result[i].dataValues;
            }
        }

        if (!has) {
            errors.push("This email doesn't exist");
        }

        if (errors.length == 0) {
            User.findByPk(id).then(thisUser => {
                thisUser.update({
                    name: user.name,
                    email: user.email,
                    login: user.login,
                    password: user.password,
                    sendEmail: user.sendEmail,
                    changePass: true
                }).then(() => {
                    res.render('forgot/changePass', {
                        id: user.id,
                        errors: errors,
                        success: false
                    })
                }).catch(e => {
                    console.log(e);
                    res.status(400).json(e)
                })
            }).catch(e => {
                console.log(e);
                res.status(400).json(e)
            })
        } else {
            res.render('login', {
                errors: errors,
                success: false
            })
        }

    })

});

router.post('/change', (req, res) => {
    var { password, password2, id } = req.body;
    var errors = []

    if (password != password2) {
        errors.push("Password not valid");
    }
    if (password.length < 6) {
        errors.push("Password must bigger than 6");
    }


    User.findByPk(id).then(result => {
        var user = result.dataValues;
        console.log(result);
        if (result.dataValues.changePass && errors.length == 0) {
            result.update({
                name: user.name,
                email: user.email,
                login: user.login,
                password: password,
                sendEmail: user.sendEmail,
                changePass: false
            }).then(() => {
                res.render('login', {
                    errors: errors,
                    success: true
                })
            }).catch(e => {

            })
        } else {
            res.status(400).render('forgot/changePass', {
                id: id,
                errors: errors,
                success: false
            })
        }
    })

})

module.exports = router;