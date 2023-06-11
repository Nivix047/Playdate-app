const jwt = require("jsonwebtoken");

const secret = "mysecretsshhhhh";
const expiration = "2h";

module.exports = {
  authMiddleware: function (req, res, next) {
    // allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    console.log("token before splitting:", token);

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
      console.log(`Extracted Token: ${token}`); // Log the extracted token
    }

    console.log("token after splitting:", token);

    if (!token) {
      return res.status(401).json({ message: "No token provided" }); // Respond with an error if no token
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
      next();
    } catch {
      console.log("Invalid token");
      res.status(401).json({ message: "Invalid token" }); // Respond with an error if token is invalid
    }
  },

  signToken: function (user) {
    const payload = { username: user.username, _id: user._id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};

// const jwt = require("jsonwebtoken");

// const secret = "mysecretsshhhhh";
// const expiration = "2h";

// module.exports = {
//   authMiddleware: function (req, res, next) {
//     // allows token to be sent via req.body, req.query, or headers
//     let token = req.body.token || req.query.token || req.headers.authorization;

//     // ["Bearer", "<tokenvalue>"]
//     if (req.headers.authorization) {
//       token = token.split(" ").pop().trim();
//     }

//     if (!token) {
//       return next(); // Go to the next middleware/route handler
//     }

//     try {
//       const { data } = jwt.verify(token, secret, { maxAge: expiration });
//       req.user = data;
//       next();
//     } catch {
//       console.log("Invalid token");
//       next();
//     }
//   },

//   signToken: function (user) {
//     const payload = { username: user.username, _id: user._id };

//     return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
//   },
// };
