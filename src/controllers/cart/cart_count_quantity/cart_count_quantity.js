import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Increase quantity
export const increaseQuantity = async (req, res) => {
  const { cartId } = req.params;

  try {
    const cart = await prisma.cart.findUnique({
      where: { uuid: cartId },
      include: { product: true },
    });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Increase quantity logic
    cart.quantity += 1;

    await prisma.cart.update({
      where: { uuid: cartId },
      data: { quantity: cart.quantity },
    });

    res.json({ message: "Quantity increased successfully", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Decrease quantity endpoint
export const decreaseQuantity = async (req, res) => {
  const { cartId } = req.params;

  try {
    const cart = await prisma.cart.findUnique({
      where: { uuid: cartId },
      include: { product: true },
    });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    if (cart.quantity == 1) {
      await prisma.cart.delete({
        where: { uuid: cartId },
      });
    }

    // Decrease quantity logic
    if (cart.quantity > 1) {
      cart.quantity -= 1;

      await prisma.cart.update({
        where: { uuid: cartId },
        data: { quantity: cart.quantity },
      });
    }

    res.json({ message: "Quantity decreased successfully", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
