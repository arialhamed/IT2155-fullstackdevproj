
const router = require('express').Router();

router.get('/login', function(req, res, next) {  
    res.send(templates.auth({body:templates.login}));
});

router.get('/register', function(req, res, next) {  
    res.send(templates.auth({body:templates.register}));
});

router.get('/2fa', function(req, res, next) {  
    res.send(templates.auth({body:templates['2fa']}));
});

module.exports = router;