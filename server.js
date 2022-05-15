const express = require("express");
const bcrypt = require("bcrypt");
const app = express();

app.use(express.json());

let users = [];

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const user = { name: req.body.name, password: hashedPass };
    users.push(user);
    res.status(201).send("Added!!!");
  } catch (error) {
    res.status(500).send("There is an error");
    console.log("There is an error", error);
  }
});

app.post("/users/login", async (req, res) => {
  const user = users.find((user) => user.name === req.body.name);
  if (user == null) {
    return res.sendStatus(400).send("User Not Found");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send("Logged In");
    } else {
      res.send("Not Allowed");
    }
  } catch (error) {
    res.status(500).send("There is an error");
  }
});

app.listen(3000);
