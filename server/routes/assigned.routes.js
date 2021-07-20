const assignedmodel = require("../models/assigned.model");
const equipmentmodel = require("../models/equipments.model");
const express = require("express");
const app = express();

app.get("/", async (req, res) => {
  email = req.query.email;
  try {
    const assigned = await assignedmodel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "IDuser",
          foreignField: "_id",
          as: "users",
        },
      },
      {
        $lookup: {
          from: "equipment",
          localField: "IDequipment",
          foreignField: "_id",
          as: "equipment",
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
          from: "its",
          localField: "assignedby",
          foreignField: "_id",
          as: "IT",
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [{ $arrayElemAt: ["$users", 0] }, "$$ROOT"],
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [{ $arrayElemAt: ["$equipment", 0] }, "$$ROOT"],
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
            $mergeObjects: [{ $arrayElemAt: ["$IT", 0] }, "$$ROOT"],
          },
        },
      },
      {
        $match: {
          $and: [{ email: email }],
        },                                                          
      },
    ]);
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

app.put("/", async (req, res) => {
  try {
    const idAssigned = req.query.idAssigned;
    if (req.query.idAssigned == "") {
      return res.status(400).send({
        estatus: "400",
        err: true,
        msg: "Error: A valid id was not sent.",
        cont: 0,
      });
    }

    req.body._id = idAssigned;
    const assignedfind = await assignedmodel.findById(idAssigned);
    if (!assignedfind) {
      return res.status(404).send({
        estatus: "404",
        err: true,
        msg: "Error: The assigned was not found in the database.",
        cont: assignedfind,
      });
    }
    const newassigned = new assignedmodel(req.body);
    let err = newassigned.validateSync();
    if (err) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error: Error inserting assigned",
        cont: {
          err,
        },
      });
    }
    const assignedupdate = await assignedmodel.findByIdAndUpdate(
      idAssigned,
      { $set: idAssigned },
      { new: true }
    );
    if (!assignedupdate) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error: Trying to update the assigned",
        cont: 0,
      });
    } else {
      res.status(200).json({
        ok: true,
        resp: 200,
        msg: "Success: The assigned was updated successfully.",
        cont: {
          assignedfind,
        },
      });
    }
  } catch (err) {
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error: Error updating assigned equipment.",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

app.delete("/", async (req, res) => {
  try {
    if (req.query.idAssigned == "") {
      return res.status(400).send({
        estatus: "400",
        err: true,
        msg: "Error: A valid id was not sent.",
        cont: 0,
      });
    }
    idAssigned = req.query.idAssigned;
    const assignedfind = await assignedmodel.findById(idAssigned);
    if (!assignedfind) {
      return res.status(404).send({
        estatus: "404",
        err: true,
        msg: "Error: The assigned was not found in the database.",
        cont: assignedfind,
      });
    }
    const assigneddelete = await assignedmodel.findByIdAndDelete(assignedfind);
    if (!assigneddelete) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error: When Trying to delete the assigned.",
        cont: 0,
      });
    } else {
      return res.status(200).json({
        ok: true,
        resp: 200,
        msg: "Success: The assigned has been successfully.",
        cont: {
          assigneddelete,
        },
      });
    }
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
