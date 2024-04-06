import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
const prisma = new PrismaClient();

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
