const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
const coursesRoute = require("./courses");

app.use(express.json());
app.use(cors());

app.use("/courses", coursesRoute);

function authorize(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  // Extract the token from the header
  const token = authHeader.split(" ")[1];

  // Step 2: Decode the token and attach the decoded contents to the request
  const decoded = jwt.verify(token, JWT_SECRET);
  console.log(decoded);
  req.decoded = decoded;
  next();

  // STEP 2: Logic for getting the token and
  // decoding the contents of the token. The
  // decoded contents should be placed on req.decoded
  // If the token is not provided, or invalid, then
  // this function should not continue on to the
  // end-point and respond with an error status code.
}

const users = {};

// Some Basic Sign Up Logic. Take a username, name,
// and password and add it to an object using the
// provided username as the key
app.post("/signup", (req, res) => {
  const { username, name, password } = req.body;
  users[username] = {
    name,
    password, // NOTE: Passwords should NEVER be stored in the clear like this. Use a
    // library like bcrypt to Hash the password. For demo purposes only.
  };
  res.json({ success: "true" });
});

// A Basic Login end point
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  if (user && user.password === password) {
    // If the username and password are correct, create a JWT token for the user
    const token = jwt.sign({ name: username }, JWT_SECRET);

    // Send the token back to the client
    res.json({ token });
  } else {
    // If the username and/or password are incorrect, respond with an error
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// A Profile end-point that will return user information,
// in this example, the user's name that they provided
// when they signed up.
// The authorize middleware function must check for
// a token, verify that the token is valid, decode
// the token and put the decoded data onto req.decoded
app.get("/profile", authorize, (req, res) => {
  res.json(req.decoded);
});

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
