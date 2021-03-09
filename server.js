const dotenv = require("dotenv");
const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");
const PORT = process.env.PORT || 5000;
dotenv.config({ path: `${__dirname}/config.env` });
//connecting to Database
// switch (process.env.NODE_ENV) {
//   case 'production':
//     path = `${__dirname}/prod.env`;
//     break;
//   default:
//     path = `${__dirname}/dev.env`;
// }
// dotenv.config({ path });

connectDB();

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
    res.send("Api running 2");
  });
}

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
