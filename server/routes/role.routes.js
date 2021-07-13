const rolemodel = require("../models/role.model");
const express = require("express");
const app = express();

app.get("/", async (req, res) => {
  try {
    const role = await rolemodel.find({ status: true });
    idRole = req.query.idRole;
    const Rolefind = await rolemodel.findById(idRole);
    if (Rolefind) {
      return res.status(400).json({
        estatus: "200",
        err: false,
        msg: "Information obtained correctly.",
        cont: {
          name: Rolefind,
        },
      });
    }
    if (role.length <= 0) {
      res.status(404).send({
        estatus: "404",
        err: true,
        msg: "No roles were found in the database.",
        cont: {
          role,
        },
      });
    } else {
      res.status(200).send({
        estatus: "200",
        err: false,
        msg: "Information obtained correctly.",
        cont: {
          role,
        },
      });
    }
  } catch (err) {
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error getting the roles.",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

app.post("/", async (req, res) => {
  try {
    const role = new rolemodel(req.body);
    let err = role.validateSync();
    if (err) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error: Error to insert role.",
        cont: {
          err,
        },
      });
    }
    const rolefind = await rolemodel.findOne({
      rolename: { $regex: `${role.rolename}$`, $options: "i" },
    });
    if (rolefind) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "The role you are trying to register already exists",
        cont: {
          rolename: rolefind.rolename,
        },
      });
    }
    const newrole = await role.save();
    if (newrole.length <= 0) {
      res.status(400).send({
        estatus: "400",
        err: true,
        msg: "Error: Role could not be registered.",
        cont: {
          newrole,
        },
      });
    } else {
      res.status(200).send({
        estatus: "200",
        err: false,
        msg: "Success: Information inserted correctly.",
        cont: {
          newrole,
        },
      });
    }
  } catch (err) {
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error: Error to insert role",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

app.put("/", async (req, res) => {
  try {
    const idRole = req.query.idRole;
    if (req.query.idRole == "") {
      return res.status(400).send({
        estatus: "400",
        err: true,
        msg: "Error: A valid id was not sent.",
        cont: 0,
      });
    }

    req.body._id = idRole;

    const Rolefind = await rolemodel.findById(idRole);

    if (!Rolefind) {
      return res.status(404).send({
        estatus: "404",
        err: true,
        msg: "Error: The role was not found in the database.",
        cont: Rolefind,
      });
    }
    const newrole = new rolemodel(req.body);
    let err = newrole.validateSync();

    if (err) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error: Error inserting role.",
        cont: {
          err,
        },
      });
    }
    const roleupdate = await rolemodel.findByIdAndUpdate(
      idRole,
      { $set: newrole },
      { new: true }
    );
    if (!roleupdate) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error: Trying to update the role.",
        cont: 0,
      });
    } else {
      return res.status(200).json({
        ok: true,
        resp: 200,
        msg: "Success: The role was updated successfully.",
        cont: {
          roleupdate,
        },
      });
    }
  } catch (err) {
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error: Error updating role.",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

app.delete("/", async (req, res) => {
  try {
    if (req.query.idRole == "") {
      return res.status(400).send({
        estatus: "400",
        err: true,
        msg: "Error: A valid id was not sent.",
        cont: 0,
      });
    }

    idRole = req.query.idRole;
    const Rolefind = await rolemodel.findById(idRole);
    if (!Rolefind) {
      return res.status(404).send({
        estatus: "404",
        err: true,
        msg: "Error: The role was not found in the database.",
        cont: Rolefind,
      });
    }
    const roledelete = await rolemodel.findByIdAndDelete(Rolefind);
    if (!roledelete) {
      return res.status(400).json({
        ok: false,
        resp: 400,
        msg: "Error: When trying to delete the role.",
        cont: 0,
      });
    } else {
      return res.status(200).json({
        ok: true,
        resp: 200,
        msg: `Success: the role has been successfully removed.`,
        cont: {
          roledelete,
        },
      });
    }
  } catch (err) {
    res.status(500).send({
      estatus: "500",
      err: true,
      msg: "Error: Failed to delete role.",
      cont: {
        err: Object.keys(err).length === 0 ? err.message : err,
      },
    });
  }
});

module.exports = app;
