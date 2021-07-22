const equipmentmodel = require("../models/equipments.model");
const express = require("express");
let ejs = require("ejs");
let pdf = require("html-pdf");
let path = require("path");
const app = express();
const nodemailer = require("nodemailer");

app.post("/generateReport", async (req, res) => {
  email = req.query.email;
  const ITname = req.body.ITname;
  const ITemail = req.body.ITemail;
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
  console.log(equipment)
  ejs.renderFile(
    path.join(__dirname, "../documents", "carta.ejs"),
    { equipment: equipment, ITname: ITname},
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
                estatus: "400",
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
      subject: 'CARTA RESPONSIVA PARA ASIGNACIÓN DE EQUIPO',
      text: 'Buen día!, su carta responsiva se ha generado con éxito, en ella encontrara información de suma importancia, por lo cual se requiere que se lea cuidadosamente y después de esa acción sea enviada por correo a quien corresponde a la autorización de IT. El email para enviar la carta es el siguiente: ' + ITemail,
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
