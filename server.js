const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 5000;

//connecting to Database

connectDB();
app.get("/", (req, res) => {
  res.send("API running");
});

//Middleware
app.use(express.json({ extended: false }));
app.use(cors());
//Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/profile", require("./routes/api/profile"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Api running");
  });
}

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
