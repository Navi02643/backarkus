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
  console.log(equipment)
  console.log(equipment.account)
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

    // let transporter = nodemailer.createTransport({
    //   host: 'smtp.gmail.com',
    //   port: 465,
    //   secure: true,
    //   auth: {
    //       user: 'salas.flores.1dm@gmail.com',
    //       pass: ' vstktifqwoigrsvi'
    //   },
    //   tls: {
    //       rejectUnauthorized: false
    //   }
    // });

    // let info = await transporter.sendMail({
    //   from: '"ArkusNexus Inventory" <salas.flores.1dm@gmail.com>',
    //   to: email,
    //   subject: 'Commitment letter',
    //   text: 'Hello, the following commitment letter contains the teams currently assigned',
    //   attachments: [
    //     { 
    //       filename: 'Carta-Compromiso.pdf', 
    //       path: __dirname + '/public/Carta-compromiso.pdf', 
    //       contentType: 'application/pdf' 
    //     }
    //   ]
    // })
    // console.log('Message sent: %s', info.messageId);
    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));


});

module.exports = app;
