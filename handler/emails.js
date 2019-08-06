const nodemailer = require("nodemailer");
const emailConfig = require('../config/emails');
const fs = require('fs');
const util = require('util');
const ejs = require('ejs');
require('dotenv').config({ path: 'variables.env' });

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST, // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
       ciphers:'SSLv3'
    },
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS
    }
});

// async..await is not allowed in global scope, must use a wrapper
exports.enviarEmail = async (options) => {
    try {
        //leer archivo para el email
        const file = __dirname + `/../views/emails/${options.file}.ejs`;
        //compilarlo
        const compiledFile = ejs.compile(fs.readFileSync(file, 'utf8'));
        //crear el html
        const html = compiledFile({ url: options.url });
        //configurar las opciones del email
        // send mail with defined transport object
        await transporter.sendMail({
            from: 'Meeti <no.reply.meeti@outlook.com>', // sender address
            to: options.user.email, // list of receivers
            subject: options.subject, // Subject line
            html
        });
    } catch (error) {
        console.error(error);        
    }
}