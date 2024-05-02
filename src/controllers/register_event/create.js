import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
const prisma = new PrismaClient();
import nodemailer from "nodemailer";
import ejs from "ejs";
import fs from "fs";
import {
  getFormattedDate,
  getFormattedTime,
  myDate,
} from "../../utils/date-format.js";
import {
  generateTicketPDF,
  sendTicketToEmail,
} from "../../utils/myfunction.js";
import { getConfigMailer } from "../config_perusahaan/get-config-mailer.js";

export const registerEvent = async (req, res) => {
  try {
    const {
      customer_id,
      event_id,
      email_customer,
      fullname_customer,
      total_payment,
      tipe,
      amout,
    } = req.body;

    //view event
    const existingEvent = await prisma.event.findUnique({
      where: {
        uuid: event_id,
      },
      include: {
        detail_event: {
          include: {
            timeline: true, // Include timeline details
          },
        },
      },
    });

    if (!existingEvent) {
      return res.status(404).json({
        error: "Event not found",
      });
    }

    //  console.log(existingEvent.detail_event[0].kuota_event);

    const existingRegistration = await prisma.register_Event.findFirst({
      where: {
        customer_id,
        event_id,
      },
    });

    if (existingRegistration) {
      return res.status(400).json({
        status: 400,
        message: "Customer is already registered for the event",
      });
    }

    const generated_uuid = uuidv4();
    const split_uuid = generated_uuid.match(/.{1,4}/g);
    const token_uuid = split_uuid[0].toUpperCase();

    const registration = await prisma.register_Event.create({
      data: {
        uuid: uuidv4(),
        customer_id,
        event_id,
        email_customer,
        fullname_customer,
        total_payment,
        tipe,
        amout,
        token_registration: `CACTI-${token_uuid}`,
      },
    });

    //  update kuota
    await prisma.detail_Event.update({
      where: {
        id: existingEvent.detail_event[0].id,
      },
      data: {
        total_terdaftar: existingEvent.detail_event[0].total_terdaftar + amout,
      },
    });

    res.status(201).json({
      status: 201,
      message: "Registration event successfully",
      data: registration,
    });
  } catch (error) {
    console.error("Error registering event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const sendReminderEmailEvent = async (req, res) => {
  try {
    const { idEvent } = req.params;
    const { sisahari } = req.body;
    //buka semua registrasi event yg id event_id nya == eventID dan status regis == 3
    const register_event = await prisma.register_Event.findMany({
      where: {
        event_id: idEvent,
        status_regis: 3,
      },
      include: {
        event: {
          include: {
            detail_event: true,
          },
        },
      },
    });
    const partsMail = await getConfigMailer();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: partsMail.email,
        pass: partsMail.password,
      },
    });
    const templateString = fs.readFileSync(
      "./src/receipt/reminder-event.ejs",
      "utf-8"
    );

    register_event.forEach(async (registration) => {
      const { event } = registration;
      const detailEvent = event.detail_event[0]; // Mengambil detail event pertama
      const data = {
        username: registration.fullname_customer,
        event_title: event.title_event,
        date: getFormattedDate(detailEvent.date_event),
        time: `${getFormattedTime(detailEvent.date_event)} - end`,
        sisahari: `${sisahari}`,
        place: event.place,
        linkTicket: "https://muhammadsyahputra.vercel.app/",
      };
      const html = ejs.render(templateString, data);

      const dataRegist = registration;
      const dataEvent = registration.event;
      const dataDetailEvent = registration.event.detail_event[0];

      const dataSend = {
        username: dataRegist.fullname_customer,
        event_title: dataEvent.title_event,
        date: getFormattedDate(dataDetailEvent.date_event),
        time: getFormattedTime(dataDetailEvent.date_event),
        place: dataEvent.place,
        codeqr: dataRegist.token_registration,
        toEmail: dataRegist.email_customer,
        wag: dataEvent.wag,
        no: dataRegist.token_registration,
        terdaftarAt: myDate(dataRegist.created_at),
        logo: `${process.env.SERVER_SIDE}${partsMail.logo}`,
      };
      const pdfTicket = await generateTicketPDF(dataSend);

      const mailOption = {
        from: partsMail.email,
        to: registration.email_customer,
        subject: "Reminder: Your Event in Cacti Life",
        html: html,
        attachments: [
          {
            filename: `Ticket-${dataEvent.title_event}-${dataRegist.token_registration}.pdf`,
            content: pdfTicket,
            contentType: "application/pdf",
          },
        ],
      };

      try {
        await transporter.sendMail(mailOption);
        console.log("Email sent successfully to:", registration.email_customer);
      } catch (error) {
        console.error(
          "Error sending email to:",
          registration.email_customer,
          error
        );
      }
    });

    res.status(200).json({
      status: 200,
      message: "Email successfully to send",
    });
  } catch (error) {
    console.error("Error registering event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const sendReminderUpdatedEvent = async (req, res) => {
  try {
    const { idEvent } = req.params;
    //buka semua registrasi event yg id event_id nya == eventID dan status regis == 3
    const register_event = await prisma.register_Event.findMany({
      where: {
        event_id: idEvent,
        status_regis: 3,
      },
      include: {
        event: {
          include: {
            detail_event: true,
          },
        },
      },
    });
    const partsMail = await getConfigMailer();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: partsMail.email,
        pass: partsMail.password,
      },
    });
    const templateString = fs.readFileSync(
      "./src/receipt/reminder-updated-event.ejs",
      "utf-8"
    );

    register_event.forEach(async (registration) => {
      const { event } = registration;
      const detailEvent = event.detail_event[0]; // Mengambil detail event pertama
      const data = {
        username: registration.fullname_customer,
        event_title: event.title_event,
        date: getFormattedDate(detailEvent.date_event),
        time: `${getFormattedTime(detailEvent.date_event)} - end`,
        place: event.place,
        linkTicket: "https://muhammadsyahputra.vercel.app/",
      };
      const html = ejs.render(templateString, data);
      const mailOption = {
        from: partsMail.email,
        to: registration.email_customer,
        subject: "Update: Your event on Cacti Life has changed",
        html: html,
      };

      try {
        await transporter.sendMail(mailOption);
        console.log("Email sent successfully to:", registration.email_customer);
      } catch (error) {
        console.error(
          "Error sending email to:",
          registration.email_customer,
          error
        );
      }
    });

    res.status(200).json({
      status: 200,
      message: "Email successfully to send",
    });
  } catch (error) {
    console.error("Error registering event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const sendReminderPayEvent = async (req, res) => {
  try {
    const { regisEventID } = req.params;
    //buka semua registrasi event yg id event_id nya == eventID dan status regis == 3
    const register_event = await prisma.register_Event.findMany({
      where: {
        uuid: regisEventID,
      },
      include: {
        event: {
          include: {
            detail_event: true,
          },
        },
      },
    });
    const partsMail = await getConfigMailer();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: partsMail.email,
        pass: partsMail.password,
      },
    });
    const templateString = fs.readFileSync(
      "./src/receipt/reminder-pay-event.ejs",
      "utf-8"
    );
    const registEvent = register_event[0];
    const detailEvent = registEvent.event.detail_event[0]; // Mengambil detail event pertama
    const data = {
      username: registEvent.fullname_customer,
      event_title: registEvent.event.title_event,
      date: getFormattedDate(detailEvent.date_event),
      time: `${getFormattedTime(detailEvent.date_event)} - end`,
      place: registEvent.event.place,
      linkTicket: "https://muhammadsyahputra.vercel.app/",
    };
    const html = ejs.render(templateString, data);
    const mailOption = {
      from: partsMail.email,
      to: registEvent.email_customer,
      subject: "Reminder: Complete Your Payment, Cacti Life",
      html: html,
    };

    try {
      await transporter.sendMail(mailOption);
      console.log("Email sent successfully to:", registEvent.email_customer);
    } catch (error) {
      console.error(
        "Error sending email to:",
        registration.email_customer,
        error
      );
    }

    res.status(200).json({
      status: 200,
      message: "Email successfully to send",
    });
  } catch (error) {
    console.error("Error registering event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const sendTicketEvent = async (req, res) => {
  try {
    const { regisEventID } = req.params;
    const register_event = await prisma.register_Event.findFirst({
      where: {
        uuid: regisEventID,
      },
      include: {
        event: {
          include: {
            detail_event: true,
          },
        },
      },
    });
    const partsMail = await getConfigMailer();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: partsMail.email,
        pass: partsMail.password,
      },
    });
    const dataRegist = register_event;
    const dataEvent = register_event.event;
    const dataDetailEvent = register_event.event.detail_event[0];

    const dataSend = {
      username: dataRegist.fullname_customer,
      event_title: dataEvent.title_event,
      date: getFormattedDate(dataDetailEvent.date_event),
      time: getFormattedTime(dataDetailEvent.date_event),
      place: dataEvent.place,
      codeqr: dataRegist.token_registration,
      toEmail: dataRegist.email_customer,
      wag: dataEvent.wag,
      no: dataRegist.token_registration,
      terdaftarAt: myDate(dataRegist.created_at),
      logo: `${process.env.SERVER_SIDE}${partsMail.logo}`,
    };
    const pdfTicket = await generateTicketPDF(dataSend);

    const mailOption = {
      from: partsMail.email,
      to: dataRegist.email_customer,
      subject: "Reminder: Your Event in Cacti Life",
      attachments: [
        {
          filename: `Ticket-${dataEvent.title_event}-${dataRegist.token_registration}.pdf`,
          content: pdfTicket,
          contentType: "application/pdf",
        },
      ],
    };

    try {
      await transporter.sendMail(mailOption);
      console.log("Email sent successfully to:", dataRegist.email_customer);
    } catch (error) {
      console.error(
        "Error sending email to:",
        dataRegist.email_customer,
        error
      );
    }

    res.status(200).json({
      status: 200,
      message: "Email successfully to send",
    });
  } catch (error) {
    console.error("Error registering event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
