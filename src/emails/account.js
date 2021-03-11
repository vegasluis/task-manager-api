const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = async (email, name) => {
    await sgMail.send({
        to: email,
        from: 'ruizluis41@hotmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}.Let me know how you get along with the app`
    })
}

const sendCancelationEmail = async (email, name) => {
    await sgMail.send({
        to: email,
        from: 'ruizluis41@hotmail.com',
        subject: 'We are sad to see you go 😢',
        text: `${name}, we are sad to see you, please let us know if you ever change your mind.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}