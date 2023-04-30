import * as nodemailer from 'nodemailer';

export const transporterNodemailerOnlypu = () => {
  return nodemailer.createTransport({
    host: configNodemailer.poviya.host,
    port: configNodemailer.poviya.port,
    secure: true, // true for 465, false for other ports
    auth: {
      user: configNodemailer.poviya.auth.user, // generated ethereal user
      pass: configNodemailer.poviya.auth.pass, // generated ethereal password
    },
  });
};

export const configNodemailer = {
  poviya: {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      //user: 'support@onlypu.com', // generated ethereal user
      //pass: 'mvyiztdeenyypleb', // generated ethereal password
      user: 'poviya.com@gmail.com', // generated ethereal user
      pass: 'bclhdhcihvxbsrrg', // generated ethereal password
    },
  },
};
