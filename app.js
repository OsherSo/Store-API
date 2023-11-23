require("dotenv").config();
const express = require("express");

const connectDB = require("./db/connect");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());

app.get("/", (req, res, next) => {
  res.send("<h1>Store API</h1>");
});

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server is listening port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
