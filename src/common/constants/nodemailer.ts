import * as nodemailer from 'nodemailer';

export const transporterNodemailerOnlypu = () => {
  return nodemailer.createTransport({
    host: configNodemailer.onlypu.host,
    port: configNodemailer.onlypu.port,
    secure: true, // true for 465, false for other ports
    auth: {
      user: configNodemailer.onlypu.auth.user, // generated ethereal user
      pass: configNodemailer.onlypu.auth.pass, // generated ethereal password
    },
  });
};

export const configNodemailer = {
  onlypu: {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      //user: 'support@onlypu.com', // generated ethereal user
      //pass: 'mvyiztdeenyypleb', // generated ethereal password
      user: 'onlypu.com@gmail.com', // generated ethereal user
      pass: 'ccahbobsbkpuyupr', // generated ethereal password
    },
  },
};
