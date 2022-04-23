<<<<<<< HEAD
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground'
=======
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";
>>>>>>> 74733a9a8119fddd9439963327f980dfaaff890c

const {
    MAILING_SERVICE_CLIENT_ID,
    MAILING_SERVICE_CLIENT_SECRET,
    MAILING_SERVICE_CLIENT_REFRESH_TOKEN,
    SENDER_EMAIL_ADDRESS,
<<<<<<< HEAD
    SENDER_EMAIL_COORDINATOR
} = process.env
=======
    SENDER_EMAIL_COORDINATOR,
} = process.env;
>>>>>>> 74733a9a8119fddd9439963327f980dfaaff890c

const oauth2Clinet = new OAuth2(
    MAILING_SERVICE_CLIENT_ID,
    MAILING_SERVICE_CLIENT_SECRET,
    MAILING_SERVICE_CLIENT_REFRESH_TOKEN,
    OAUTH_PLAYGROUND
<<<<<<< HEAD
)
=======
);
>>>>>>> 74733a9a8119fddd9439963327f980dfaaff890c

//send mail
const sendEmailIdea = (url, txt, user) => {
    oauth2Clinet.setCredentials({
<<<<<<< HEAD
        refresh_token: MAILING_SERVICE_CLIENT_REFRESH_TOKEN
    })
    const accessToken = oauth2Clinet.getAccessToken()
    const smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
=======
        refresh_token: MAILING_SERVICE_CLIENT_REFRESH_TOKEN,
    });
    const accessToken = oauth2Clinet.getAccessToken();
    const smtpTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
>>>>>>> 74733a9a8119fddd9439963327f980dfaaff890c
            user: SENDER_EMAIL_ADDRESS,
            clientId: MAILING_SERVICE_CLIENT_ID,
            clientSecret: MAILING_SERVICE_CLIENT_SECRET,
            refreshToken: MAILING_SERVICE_CLIENT_REFRESH_TOKEN,
<<<<<<< HEAD
            accessToken
        }
    })
=======
            accessToken,
        },
    });
>>>>>>> 74733a9a8119fddd9439963327f980dfaaff890c

    const mailOptions = {
        from: SENDER_EMAIL_ADDRESS,
        to: SENDER_EMAIL_COORDINATOR,
<<<<<<< HEAD
        subject: "Courses Sytems",
=======
        subject: "Courses System",
>>>>>>> 74733a9a8119fddd9439963327f980dfaaff890c
        html: `
            <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
                <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the Courses System.</h2>
                <p style="color: red"> ${user} have done upload idea.
                </p>
            
                <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${txt}</a>
        
            <p>If the button doesn't work for any reason, you can also click on the link below:</p>
        
            <div>${url}</div>
            </div>
<<<<<<< HEAD
        `
    }
    smtpTransport.sendMail(mailOptions, (err, infor) => {
        if (err) return err;
        return infor
    })
}

module.exports = sendEmailIdea
=======
        `,
    };
    smtpTransport.sendMail(mailOptions, (err, infor) => {
        if (err) return err;
        return infor;
    });
};

module.exports = sendEmailIdea;
>>>>>>> 74733a9a8119fddd9439963327f980dfaaff890c
