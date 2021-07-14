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

app.post('/create-pdf', (req, res) => {
    pdf.create(pdfTemplate(req.body), options).toFile('Carta-compromiso.pdf', (err) => {
        if(err) {
            res.send(Promise.reject());
        }
            res.send(Promise.resolve());
    });
});
 
app.get('/fetch-pdf', (req, res) => {
    res.sendFile(`/Carta-compromiso.pdf`);
});

module.exports = app;