var nodemailer = require('nodemailer');
nodemailer.SMTP = {
   Host: 'mail.yourmail.com',
   port: 25,
   use_authentication: true,
   user: 'info@youdomain.com',
   pass: 'somepasswd'
 };

var message = {   
      sender: "sender@domain.com",    
      to:'somemail@somedomain.com',   
      subject: '',    
      html: '<h1>test</h1>',  
      attachments: [  
      {   
          filename: "somepicture.jpg",    
          contents: new Buffer(data, 'base64'),   
          cid: cid    
      }   
      ]   
  };
  nodemailer.send_mail(message,   
    function(err) {   
      if (!err) { 
          console.log('Email send ...');
      } else console.log(sys.inspect(err));       
  });

  fs.readFile("./attachment.txt", function (err, data) {

    mailer.send_mail({       
        sender: 'sender@sender.com',
        to: 'dest@dest.com',
        subject: 'Attachment!',
        body: 'mail content...',
        attachments: [{'filename': 'attachment.txt', 'content': data}]
    }), function(err, success) {
        if (err) {
        }

    }
});