const express = require("express");
const dotenv = require("dotenv");
const { mongoose } = require("mongoose");
const router = require("./route");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URIS;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // Maksimum 100 permintaan dalam waktu windowMs
  message:
    "Terlalu banyak permintaan dari IP Anda. Silakan coba lagi dalam beberapa menit.",
});

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

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
    saveUninitialized: false,
    store: store,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

app.use(router);
app.use(limiter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
