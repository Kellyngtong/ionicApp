module.exports = (app) => {
  const products = require("../controllers/product.controller.js");
  var router = require("express").Router();
  const upload = require('../multer/upload');
  // helper to run multer and catch errors
  function singleUpload(fieldName) {
    return (req, res, next) => {
      upload.single(fieldName)(req, res, function (err) {
        if (err) {
          if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'File too large' });
          return res.status(400).json({ error: err.message || 'Upload error' });
        }
        if (req.fileValidationError) return res.status(400).json({ error: req.fileValidationError });
        next();
      });
    };
  }

  /**
   * @swagger
   * /api/products:
   *   post:
   *     tags: [Products]
   *     summary: Crear un nuevo producto
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - price
   *             properties:
   *               name:
   *                 type: string
   *                 description: Nombre del producto
   *               description:
   *                 type: string
   *                 description: Descripción del producto
   *               price:
   *                 type: number
   *                 description: Precio del producto
   *               stock:
   *                 type: integer
   *                 description: Stock disponible
   *               image:
   *                 type: string
   *                 description: URL de la imagen del producto
   *     responses:
   *       200:
   *         description: Producto creado exitosamente
   *       400:
   *         description: Datos inválidos (nombre y precio son requeridos)
   *       500:
   *         description: Error del servidor
   */
  const authJwt = require("../middlewares/authJwt");
  // POST product with optional image file (field name 'image')
  router.post("/", authJwt.verifyToken, singleUpload('image'), products.create);

  /**
   * @swagger
   * /api/products:
   *   get:
   *     tags: [Products]
   *     summary: Obtener todos los productos
   *     responses:
   *       200:
   *         description: Lista de productos
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                   name:
   *                     type: string
   *                   description:
   *                     type: string
   *                   price:
   *                     type: number
   *                   stock:
   *                     type: integer
   *                   image:
   *                     type: string
   *       500:
   *         description: Error del servidor
   */
  router.get("/", products.findAll);

  /**
   * @swagger
   * /api/products/{id}:
   *   get:
   *     tags: [Products]
   *     summary: Obtener un producto por ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del producto
   *     responses:
   *       200:
   *         description: Producto encontrado
   *       404:
   *         description: Producto no encontrado
   *       500:
   *         description: Error del servidor
   */
  router.get("/:id", products.findOne);

  /**
   * @swagger
   * /api/products/{id}:
   *   put:
   *     tags: [Products]
   *     summary: Actualizar un producto
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del producto
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               description:
   *                 type: string
   *               price:
   *                 type: number
   *               stock:
   *                 type: integer
   *               image:
   *                 type: string
   *     responses:
   *       200:
   *         description: Producto actualizado
   *       500:
   *         description: Error del servidor
   */
  // PUT product with optional image file
  router.put("/:id", authJwt.verifyToken, singleUpload('image'), products.update);

  /**
   * @swagger
   * /api/products/{id}:
   *   delete:
   *     tags: [Products]
   *     summary: Eliminar un producto
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del producto
   *     responses:
   *       200:
   *         description: Producto eliminado
   *       500:
   *         description: Error del servidor
   */
  router.delete("/:id", authJwt.verifyToken, products.delete);

  app.use("/api/products", router);
};
