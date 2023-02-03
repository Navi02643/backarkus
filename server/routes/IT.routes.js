const Itmodel = require("../models/IT.model");
const express = require("express");
const app = express();

app.get("/", async (req, res) => {
  try {
    const user = await Itmodel.aggregate([
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
          from: "roles",
          localField: "IDrole",
          foreignField: "_id",
          as: "roles",
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
            $mergeObjects: [{ $arrayElemAt: ["$roles", 0] }, "$$ROOT"],
          },
        },
      },
    ]);
    idUser = req.query.idUser;
    const userfind = await Itmodel.findById(idUser);
    if (userfind) {
      return res.status(400).json({
        estatus: "200",
        err: false,
        msg: "Information obtained correctly.",
        cont: {
          name: userfind,
        },
      });
    }
    if (user.length <= 0) {
      res.status(404).send({
        estatus: "404",
        err: true,
        msg: "No users were found in the database.",
        cont: {
          user,
        },
      });
    } else {
      res.status(200).send({
        estatus: "200",
        err: false,
        msg: "Information obtained correctly.",
        cont: {
          user,
        },
      });
    }
  } catch (err) {
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error getting user.",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

app.post("/", async (req, res) => {

  Itmodel.findOne({ ITemail: req.body.ITemail }).then((user) => {
    if (user) {
      return res.status(400).json({ infoError: "Email already exists" });
    } else {
      const newUser = new Itmodel({
        ITname: req.body.ITname,
        ITemail: req.body.ITemail,
      });
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        }
      });
});

app.put("/", async (req, res) => {
  try {
    const idit = req.query.idit;
    if (req.query.idit == "") {
      return res.status(400).send({
        estatus: "400",
        err: true,
        msg: "Error: A valid id was not sent.",
        cont: 0,
      });
    }
    req.body._id = idit;
    const Userfind = await Itmodel.findById(idit);
    if (!Userfind) {
      return res.status(404).send({
        estatus: "404",
        err: true,
        msg: "Error: The user was not found in the database.",
        cont: Userfind,
      });
    }
    const newuser = new Itmodel(req.body);
    let err = newuser.validateSync();
    if (err) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error: Error inserting user.",
        cont: {
          err,
        },
      });
    }
    const userupdate = await Itmodel.findByIdAndUpdate(
      idit,
      { $set: newuser },
      { new: true }
    );
    if (!userupdate) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error: Trying to update the user.",
        cont: 0,
      });
    } else {
      return res.status(200).json({
        ok: true,
        resp: 200,
        msg: "Success: The user was updated successfully.",
        cont: {
          Userfind,
        },
      });
    }
  } catch (err) {
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error: Error updating user.",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

app.delete("/", async (req, res) => {
  try {
    if (req.query.idit == "") {
      return res.status(400).send({
        estatus: "400",
        err: true,
        msg: "Error: A valid id was not sent.",
        cont: 0,
      });
    }
    idit = req.query.idit;
    ITstatus = req.body.ITstatus;
    const userfind = await Itmodel.findById(idit);
    if (!userfind) {
      return res.status(404).send({
        estatus: "404",
        err: true,
        msg: "Error: The user cannot be found in the database.",
        cont: userfind,
      });
    }
    const userupdate = await Itmodel.findByIdAndDelete(
      idit
    );
    if (!userupdate) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error: when trying to delete the user.",
        cont: 0,
      });
    } else {
      return res.status(200).json({
        ok: true,
        resp: 200,
        msg: `Success: Se a ${
          ITstatus === "true" ? "Activate" : "Delete"
        } the user`,
      });
    }
  } catch (err) {
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error: Failed to delete user.",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});


module.exports = app;
