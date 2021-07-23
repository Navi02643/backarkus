const waitingmodel = require("../models/waiting.model");
const express = require("express");
const app = express();

app.get("/", async (req, res) => {
  try {
    const waiting = await waitingmodel.aggregate([
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
          from: "typeequipments",
          localField: "IDtypeequiment",
          foreignField: "_id",
          as: "typeequipments",
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
            $mergeObjects: [{ $arrayElemAt: ["$typeequipments", 0] }, "$$ROOT"],
          },
        },
      },
      {
        $project: {
          _id: 0,
          username: 1,
          lastname: 1,
          IDuser: 1,
          tename: 1,
          IDtypeequiment: 1,
        },
      },
    ]);
    console.log(waiting);
    idWaiting = req.query.idWaiting;
    const waitingfind = await waitingmodel.findById(idWaiting);
    if (waitingfind) {
      return res.status(400).json({
        estatus: "200",
        err: false,
        msg: "Information obtained correctly.",
        cont: {
          name: waitingfind,
        },
      });
    }
    if (waiting.length <= 0) {
      res.status(404).send({
        estatus: "404",
        err: true,
        msg: "No waiting were found in the database.",
        cont: {
          waiting,
        },
      });
    } else {
      res.status(200).send({
        estatus: "200",
        err: false,
        msg: "Information obtained correctly.",
        cont: {
          waiting,
        },
      });
    }
  } catch (err) {
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error getting waiting equipments.",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

app.post("/", async (req, res) => {
  try {
    const waiting = new waitingmodel(req.body);
    let err = waiting.validateSync();
    if (err) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error: Error to insert waiting.",
        cont: {
          err,
        },
      });
    }
    const newWaiting = await waiting.save();
    if (newWaiting.length <= 0) {
      res.status(400).send({
        estatus: "400",
        err: true,
        msg: "Error: Waiting could not be registered.",
        cont: {
          newWaiting,
        },
      });
    } else {
      res.status(200).send({
        estatus: "200",
        err: false,
        msg: "Success: Information inserted correctly.",
        cont: {
          newWaiting,
        },
      });
    }
  } catch (err) {
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error: Error to waiting equipment",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

app.put("/", async (req, res) => {
  try {
    const idWaiting = req.query.idWaiting;
    if (req.query.idWaiting == "") {
      return res.status(400).send({
        estatus: "400",
        err: true,
        msg: "Error: A vaild id was not sent",
        cont: 0,
      });
    }

    req.body._id = idWaiting;
    const waitingfind = await waitingmodel.findById(idWaiting);
    if (!waitingfind) {
      return res.status(404).send({
        estatus: "404",
        err: true,
        msg: "Error: The waiting was not found in the database.",
        cont: waitingfind,
      });
    }

    const newWaiting = new waitingmodel(req.body);
    let err = newWaiting.validateSync();

    if (err) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error: Error inserting waiting",
        cont: {
          err,
        },
      });
    }
    const waitingupdate = await waitingmodel.findByIdAndUpdate(
      idWaiting,
      { $set: newWaiting },
      { new: true }
    );
    if (!waitingupdate) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error: Trying to update the waiting",
        cont: 0,
      });
    } else {
      res.status(200).json({
        ok: true,
        resp: 200,
        msg: "Success: The waiting was updated successfully.",
        cont: {
          Waitingfind,
        },
      });
    }
  } catch (err) {
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error: Error updating waiting equipment.",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

app.delete("/", async (req, res) => {
  try {
    if (req.query.idWaiting == "") {
      return res.status(400).send({
        estatus: "400",
        err: true,
        msg: "Error: A valid id was not sent.",
        cont: 0,
      });
    }

    idWaiting = req.query.idWaiting;
    const Waitingfind = await waitingmodel.findById(idWaiting);
    if (!Waitingfind) {
      return res.status(404).send({
        estatus: "404",
        err: true,
        msg: "Error: The waiting was not found in the database.",
        cont: Waitingfind,
      });
    }
    const waitingdelete = await waitingmodel.findByIdAndDelete(Waitingfind);
    if (!waitingdelete) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error:When Trying to delete the waiting",
        cont: 0,
      });
    } else {
      return res.status(200).json({
        ok: true,
        resp: 200,
        msg: `Success: the waiting has been successfully removed.`,
        cont: {
          waitingdelete,
        },
      });
    }
  } catch (err) {
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error: Failed to delete waiting equipment.",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

module.exports = app;
