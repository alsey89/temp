const { createServer } = require("http");
const express = require("express");
const session = require("express-session");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const mongoSanitize = require("express-mongo-sanitize");
const passport = require("passport");

const app = express();
const httpServer = createServer(app);

//websocket logic
require("./game/shami.js")(httpServer);

//env config
dotenv.config({ path: "./config/config.env" });

//logging
app.use(morgan("dev"));

//db configuration and connect
const db = process.env.MONGO_URI;
try {
  mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log("MongoDB Connected..."));
} catch (error) {
  handleError(error);
}

//session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      // secure: true,
      httpOnly: true,
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
  })
);

//for passportjs authentication
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport.js");

//parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(mongoSanitize());

//ROUTES
app.use("/", require("./routes/index"));
app.use("/api", require("./routes/index"));
app.use("/api", require("./routes/auth"));
app.use("/api", require("./routes/game"));
app.use("/api", require("./routes/contentManagement"));
app.use("/api", require("./routes/profile"));

//server listening
httpServer.listen(process.env.PORT, () => {
  console.log(`Listening on port: ${process.env.PORT}...`);
});
