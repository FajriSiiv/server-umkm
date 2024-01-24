const express = require("express");
const dotenv = require("dotenv");
const { mongoose } = require("mongoose");
const router = require("./route");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

dotenv.config();
app.use(express.json());
app.use(cors());

mongoose
  .connect(
    MONGODB_URI,

    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

const store = new MongoStore({
  uri: MONGODB_URI,
  collection: "sessions",
  expires: 1000 * 60 * 60 * 24,
});

store.on("error", function (error) {
  console.error("Session store error:", error);
});

app.use(
  session({
    secret: "secret-session",
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
