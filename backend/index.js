//Creating the server using express js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./database/db");
const uploadRouter = require("./routes/uploadRouter")
const getRouter = require("./routes/getRouter")

const app = express();

connectDB();

app.use(bodyParser.json());

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/api', uploadRouter)
app.use('/get', getRouter)
app.use('/routes', getRouter)

app.listen(8000, () => {
  console.log("Bus Netwrok Server started listening!!!!");
});
