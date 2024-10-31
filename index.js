const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const authRouter = require("./routes/user.route");
const { mongoose } = require("mongoose");

app.use(compression());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());

app.use(cors());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err, "error in db connecting");
  });
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/auth", authRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
