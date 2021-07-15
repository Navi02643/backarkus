const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const passport = require("passport");

////////INITIALIZATIONS
require("./config/db");
require("colors");
require("./middlewares/passport")(passport);

////////MIDDLEWARES
app.use(passport.initialize());
////////////////////////

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

app.use(bodyParser.json());

/////////ROUTES
app.use("/api", require("./routes/index"));

/////////CONNECTION TO MONGODB
mongoose
  .connect(process.env.URLDB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((resp) => {
    console.log(
      "[SERVER]".green,
      `Base de datos ONLINE en ${process.env.URLDB}`
    );
  })
  .catch((err) => {
    console.log("[SERVER]".red, `Conexion fallida: ${err}`);
  });

app.use((req, res, next) => {
  return res.status(404).send({
    resp: "404",
    err: true,
    msg: `URL ${req.url} Not Found`,
    cont: {},
  });
});

server = app.listen(process.env.PORT, () => {
  console.log(`Our app is running on port ${ process.env.PORT }`);

});
