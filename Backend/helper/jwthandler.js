import jwt from "jsonwebtoken";
import "dotenv/config";

const setuser = (a) => {
  let userJWT = {};
  userJWT.name = a.isUserExist.name;
  userJWT.ID = a.isUserExist._id;
  userJWT.email = a.isUserExist.email;
  return jwt.sign(userJWT, process.env.SECRET, { expiresIn: "1h" });
};

function loginChecker_verifyuser(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "No token provided please login" });
  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token please login" });
    }

    req.user = user;
    next();
  });
}

export { setuser, loginChecker_verifyuser };
