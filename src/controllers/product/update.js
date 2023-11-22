
// Update a product
app.put('/products/:id', async (req, res) => {
   const { id } = req.params;
   const { customer_id, product_name, product_image, description, price, stock_quantity } = req.body;

   const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
         customer_id,
         product_name,
         product_image,
         description,
         price,
         stock_quantity,
      },
   });

   res.status(200).send({
      status: 200,
      message: "Updated",
      data: updatedProduct
   });
});