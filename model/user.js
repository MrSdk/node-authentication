const Sequelize = require("sequelize")
const db = require("./../config/db.js")

var User = db.define('user', {
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    login: Sequelize.STRING,
    password: Sequelize.STRING,
    sendEmail: Sequelize.BOOLEAN,
    changePass: Sequelize.BOOLEAN
}, {
    tableName: 'user'
})

module.exports = User