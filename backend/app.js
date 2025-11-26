require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const PORT = process.env.PORT || 1000;
const methodOverride = require("method-override");
const cors = require("cors");
const batteryRoute = require("./routes/batteryRoute");
const googleAuth = require("./routes/googleRoute");
const userRoute = require("./routes/userRoute");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const passport = require("passport");
require("./utils/GoogleAuth.js");

// =======================
// Database Connection
// =======================
async function main() {
  await mongoose.connect(process.env.MONGO_URL);
}
mongoose.set("strictQuery", true);
main()
  .then(() => console.log("Database Connected"))
  .catch((e) => console.error("DB Error:", e));

// =======================
// Middleware
// =======================
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// =======================
// CORS FIXED ✔
// =======================
app.use(
  cors({
    origin: "http://localhost:2000", // FRONTEND
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// =======================
// Session Setup ✔
// =======================
app.use(
  session({
    secret: process.env.SESSION_SECRET_CODE,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      collectionName: "sessions",
      ttl: 14 * 24 * 60 * 60,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      secure: false, // important for localhost (NO HTTPS)
      sameSite: "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// =======================
// Global Session User
// =======================
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

// =======================
// Routes
// =======================
app.use("/batteries", batteryRoute);
app.use("/users", userRoute);
app.use("/auth", googleAuth);

// =======================
// 404 Handler
// =======================
app.use((req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// =======================
// Error Handler
// =======================
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Something went wrong";
  console.error("❌ Server Error:", err);

  res.status(status).json({
    success: false,
    message,
  });
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
