const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:5174' // Your frontend URL
}));
app.use(express.json());

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'mouadmourade89@gmail.com',
    pass: process.env.EMAIL_PASS // Your app password from Gmail
  }
});

// Verify email configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Error:', error);
  } else {
    console.log('Server is ready to send emails');
  }
});

app.post("/send-email", async (req, res) => {
  console.log('Received request:', req.body);
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    console.log('Missing required fields');
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const info = await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: 'mouadmourade89@gmail.com',
      subject: `Nouveau message de ${name}`,
      text: `
Nom: ${name}
Email: ${email}

Message:
${message}

--
Envoyé depuis le portfolio`,
      html: `
<h3>Nouveau message de contact</h3>
<p><strong>Nom:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<br>
<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g, '<br>')}</p>
<br>
<hr>
<p><em>Envoyé depuis le portfolio</em></p>`
    });

    console.log('Email sent successfully:', info);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Email server listening on port ${port}`);
});
