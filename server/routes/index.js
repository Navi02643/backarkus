const express = require("express");
const app = express();

app.use("/campus", require("./campus.routes"));
app.use("/equipments", require("./equipments.routes"));
app.use("/role", require("./role.routes"));
app.use("/typeequipments", require("./typeequipments.routes"));
app.use("/user", require("./user.routes"));
app.use("/waiting", require("./waiting.routes"));
app.use("/filters", require("./filters.routes"));
app.use("/pdf",require("./pdf.routes"));

module.exports = app;
