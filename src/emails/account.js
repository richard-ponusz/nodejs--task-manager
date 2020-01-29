const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'ponuszrichard93@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you do!`
    })
};

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'ponuszrichard93@gmail.com',
        subject: `Don't leave! I beg of you!`,
        text: `This is the way`
    })
};

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}
