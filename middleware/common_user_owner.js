const isLoggedIn = require('./isLoggedIn');
const isOwnerLoggedIn = require('./isOwnerLoggedIn');

module.exports = function() {
    return async function(req, res, next) {
        try {
            // Try user auth first
            await isLoggedIn(req, res, () => {
                req.isUser = true;
                return next();
            }).catch(async () => {
                // If user auth fails, try owner auth
                await isOwnerLoggedIn(req, res, () => {
                    req.isOwner = true;
                    return next();
                }).catch(() => {
                    // Both failed - redirect to login
                    req.flash("error", "Please login to access this page");
                    return res.redirect('/login');
                });
            });
        } catch (err) {
            console.error(err);
            res.status(500).send("Authentication error");
        }
    };
};