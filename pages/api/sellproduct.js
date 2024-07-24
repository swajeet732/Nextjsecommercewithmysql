import { PDFDocument, rgb } from 'pdf-lib';
import nodemailer from 'nodemailer';
import connectDB from '@/app/utils/db';

export default async function handler(req, res) {
    if (req.method === 'POST') {
      try {
        const connection = await connectDB();
        const { products, totalPrice, email } = req.body;

        // Validate and map product ids
        const productIds = products.map(product => product.id);

        // Save order in MySQL
        const [orderResult] = await connection.execute(
          'INSERT INTO orders (products, totalPrice, email) VALUES (?, ?, ?)',
          [JSON.stringify(productIds), totalPrice, email]
        );
        const orderId = orderResult.insertId;

        // Generate PDF bill
        const pdfDoc = await generatePDF(products, totalPrice);

        // Send PDF as email attachment
        await sendEmailWithBill(products, totalPrice, email, pdfDoc);

        // Send PDF as response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="bill-${orderId}.pdf"`);
        res.status(200).send(pdfDoc);
      } catch (error) {
        console.error('Error processing order:', error);
        res.status(500).json({ error: 'Error processing order' });
      }
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  }

async function generatePDF(products, totalPrice) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();

  const { width, height } = page.getSize();
  const margin = 50;

  const fontSize = 15;
  const lineGap = 20;

  page.drawText('Bill of Purchase', {
    x: margin,
    y: height - margin,
    size: 24,
    color: rgb(0, 0, 0),
  });

  let y = height - margin - 50;

  products.forEach((product, index) => {
    y -= lineGap;
    page.drawText(`${index + 1}. ${product.name}: $${Number(product.price).toFixed(2)}`, {
      x: margin,
      y,
      size: fontSize,
      color: rgb(0, 0, 0),
    });
  });

  y -= lineGap;
  page.drawText(`Total Price: $${Number(totalPrice).toFixed(2)}`, {
    x: margin,
    y,
    size: fontSize,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();

  return pdfBytes;
}

async function sendEmailWithBill(products, totalPrice, email, pdfDoc) {
  // Create Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'swajeet.chavan@vervali.com',  // Your email address
      pass: 'Devops@2002'    // Your email password or application-specific password
    }
  });

  // Construct email message
  const mailOptions = {
    from: 'swajeet.chavan@vervali.com',    // Sender address
    to: email,                       // Recipient address
    subject: 'Order Confirmation and Bill',  // Subject line
    html: `
      <p>Thank you for your order. Your total price is $${Number(totalPrice).toFixed(2)}.</p>
      <p>Your order will be delivered within two days.</p>
      <p>This is your order summary:</p>
      <ul>
        ${products.map(product => `<li>${product.name}: $${Number(product.price).toFixed(2)}</li>`).join('')}
      </ul>
    `,
    attachments: [
      {
        filename: 'bill.pdf',
        content: pdfDoc,
        encoding: 'base64'
      }
    ]
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
