const campusmodel = require("../models/campus.model");
const express = require("express");
const app = express();

app.get("/", async (req, res) => {
  try {
    const campus = await campusmodel.find({ status: true });
    idCampus = req.query.idCampus;
    const Campusfind = await campusmodel.findById(idCampus);
    if (Campusfind) {
      return res.status(400).json({
        estatus: "200",
        err: false,
        msg: "Information obtained correctly.",
        cont: {
          campusname: Campusfind,
        },
      });
    }
    if (campus.length <= 0) {
      res.status(404).send({
        estatus: "404",
        err: true,
        msg: "No campus were found in the database.",
        cont: {
          campus,
        },
      });
    } else {
      res.status(200).send({
        estatus: "200",
        err: false,
        msg: "Information obtained correctly.",
        cont: {
          campus,
        },
      });
    }
  } catch (err) {
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error getting the campus.",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

app.post("/", async (req, res) => {
  try {
    const campus = new campusmodel(req.body);
    let err = campus.validateSync();
    if (err) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error: Error to insert campus.",
        cont: {
          err,
        },
      });
    }
    const campusfind = await campusmodel.findOne({
      campusname: { $regex: `${campus.campusname}$`, $options: "i" },
    });
    if (campusfind) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "The campus you are trying to register already exists",
        cont: {
          campusname: campusfind.campusname,
        },
      });
    }
    const newcampus = await campus.save();
    if (newcampus.length <= 0) {
      res.status(400).send({
        estatus: "400",
        err: true,
        msg: "Error: campus could not be registered.",
        cont: {
          newcampus,
        },
      });
    } else {
      res.status(200).send({
        estatus: "200",
        err: false,
        msg: "Success: Information inserted correctly.",
        cont: {
          newcampus,
        },
      });
    }
  } catch (err) {
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error: Error to insert campus",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

app.put("/", async (req, res) => {
  try {
    const idCampus = req.query.idCampus;
    if (req.query.idCampus == "") {
      return res.status(400).send({
        estatus: "400",
        err: true,
        msg: "Error: A valid id was not sent.",
        cont: 0,
      });
    }
    req.body._id = idCampus;
    const campusfind = await campusmodel.findById(idCampus);
    if (!campusfind) {
      return res.status(404).send({
        estatus: "404",
        err: true,
        msg: "Error: The campus was not found in the database.",
        cont: campusfind,
      });
    }
    const newcampus = new campusmodel(req.body);
    let err = newcampus.validateSync();
    if (err) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error: Error inserting campues.",
        cont: {
          err,
        },
      });
    }
    const campusupdate = await campusmodel.findByIdAndUpdate(
      idCampus,
      { $set: newcampus },
      { new: true }
    );
    if (!campusupdate) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error: Trying to update the campus.",
        cont: 0,
      });
    } else {
      return res.status(200).json({
        ok: true,
        resp: 200,
        msg: "Success: The campus was updated successfully.",
        cont: {
          campusfind,
        },
      });
    }
  } catch (err) {
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error: Error updating campus.",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

app.delete("/", async (req, res) => {
  try {
    if (req.query.idCampus == "") {
      return res.status(400).send({
        estatus: "400",
        err: true,
        msg: "Error: A valid id was not sent.",
        cont: 0,
      });
    }
    idCampus = req.query.idCampus;
    const campusfind = await campusmodel.findById(idCampus);
    if (!campusfind) {
      return res.status(404).send({
        estatus: "404",
        err: true,
        msg: "Error: The campus was not found in the database.",
        cont: campusfind,
      });
    }
    const campusdelete = await campusmodel.findByIdAndDelete(campusfind);
    if (!campusdelete) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error: When trying to delete the campus.",
        cont: 0,
      });
    } else {
      return res.status(200).json({
        ok: true,
        resp: 200,
        msg: `Success: the campus has been successfully removed.`,
        cont: {
          campusdelete,
        },
      });
    }
  } catch (err) {
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error: Failed to delete campus.",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

module.exports = app;
