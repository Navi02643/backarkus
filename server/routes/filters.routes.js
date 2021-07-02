const filtermodel = require("../models/filters.model");
const express = require("express");
const app = express();

app.get("/", async (req, res) => {
  try{
    const filter = await filtermodel.find();
    const idFilter = req.query.idFilter;
    const filterfind = await filtermodel.findById(idFilter);
    if(filterfind){
      return res.status(400).json({
        estatus: "200",
        err: false,
        msg: "Information obtained correctly.",
        cont: {
          name: filterfind,
        },
      });
    }
    if ( filter.length <= 0){
      res.status(404).send({
        estatus: "404",
        err: true,
        msg: "No filters were found in the database.",
        cont: {
          filter,
        },
      });
    } else {
      res.status(200).send({
        estatus: "200",
        err: false,
        msg: "Information obtained correctly.",
        cont: {
          filter,
        },
      });
    }
  }catch(err){
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error getting the filters.",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

app.post("/", async (req, res) => {
  try {
    const filter = new filtermodel(req.body);
    let err = filter.validateSync();
    if (err) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error: Error to insert filters.",
        cont: {
          err,
        },
      });
    }
    const newfilter = await filter.save();
    if (newfilter.length <= 0) {
      res.status(400).send({
        estatus: "400",
        err: true,
        msg: "Error: filters could not be registered.",
        cont: {
          newfilter,
        },
      });
    } else {
      res.status(200).send({
        estatus: "200",
        err: false,
        msg: "Success: Information inserted correctly.",
        cont: {
          newfilter,
        },
      });
    }
  } catch (err) {
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error: Error to insert filters",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

app.put("/", async (req, res) => {
  try {
    const idFilter = req.query.idFilter;
    if (req.query.idFilter == "") {
      return res.status(400).send({
        estatus: "400",
        err: true,
        msg: "Error: A valid id was not sent.",
        cont: 0,
      });
    }
    req.body._id = idFilter;
    const filterfind = await filtermodel.findById(idFilter);
    console.log(filterfind);
    if (!filterfind) {
      return res.status(404).send({
        estatus: "404",
        err: true,
        msg: "Error: The filters was not found in the database.",
        cont: filterfind,
      });
    }
    const newfilter = new filtermodel(req.body);
    let err = newfilter.validateSync();
    if (err) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error: Error inserting filters.",
        cont: {
          err,
        },
      });
    }
    const filterupdate = await filtermodel.findByIdAndUpdate(
      idFilter,
      { $set: newfilter },
      { new: true }
    );
    if (!filterupdate) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error: Trying to update the filters.",
        cont: 0,
      });
    } else {
      return res.status(200).json({
        ok: true,
        resp: 200,
        msg: "Success: The filters was updated successfully.",
        cont: {
          filterfind,
        },
      });
    }
  } catch (err) {
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error: Error updating filters.",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

module.exports = app;
