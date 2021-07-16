const equipmentmodel = require("../models/equipments.model");
const express = require("express");
let ejs = require("ejs");
let pdf = require("html-pdf");
let path = require("path");
const app = express();

app.get("/generateReport", async (req, res) => {
  email = req.query.email;
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
        $and: [{ email: email }],
      },
    },
  ]);
  console.log(equipment);
  ejs.renderFile(
    path.join(__dirname, "../documents", "carta.ejs"),
    { equipment: equipment },
    (err, data) => {
      if (err) {
        res.send(err);
      } else {
        let options = {
          format: "A4",
          border: {
            top: "2.54cm",
            button: "1.54cm",
            right: "2.54cm",
            left: "2.54cm",
          },
        };
        pdf.create(data, options).toFile(`./docgenerate/report.pdf`, function (err, data) {
          if (err) {
            res.send(err);
          } else {
            res.send("File created successfully");
          }
        });
      }
    }
  );
});

module.exports = app;
