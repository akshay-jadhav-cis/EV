require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const PORT = process.env.PORT;
const methodOverride = require("method-override");
const cors = require("cors");
const batteryRoute = require("./routes/batteryRoute");
const userRoute = require("./routes/userRoute");
const ExpressError=require("./utils/ExpressError")
async function main() {
    await mongoose.connect(process.env.MONGO_URL);
}
mongoose.set("strictQuery", true);
main().then(() => {
    console.log("Database Connection Successfully");
}).catch((e) => {
    console.error("Error occurred During the Database Connection = ",e);
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")))
app.use(cors({
    origin: "http://localhost:2000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
app.use("/batteries",batteryRoute);
app.use("/users",userRoute);
app.use((req,res,next)=>{
    next(new ExpressError("Page Not Found",404));
})
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  console.error("❌ Express Error:", err);

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }), // show stack only in dev
  });
});
app.listen(PORT, (req, res) => {
    console.log(`Port Is Listening At ${PORT}`);
});