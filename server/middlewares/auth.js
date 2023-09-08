const jwt = require("jsonwebtoken");

async function verifyToken(req, res, next) {
    try {
        const token = req.headers["x-accesss-token"];
        if (!token) {
            return res
                .status(401)
                .send({ auth: false, message: "No token provided" });
        }
        const decoded = await jwt.verify(token, "mysecretkey");
        req.userId = decoded.id;
        req.personId = decoded.id_person;
        // Si la petición incluye la cabecera x-student-id
        if (req.headers["x-student-id"]) {
            req.studentId = req.headers["x-student-id"];
        }

        next();
    } catch (err) {
        console.error(err.name);
        // maybe also call next(err)?
        return res.status(402).send({ confirmation: "fail", message: err });
        // res.json({confirmation: 'fail', message: err});
    }
}
async function verifyTokenIntranet(req, res, next) {
    try {
        const token = req.headers["x-accesss-token"];
        if (!token) {
            return res
                .status(401)
                .send({ auth: false, message: "No token provided" });
        }
        const decoded = await jwt.verify(token, "[*?¿12JOSE13*]");
        req.userId = decoded.id;

        next();
    } catch (err) {
        console.error(err.name);
        // maybe also call next(err)?
        return res.status(402).send({ confirmation: "fail", message: err });
        // res.json({confirmation: 'fail', message: err});
    }
}

module.exports = verifyToken;
