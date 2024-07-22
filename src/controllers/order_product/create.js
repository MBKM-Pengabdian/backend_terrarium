import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
const prisma = new PrismaClient();

export const orderProduct = async (req, res) => {
  try {
    const {
      customer_id,
      province,
      city,
      address,
      shipping_method,
      total_amount,
      subtotal_product,
      order_item,
      service_fee,
      discount_value,
      promo_code,
    } = req.body.data;
    // Create the order product
    const orderProduct = await prisma.order_Product.create({
      data: {
        customer_id,
        total_amount: parseFloat(total_amount),
        subtotal_product: parseFloat(subtotal_product),
        order_status: 1,
        province,
        city,
        address,
        shipping_method,
        service_fee,
        discount_value,
        promo_code,
      },
    });

    // Extract the order id
    const order_id = orderProduct.uuid;

    // Create order items
    const orderItemsData = Object.values(order_item).map((item) => ({
      product_id: item.product_id,
      order_id: order_id,
      quantity: parseInt(item.quantity),
      subtotal: parseInt(item.quantity) * item.product.price, // assuming subtotal is quantity * price
    }));

    await prisma.order_Item.createMany({
      data: orderItemsData,
    });
    // console.log(order_item);
    // Update sold quantity and stock quantity for each product
    for (const item of Object.values(order_item)) {
      const product = await prisma.product.findUnique({
        where: { uuid: item.product_id },
        select: { sold: true, stock_quantity: true },
      });

      const updatedSold = (product.sold || 0) + parseInt(item.quantity);
      const updatedStockQuantity =
        product.stock_quantity - parseInt(item.quantity);

      await prisma.product.update({
        where: { uuid: item.product_id },
        data: {
          sold: updatedSold,
          stock_quantity: updatedStockQuantity,
        },
      });
    }

    // Delete the items from the cart
    const productIds = Object.values(order_item).map((item) => item.product_id);
    await prisma.cart.deleteMany({
      where: {
        customer_id: customer_id,
        product_id: {
          in: productIds,
        },
      },
    });

    // Update the promo code usage
    if (promo_code) {
      const promo = await prisma.promo_Code.findUnique({
        where: { code: promo_code },
      });

      if (promo) {
        // Parse the existing used_customer_ids
        let usedCustomerIds = promo.used_customer_ids
          ? JSON.parse(promo.used_customer_ids)
          : [];

        // Add the current customer_id to the used_customer_ids
        if (!usedCustomerIds.includes(customer_id)) {
          usedCustomerIds.push(customer_id);
        }

        await prisma.promo_Code.update({
          where: { code: promo_code },
          data: {
            used_count: promo.used_count + 1,
            used_customer_ids: JSON.stringify(usedCustomerIds),
          },
        });
      }
    }

    res.status(201).json({
      status: 201,
      message: "Order created successfully",
      data: orderProduct,
    });
  } catch (error) {
    console.error("Error :", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
