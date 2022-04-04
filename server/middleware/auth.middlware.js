const tokenService = require('../services/token.service');

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }

    try {
        // Bearer erwerfsdfsdfewrewrwerwerrwesdfsdff
        const token = req.headers.authorization? req.headers.authorization.split(' ')[1]: null;

        if (!token) {
            return res.status(401).json({message: 'Unauthorized'});

        }

        const data = tokenService.validateAccess(token)

        if (!data) {
            return res.status(401).json({ message: 'Unauthorized'});
        }
        req.user = data;
        next();

    } catch(error) {
return res.status(401).json({ message: `На сервере поризошла ошибка ${error.message}. Попробуйте позже.` });
    }
}