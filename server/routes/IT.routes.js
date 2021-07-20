const usermodel = require("../models/IT.model");
const express = require("express");
const jwt = require("jsonwebtoken");
const keys = require("../middlewares/keys");
const bcrypt = require("bcryptjs");
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
const app = express();

app.get("/", async (req, res) => {
  try {
    const user = await usermodel.aggregate([
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
    const userfind = await usermodel.findById(idUser);
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
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  usermodel.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ infoError: "Email already exists" });
    } else {
      const newUser = new usermodel({
        ITIDcampus: req.body.IDcampus,
        ITpicture: req.body.picture,
        ITusername: req.body.username,
        ITlastname: req.body.lastname,
        ITemail: req.body.email,
        ITphonenumber: req.body.phonenumber,
        ITuserprofile: req.body.userprofile,
        ITIDrole: req.body.IDrole,
        ITaccount: req.body.account,
        ITpassword: req.body.password,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

app.put("/", async (req, res) => {
  try {
    const idUser = req.query.idUser;
    if (req.query.idUser == "") {
      return res.status(400).send({
        estatus: "400",
        err: true,
        msg: "Error: A valid id was not sent.",
        cont: 0,
      });
    }
    req.body._id = idUser;
    const Userfind = await usermodel.findById(idUser);
    if (!Userfind) {
      return res.status(404).send({
        estatus: "404",
        err: true,
        msg: "Error: The user was not found in the database.",
        cont: Userfind,
      });
    }
    const newuser = new usermodel(req.body);
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
    const userupdate = await usermodel.findByIdAndUpdate(
      idUser,
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
    if (req.query.idUser == "") {
      return res.status(400).send({
        estatus: "400",
        err: true,
        msg: "Error: A valid id was not sent.",
        cont: 0,
      });
    }
    idUser = req.query.idUser;
    status = req.body.status;
    const userfind = await usermodel.findById(idUser);
    if (!userfind) {
      return res.status(404).send({
        estatus: "404",
        err: true,
        msg: "Error: The user cannot be found in the database.",
        cont: userfind,
      });
    }
    const userupdate = await usermodel.findByIdAndUpdate(
      idUser,
      { $set: { status: status } },
      { new: true }
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
          status === "true" ? "Activate" : "Delete"
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

app.post("/login", async (req, res) => {
  //////// FORM VALIDATION
  const { errors, isValid } = validateLoginInput(req.body);

   //////// CHECK VALIDATION
   if (!isValid) {
     return res.status(400).json(errors);
   }
 
   const email = req.body.email;
   const password = req.body.password;
 
   ///////// FIND USER BY EMAIL
   usermodel.findOne({ email }).then(user => {
     /////// CHECK IF USER EXISTS
     if (!user) {
       return res.status(404).json({ infoError: "Email not found" });
     }
 
     /////// CHECK PASSWORD
     bcrypt.compare(password, user.password).then(isMatch => {
       if (isMatch) {
         // USER MATCHED
         // CREATE JWT PAYLOAD
         const payload = {
           id: user.id,
           ITusername: user.username,
           ITlastname: user.lastname,
           ITemail: user.email,
           ITphonenumber: user.phonenumber,
           ITuserprofile: user.userprofile,
           ITaccount: user.account,
           ITIDcampus: user.IDcampus
         };
 
         // SIGN TOKEN
         jwt.sign(
           payload,
           keys.secretOrKey,
           {
             expiresIn: 3600 // 1 hour in seconds
           },
           (err, token) => {
             res.json({
               success: true,
               token: "Token " + token,
               id: user.id,
               ITusername: user.username,
               ITlastname: user.lastname,
               ITemail: user.email,
               ITphonenumber: user.phonenumber,
               ITuserprofile: user.userprofile,
               ITaccount: user.account,
               ITIDcampus: user.IDcampus
             });
           }
         );
       } else {
         return res
           .status(400)
           .json({ infoError: "Password incorrect" });
       }
     });
   });
});

app.get("/userName", async (req, res) => {
  try {
    const user = await usermodel.find({},{"ITusername":1,"ITlastname":2,"ITaccount":3});
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

module.exports = app;