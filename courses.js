const fs = require("fs");
const express = require("express");
const router = express.Router();
const port = process.env.PORT || 8080;

function readFile(callback) {
  fs.readFile("./data/courses.json", "utf-8", (err, data) => {
    if (err) {
      console.log("File couldn't be found.");
    } else {
      callback(data);
    }
  });
}

router.get("/", (req, res) => {
  readFile((data) => {
    const parsedData = JSON.parse(data);
    console.log(data);

    res.send(parsedData);
  });
});

module.exports = router;
