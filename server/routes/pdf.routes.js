const equipmentmodel = require("../models/assigned.model");
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
        from: "users",
        localField: "IDuser",
        foreignField: "_id",
        as: "users",
      },
    },
    {
      $lookup: {
        from: "equipment",
        localField: "serialnumber",
        foreignField: "_id",
        as: "equipment",
      },
    },
    {
      $lookup: {
        from: "IT",
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
          $mergeObjects: [{ $arrayElemAt: ["$IT", 0] }, "$$ROOT"],
        },
      },
    },
    {
      $match: {
        $and: [{ email: email }],
      },
    },
    {
      $match: {
        $and: [{ email: email }],
      },
    },
  ]);
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
            right: "2.54cm",
            left: "2.54cm",
            bottom: "2.00cm",
          },
        };
        pdf
          .create(data, options)
          .toFile(`./server/docgenerate/report.pdf`, function (err, data) {
            if (err) {
              res.send(err);
            } else {
              res.status(400).json({
                estatus: "200",
                err: false,
                msg: "document generated successfully.",
              });
            }
          });
      }
    }
  );
});

module.exports = app;
