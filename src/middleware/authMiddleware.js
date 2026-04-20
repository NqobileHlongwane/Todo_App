import jwt from 'jsonwebtoken'


//==generating athentication upon login in
function authMiddleware(req, res, next) {
    // Bearer htdhtiaiihggjhgnbhjixdxjf
    const authHeader = req.headers['authorization'];

    console.log("AUTH HEADER:", authHeader);

    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    // remove "Bearer "
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Invalid token format" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            console.log("JWT ERROR:", error.message);
            return res.status(401).json({ message: "Invalid token" });
        }

        console.log("DECODED:", decoded);

        req.user_id = decoded.user_id;
        //load todo page as next
        next();
    });
}

export default authMiddleware