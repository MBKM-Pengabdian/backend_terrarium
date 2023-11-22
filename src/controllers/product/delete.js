
// Delete a product
app.delete('/products/:id', async (req, res) => {
   const { productId } = req.params;

   const deletedProduct = await prisma.product.delete({
      where: { uuid: productId },
   });

   res.status(200).send({
      status: 200,
      message: "Data product berhasil dihapus",
   });
});