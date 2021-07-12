const equipmentmodel = require("../models/equipments.model");
const express = require("express");
const pdf = require("html-pdf");
const app = express();

app.get("/", async (req, res) => {
  try {
    typeequipment = req.query.typeequipment;
    state = req.query.state;
    const equipment = await equipmentmodel.aggregate([
      {
        $lookup: {
          from: "campus",
          localField: "IDcampus",
          foreignField: "_id",
          as: "campus",
        },
      },
      {
        $lookup: {
          from: "typeequipments",
          localField: "IDtypeequipment",
          foreignField: "_id",
          as: "typeequipments",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "IDuser",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [{ $arrayElemAt: ["$campus", 0] }, "$$ROOT"],
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [{ $arrayElemAt: ["$typeequipments", 0] }, "$$ROOT"],
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [{ $arrayElemAt: ["$user", 0] }, "$$ROOT"],
          },
        },
      },
      {
        $match: {
          $and: [{ tename: typeequipment }, { status: true }],
        },
      },
      {
        $sort: { state: -1},
      },
    ]);
    idEquipment = req.query.idEquipment;
    const equipmentfind = await equipmentmodel.findById(idEquipment);
    if (equipmentfind) {
      return res.status(400).json({
        estatus: "200",
        err: false,
        msg: "Information obtained correctly.",
        cont: {
          name: equipmentfind,
        },
      });
    }
    if (equipment.length <= 0) {
      res.status(404).send({
        estatus: "404",
        err: true,
        msg: "No equipments were found in the database.",
        cont: {
          equipment,
        },
      });
    } else {
      res.status(200).send({
        estatus: "200",
        err: false,
        msg: "Information obtained correctly.",
        cont: {
          equipment,
        },
      });
    }
  } catch (err) {
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error getting equipments.",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

app.post("/", async (req, res) => {
  try {
    const equipment = new equipmentmodel(req.body);
    let err = equipment.validateSync();
    if (err) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error: Error to insert equipment",
        cont: {
          err,
        },
      });
    }
    const equipmentfind = await equipmentmodel.findOne({
      serialnumber: { $regex: `${equipment.serialnumber}$`, $options: "i" },
    });
    if (equipmentfind) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "This equipment already exists",
        cont: {
          serialnumber: equipmentfind,
        },
      });
    }
    const newequipment = await equipment.save();
    if (newequipment.length <= 0) {
      res.status(400).send({
        estatus: "400",
        err: true,
        msg: "Error: equipment could not be registered",
        cont: {
          newequipment,
        },
      });
    } else {
      res.status(200).send({
        estatus: "200",
        err: false,
        msg: "Success: Information register correctly.",
        cont: {
          newequipment,
        },
      });
    }
  } catch (err) {
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error: Error to insert the equipment",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

app.post("/pdf", async (req, res) => {});

app.put("/", async (req, res) => {
  try {
    const idEquipment = req.query.idEquipment;
    if (req.query.idEquipment == "") {
      return res.status(400).json({
        estatus: "400",
        err: true,
        msg: "Error: A valid id was not sent",
        cont: 0,
      });
    }
    req.body._id = idEquipment;
    const equipmentfind = await equipmentmodel.findById(idEquipment);
    if (!equipmentfind) {
      return res.status(400).json({
        estatus: "404",
        err: true,
        msg: "Error: The equipment was not found in the database.",
        cont: equipmentfind,
      });
    }
    const newequipment = new equipmentmodel(req.body);
    let err = newequipment.validateSync();
    if (err) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error: Error inserting equipment",
        cont: {
          err,
        },
      });
    }
    const equipmentupdate = await equipmentmodel.findByIdAndUpdate(
      idEquipment,
      { $set: newequipment },
      { new: true }
    );
    if (!equipmentupdate) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error: Trying to update the equipment",
        cont: 0,
      });
    } else {
      return res.status(400).json({
        ok: true,
        resp: 200,
        msg: "Success: The equipment was update successfully.",
        cont: {
          equipmentupdate,
        },
      });
    }
  } catch (err) {
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error: Error updating equipment.",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

app.delete("/", async (req, res) => {
  try {
    if (req.query.idEquipment == "") {
      return res.status(400).send({
        estatus: "400",
        err: true,
        msg: "Error: A valid id was not sent.",
        cont: 0,
      });
    }
    idEquipment = req.query.idEquipment;
    status = req.body.status;
    const equipmentfind = await equipmentmodel.findById(idEquipment);
    if (!equipmentfind) {
      return res.status(404).send({
        estatus: "404",
        err: true,
        msg: "Error: The user cannot be found in the database.",
        cont: equipmentfind,
      });
    }
    const equipmentupdate = await equipmentmodel.findByIdAndUpdate(
      idEquipment,
      { $set: { status: status } },
      { new: true }
    );
    if (!equipmentupdate) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error:: when trying to delete the equipment.",
        cont: 0,
      });
    } else {
      return res.status(200).json({
        ok: true,
        resp: 200,
        msg: `Success: se a ${
          status === "true" ? "Activate" : " Delete"
        } the equipment`,
      });
    }
  } catch (err) {
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error: Failed to delete equipment.",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

module.exports = app;
