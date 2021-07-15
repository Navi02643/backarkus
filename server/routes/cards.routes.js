const equipmentmodel = require("../models/equipments.model");
const express = require('express');
const pdf = require('html-pdf');
const pdfTemplate = require('../documents');
const app = express();

var options = {
    format: "A4",
    border: {
      top: "2.54cm",
      button: "1.54cm",
      right: "2.54cm",
      left: "2.54cm",
    },
  };


app.post('/create-pdf', async (req, res) => {
    pdf.create(pdfTemplate(req.body), options).toFile('Carta-compromiso.pdf', (err) => {
        if(err) {
            res.send(Promise.reject());
        }
            res.send(Promise.resolve());
    });
});
 
app.get('/fetch-pdf', (req, res) => {
    res.sendFile(`${__dirname}/Carta-compromiso.pdf`);
});

app.get('/assinged', async (req, res) => {
    try {
        username = req.query.username;
        lastname = req.query.lastname;
        const equipment = await equipmentmodel.aggregate([
         
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
              $and: [{ username: username }, { lastname: lastname }],
            },
          },
          {
              $project: {
                  _id: 0,
                  tename: 1,
                  model: 1,
                  mark: 1,
                  serialnumber: 1,
                  
              }
          }
        ]);
        
        console.log(equipment);
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
module.exports = app;