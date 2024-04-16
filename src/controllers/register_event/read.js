import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getRegistrationEventUser = async (req, res) => {
  const { uuid_customer } = req.params;

  try {
    const registrations = await prisma.register_Event.findMany({
      where: {
        customer_id: uuid_customer,
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

    const formattedData = registrations.map((registration) => {
      const { event } = registration;

      return {
        uuid: event.uuid,
        transaction: {
          status: registration.status_regis,
          bukti_bayar: registration.bukti_bayar,
          alasan: registration.alasan_bayar,
          total_price: registration.total_payment,
          tipe: registration.tipe,
          amout: registration.amout,
        },
        customer_data: {
          customer_id: registration.customer_id,
          fullname_customer: registration.fullname_customer,
          email_customer: registration.email_customer,
        },
        event_data: {
          event_id: event.uuid,
          token_registration: registration.token_registration,
          title_event: event.title_event,
          place: event.place,
          wag: event.wag,
          detail_event_data: event.detail_event.map((detailEvent) => ({
            description_event: detailEvent.description_event,
            sponsor_event: detailEvent.sponsor_event,
            speaker_event: detailEvent.speaker_event,
            date_event: detailEvent.date_event,
          })),
        },
        created_at: registration.created_at.toISOString(),
      };
    });

    res.status(200).json({
      status: 200,
      message: "OK",
      data: formattedData,
    });
  } catch (error) {
    console.error("Error getting registrations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllRegistrationEvent = async (req, res) => {
  try {
    const register_event = await prisma.register_Event.findMany();
    res.status(200).send({
      status: 200,
      message: "Success",
      data: register_event,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getRegistrationPaymentUser = async (req, res) => {
  const { uuid_customer } = req.params;

  try {
    const registrations = await prisma.register_Event.findMany({
      where: {
        customer_id: uuid_customer,
      },
      include: {
        event: {
          include: {
            detail_event: true,
          },
        },
      },
    });

    const formattedData = registrations.map((registration) => {
      const { event } = registration;
      return {
        uuid: registration.uuid,
         transaction: {
          status: registration.status_regis,
          bukti_bayar: registration.bukti_bayar,
          alasan: registration.alasan_bayar,
          total_price: registration.total_payment,
          tipe: registration.tipe,
          amout: registration.amout,
        },
        customer_data: {
          customer_id: registration.customer_id,
          fullname_customer: registration.fullname_customer,
          email_customer: registration.email_customer,
        },
        event_data: {
          event_id: event.uuid,
          title_event: event.title_event,
          place: event.place,
          price: event.price_event,
          img_event: event.img_event,
          detail_event_data: event.detail_event.map((detailEvent) => ({
            description_event: detailEvent.description_event,
            sponsor_event: detailEvent.sponsor_event,
            speaker_event: detailEvent.speaker_event,
            date_event: detailEvent.date_event,
          })),
        },
        created_at: registration.created_at.toISOString(),
      };
    });

    res.status(200).json({
      status: 200,
      message: "OK",
      data: formattedData,
    });
  } catch (error) {
    console.error("Error getting registrations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllRegistrationByIdEvent = async (req, res) => {
  const { idEvent } = req.params;

  try {
    const register_event = await prisma.register_Event.findMany({
      where: {
        event_id: idEvent,
      },
      include: {
        event: {
          include: {
            detail_event: true,
          },
        },
      },
    });
    const formattedData = register_event.map((registration) => {
      const { event } = registration;

      return {
        uuid: registration.uuid,
        transaction: {
          status: registration.status_regis,
          bukti_bayar: registration.bukti_bayar,
          alasan: registration.alasan_bayar,
          total_price: registration.total_payment,
          tipe: registration.tipe,
          amout: registration.amout,
        },
        customer_data: {
          customer_id: registration.customer_id,
          fullname_customer: registration.fullname_customer,
          email_customer: registration.email_customer,
        },
        event_data: {
          event_id: event.uuid,
          title_event: event.title_event,
          place: event.place,
          price: event.price_event,
          img_event: event.img_event,
          detail_event_data: event.detail_event.map((detailEvent) => ({
            description_event: detailEvent.description_event,
            sponsor_event: detailEvent.sponsor_event,
            speaker_event: detailEvent.speaker_event,
            date_event: detailEvent.date_event,
          })),
        },
        created_at: registration.created_at.toISOString(),
      };
    });

    res.status(200).json({
      status: 200,
      message: "OK",
      data: formattedData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
