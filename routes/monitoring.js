const express = require('express')
const router = express.Router()
const passport = require('../config/ppConfig')
const isLoggedIn = require('../middleware/isLoggedIn')

app.get('/', isLoggedIn, (req, res) => {
    db.monitoredItem.findAll({
        where: {
            userId: req.user.id
        }
    })
        .then(monitoredItems => {
            res.send(monitoredItems)
        })
        .catch(err => {
            console.log(err)
        })
})