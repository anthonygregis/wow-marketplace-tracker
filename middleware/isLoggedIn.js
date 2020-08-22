module.exports = (req, res, next) => {
    if (!req.user) {
        req.flash('Error', 'You must be signed to access that page')
        res.redirect('/')
    } else {
        next()
    }
}