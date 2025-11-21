const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// middleware auth (yg sudah ada)
function authenticateToken(req, res, next){
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({error: "Token tidak ditemukan"});
    }

    jwt.verify(token, JWT_SECRET, (err, decodedPayload) => {
        if (err) {
            return res.status(403).json({error: "Token tidak valid"});
        }
        req.user = decodedPayload.user;
        next();
    });
}

// middleware autorisasi (baru)
function authorizeRole(role) {
    return (req, res, next) => {
        // middleware ini harus dijalankan setelah authenticateToken
        if (req.user && req.user.role == role) {
            next();
        } else {
            res.status(403).json({error: "Akses Dilarang: Peran tidak memadai"});
        }
    }
}

module.exports = {
    authenticateToken,
    authorizeRole
};