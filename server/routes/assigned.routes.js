const assignedmodel = require("../models/assigned.model");
const equipmentmodel = require("../models/equipments.model");
const express = require("express");
const app = express();

app.get("/", async (req, res) => {
  email = req.query.email;
  try {
    const assigned = await assignedmodel.find({IDuser: email});
    idAssigned = req.query.idAssigned;
    const assignedfind = await assignedmodel.findById(idAssigned);
    if (assignedfind) {
      return res.status(400).json({
        estatus: "200",
        err: false,
        msg: "Information obtained correctly.",
        cont: {
          name: assignedfind,
        },
      });
    }
    if (assigned.length <= 0) {
      res.status(404).send({
        estatus: "404",
        err: true,
        msg: "No assigned were found in the database.",
        cont: {
          assigned,
        },
      });
    } else {
      res.status(200).send({
        estatus: "200",
        err: false,
        msg: "Information obtained correctly.",
        cont: {
          assigned,
        },
      });
    }
  } catch (err) {
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error getting assigned equipments.",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

app.post("/", async (req, res) => {
  try {
    const assigned = new assignedmodel(req.body);
    let err = assigned.validateSync();
    if (err) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        ms: "Error: Error to insert assigned",
        cont: {
          err,
        },
      });
    }
    const newassigned = await assigned.save();
    if (newassigned.length <= 0) {
      res.status(400).send({
        estatus: "400",
        err: true,
        msg: "Error: Assigned could not be registered.",
        newassigned,
      });
    } else {
      res.status(200).send({
        estatus: "200",
        err: false,
        msg: "Success: Information inserted correctly.",
      });
    }
  } catch (err) {
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error: Error to assign the equipment",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});


app.delete("/", async (req, res) => {
  try {
    email = req.query.email;
    const assigned = await assignedmodel.deleteMany({IDuser: email});
  } catch (err) {
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error: Failed to delete assigned equipment.",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

module.exports = app;
