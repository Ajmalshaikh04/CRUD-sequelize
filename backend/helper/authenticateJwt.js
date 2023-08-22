require("dotenv").config();
const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Missing token." });
  }

  jwt.verify(
    token.split(" ")[1],
    process.env.JWT_SECRET,
    (err, decodedToken) => {
      if (err) {
        console.error("Error verifying token:", err);
        return res.status(403).json({ error: "Forbidden: Invalid token." });
      }

      req.user = decodedToken;
      next();
    }
  );
};

module.exports = { authenticateJWT };

//==============================

// helpers/authenticatejwt.js

// require("dotenv").config();
// const jwt = require("jsonwebtoken");

// const authenticateJWT = (req, res, next) => {
//   const token = req.header("Authorization");

//   if (!token) {
//     return res.status(401).json({ error: "Unauthorized: Missing token." });
//   }

//   jwt.verify(
//     token.split(" ")[1],
//     process.env.JWT_SECRET,
//     (err, decodedToken) => {
//       if (err) {
//         console.error("Error verifying token:", err);
//         return res.status(403).json({ error: "Forbidden: Invalid token." });
//       }

//       req.user = decodedToken;
//       next();
//     }
//   );
// };

// module.exports = { authenticateJWT };
