// Read all products
app.get('/products', async (req, res) => {
   const products = await prisma.product.findMany();
   res.status(200).send({
      status: 200,
      message: "OK",
      data: products
   });
});

// Read a specific product
app.get('/products/:id', async (req, res) => {
   const { id } = req.params;
   const product = await prisma.product.findUnique({
      where: { id },
   });

   if (!product) {
      return res.status(404).json({ error: 'Product not found' });
   }

   res.status(200).send({
      status: 200,
      message: "OK",
      data: product
   });
});
