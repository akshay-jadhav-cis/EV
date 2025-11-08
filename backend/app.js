require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const PORT = process.env.PORT;
const methodOverride = require("method-override");
const Battery = require("./models/Battery");
const cors = require("cors");

const multer = require("multer");
const batteryRoute = require("./routes/batteryRoute");
const userRoute = require("./routes/userRoute");
async function main() {
    await mongoose.connect(process.env.MONGO_URL);
}
mongoose.set("strictQuery", true);
main().then(() => {
    console.log("Database Connection Successfully");
}).catch((e) => {
    console.error("Error occurred During the Database Connection");
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
app.listen(PORT, (req, res) => {
    console.log(`Port Is Listening At ${PORT}`);
});