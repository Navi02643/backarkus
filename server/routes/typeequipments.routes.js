const Typeequipmentmodel = require("../models/typeequipment.model");
const express = require("express");
const app = express();

app.get("/", async (req, res) => {
  try {
    const typeequipment = await Typeequipmentmodel.find({ status: true });
    idTypeEquipment = req.query.idTypeEquipment;
    tename = req.query.tename;
    const typeequipmentfind = await Typeequipmentmodel.findById(
      idTypeEquipment
    );
    // const typeequipmentfind = await Typeequipmentmodel.find( {tename} );
    if (typeequipmentfind) {
      return res.status(400).json({
        estatus: "200",
        err: false,
        msg: "Information obtained correctly.",
        cont: {
          name: typeequipmentfind,
        },
      });
    }
    if (typeequipment.length <= 0) {
      res.status(404).send({
        estatus: "404",
        err: true,
        msg: "No types of equipments were found in the database.",
        cont: {
          typeequipment,
        },
      });
    } else {
      res.status(200).send({
        estatus: "200",
        err: false,
        msg: "Information obtained correctly.",
        cont: {
          typeequipment,
        },
      });
    }
  } catch (err) {
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error getting the types of equipments.",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

app.post("/", async (req, res) => {
  try {
    const typeequipment = new Typeequipmentmodel(req.body);
    let err = typeequipment.validateSync();
    if (err) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error: Error to insert type of equipment.",
        cont: {
          err,
        },
      });
    }
    const typeequipmentfind = await Typeequipmentmodel.find({
      tename: { $regex: `${typeequipment.tename}$`, $options: "i" },
    });
    
    if (typeequipmentfind) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "The type of equipment you are trying to register already exists",
        cont: {
          tename: typeequipmentfind,
        },
      });
    }
    const newtypeequipment = await typeequipment.save();
    if (newtypeequipment.length <= 0) {
      res.status(400).send({
        estatus: "400",
        err: true,
        msg: "Error: Type equipment could not be registered.",
        cont: {
          newtypeequipment,
        },
      });
    } else {
      res.status(200).send({
        estatus: "200",
        err: false,
        msg: "Success: Information inserted correctly.",
        cont: {
          newtypeequipment,
        },
      });
    }
  } catch (err) {
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error: Error to insert type equipment",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

app.put("/", async (req, res) => {
  try {
    const idTypeEquipment = req.query.idTypeEquipment;
    if (req.query.idTypeEquipment == "") {
      return res.status(400).send({
        estatus: "400",
        err: true,
        msg: "Error: A valid id was not sent.",
        cont: 0,
      });
    }
    req.body._id = idTypeEquipment;
    const typeequipmentfind = await Typeequipmentmodel.findById(
      idTypeEquipment
    );
    if (!typeequipmentfind) {
      return res.status(404).send({
        estatus: "404",
        err: true,
        msg: "Error: The type equipment was not found in the database.",
        cont: typeequipmentfind,
      });
    }
    const newtypeequipment = new Typeequipmentmodel(req.body);
    let err = newtypeequipment.validateSync();
    if (err) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error: Error inserting type equipment.",
        cont: {
          err,
        },
      });
    }
    const typeequipmentupdate = await Typeequipmentmodel.findByIdAndUpdate(
      idTypeEquipment,
      { $set: newtypeequipment },
      { new: true }
    );
    if (!typeequipmentupdate) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error: Trying to update the type equipment.",
        cont: 0,
      });
    } else {
      return res.status(200).json({
        ok: true,
        resp: 200,
        msg: "Success: The type equipment was updated successfully.",
        cont: {
          typeequipmentfind,
        },
      });
    }
  } catch (err) {
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error: Error updating type equipment.",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

app.delete("/", async (req, res) => {
  try {
    if (req.query.idTypeEquipment == "") {
      return res.status(400).send({
        estatus: "400",
        err: true,
        msg: "Error: A valid id was not sent.",
        cont: 0,
      });
    }

    idTypeEquipment = req.query.idTypeEquipment;
    const typeequipmentfind = await Typeequipmentmodel.findById(
      idTypeEquipment
    );
    if (!typeequipmentfind) {
      return res.status(404).send({
        estatus: "404",
        err: true,
        msg: "Error: The type equipment was not found in the database.",
        cont: typeequipmentfind,
      });
    }
    const typeequipmentdelete = await Typeequipmentmodel.findByIdAndDelete(
      typeequipmentfind
    );
    if (!typeequipmentdelete) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error: When trying to delete the type equipment.",
        cont: 0,
      });
    } else {
      return res.status(200).json({
        ok: true,
        resp: 200,
        msg: `Success: the type equipment has been successfully removed.`,
        cont: {
          typeequipmentdelete,
        },
      });
    }
  } catch (err) {
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error: Failed to delete type equipment.",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

module.exports = app;
