import nodemailer from "nodemailer";
import ejs from "ejs";
import fs from "fs";
import html_to_pdf from "html-pdf-node";
import qrcode from "qrcode";

export const generateQRCode = async (text) => {
  try {
    return await qrcode.toDataURL(text);
  } catch (error) {
    throw error;
  }
};

export const sendTicketToEmail = async (dataReceipt) => {
  let options = { format: "A4" };
  const templateStringTicket = fs.readFileSync(
    "./src/receipt/ticket-template.ejs",
    "utf-8"
  );

  // Generate QR code
  const qrCodeDataUrl = await generateQRCode(dataReceipt.codeqr);

  const dataTicket = {
    username: dataReceipt.username,
    event_title: dataReceipt.event_title,
    date: dataReceipt.date,
    time: dataReceipt.time,
    place: dataReceipt.place,
    codeqr: dataReceipt.codeqr,
    qrCodeDataUrl: qrCodeDataUrl,
    wag: dataReceipt.wag,
    no: dataReceipt.no,
    terdaftarAt: dataReceipt.terdaftarAt,
  };

  // Render template EJS dengan dataTicket
  const htmlTicket = ejs.render(templateStringTicket, dataTicket);

  let file = { content: htmlTicket };

  // Generate PDF dari HTML
  let pdfBuffer = await html_to_pdf.generatePdf(file, options);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "putramhmmd22@gmail.com",
      pass: "nqtn lkuj zzix zdka",
    },
  });

  const mailOption = {
    from: "putramhmmd22@gmail.com",
    to: dataReceipt.toEmail,
    subject: `Cacti Life - Your ticket ${dataReceipt.event_title}`,
    attachments: [
      {
        filename: `Ticket-${dataReceipt.event_title}-${dataReceipt.no}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  };

  await transporter.sendMail(mailOption);
};

export const generateTicketPDF = async (dataReceipt) => {
  let options = { format: "A4" };
  const templateStringTicket = fs.readFileSync(
    "./src/receipt/ticket-template.ejs",
    "utf-8"
  );

  // Generate QR code
  const qrCodeDataUrl = await generateQRCode(dataReceipt.codeqr);

  const dataTicket = {
    username: dataReceipt.username,
    event_title: dataReceipt.event_title,
    date: dataReceipt.date,
    time: dataReceipt.time,
    place: dataReceipt.place,
    codeqr: dataReceipt.codeqr,
    qrCodeDataUrl: qrCodeDataUrl,
    wag: dataReceipt.wag,
    no: dataReceipt.no,
    terdaftarAt: dataReceipt.terdaftarAt,
  };

  // Render template EJS dengan dataTicket
  const htmlTicket = ejs.render(templateStringTicket, dataTicket);

  let file = { content: htmlTicket };

  // Generate PDF dari HTML
  let pdfBuffer = await html_to_pdf.generatePdf(file, options);

  return pdfBuffer
};
