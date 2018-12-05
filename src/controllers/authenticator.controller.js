const User = require('../models/user.model')
const ApiError = require('../models/apierror.model')
const pool = require('../config/db')

module.exports = {
    register(req, res, next) {
        if (req.body.email == null || req.body.email == '') {
            return next(new ApiError('Email is ongeldig', 500))
        } else if (req.body.password == null || req.body.password == '') {
            return next(new ApiError('Wachtwoord moet worden ingevuld', 500))
        }
        const user = new User(req.body.email, req.body.password)
        const date = new Date()
        pool.execute("INSERT INTO users (email, password, creationDate, LaatstGewijzigdOp) VALUES (?,?,?,?)",
            [user.email, user.password, date, date],
            function (err, results, fields) {
                if (err) {
                    return next(new ApiError(err, 500))
                }
                res.status(200).json({ message: `Het toevoegen van ${user.email} is gelukt` }).end()
            }
        )
    },

    login(req, res, next) {
        if (req.body.email == null || req.body.email == '') {
            return next(new ApiError('Email is ongeldig', 500))
        } else if (req.body.password == null || req.body.password == '') {
            return next(new ApiError('Wachtwoord moet worden ingevuld', 500))
        }
        const user = new User(req.body.email, req.body.password)
        pool.execute("SELECT id FROM users WHERE email = ? AND password = ?",
        [user.email, user.password],
            function (err, results, fields) {
                if (err) {
                    return next(new ApiError(err, 500))
                }else if(results[0] == null){
                    return next(new ApiError('incorrecte login gegevens', 500))
                }
                res.status(200).json({message: `${user.email} is succesvol ingelogd`}).end()
            }
        )
    },

    update(req, res, next){
        if (req.body.email == null || req.body.email == '') {
            return next(new ApiError('Email is ongeldig', 500))
        } else if (req.body.password == null || req.body.password == '') {
            return next(new ApiError('Wachtwoord moet worden ingevuld', 500))
        } else if (req.body.newpassword == null || req.body.newpassword == '') {
            return next(new ApiError('Nieuwe wachtwoord moet worden ingevuld', 500))
        }
        const date = new Date()
        console.log(req.body.newpassword+"\n"+date+"\n"+req.body.email+"\n"+req.body.password)
        pool.execute(
            "UPDATE users SET password = ?, LaatstGewijzigdOp = ? WHERE email = ? AND password = ?"),
            [req.body.newpassword, date, req.body.email, req.body.password],
            function (err, results, fields) {
                if (err){
                    return next(new ApiError(err, 500))
                }
             res.status(200).json({ message: req.body.email + ' succesvol geüpdate' }).end()
        }
    },

    delete(req, res, next) {
        if (req.body.email == null || req.body.email == '') {
            return next(new ApiError('Email is ongeldig', 500))
        } else if (req.body.password == null || req.body.password == '') {
            return next(new ApiError('Wachtwoord moet worden ingevuld', 500))
        }
        pool.execute(
            "DELETE FROM users WHERE email = ? AND password = ?",
            [req.body.email, req.body.password],
            function (err, results, fields) {
                if (err) {                        
                    return next(new ApiError(err, 500))
                }
                res.status(200).json({ message: req.body.email + ' succesvol verwijderd' }).end()
            }
        )
    }
}