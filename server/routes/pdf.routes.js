const equipmentmodel = require("../models/equipments.model");
const express = require("express");
let ejs = require("ejs");
let pdf = require("html-pdf");
let path = require("path");
const app = express();
const nodemailer = require("nodemailer");

app.post("/generateReport", async (req, res) => {
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
      $match: {
        $and: [{ email: email }],
      },                                                          
    },
  ]);
  console.log(equipment);
  if (equipment.length <= 0) {
    res.status(404).send({
      estatus: "404",
      err: true,
      msg: "No assigned were found in the database.",
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
            right: "2.54cm",
            left: "2.54cm",
          },
          header: {
            height: "60px"
          },
          footer: {
            height: "22mm"
        },
        };
        pdf
          .create(data, options)
          .toFile(`./server/routes/public/Carta-compromiso.pdf`, function (err, data) {
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

    // //////////////////////////SEND EMAIL/////////////////////////////////

    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
          user: 'arkusnexus.inventory@gmail.com',
          pass: ' cnfjtmiridqbsnnb'
      },
      tls: {
          rejectUnauthorized: false
      }
    });

    let info = await transporter.sendMail({
      from: '"ArkusNexus Inventory" <arkusnexus.inventory@gmail.com>',
      to: email,
      subject: 'Commitment letter',
      text: 'Hello, the following commitment letter contains the teams currently assigned',
      attachments: [
        { 
          filename: 'Carta-Compromiso.pdf', 
          path: __dirname + '/public/Carta-compromiso.pdf', 
          contentType: 'application/pdf' 
        }
      ]
    })
    console.log('E-mail sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));


});

module.exports = app;
