const db = require("../models");
const Product = db.products;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  // validate basic fields
  if (!req.body.name || !req.body.price) {
    res.status(400).send({ message: "Name and price are required!" });
    return;
  }

  // if multer provided a file, build the public URL
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = `${req.protocol}://${req.get('host')}/public/images/${req.file.filename}`;
  }

  const product = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    stock: req.body.stock,
    image: imageUrl,
  };

  Product.create(product)
    .then((data) => res.send(data))
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Product.",
      });
    });
};

exports.findAll = (req, res) => {
  Product.findAll()
    .then((data) => res.send(data))
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving products.",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Product.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({ message: `Not found Product with id ${id}.` });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: `Error retrieving Product with id=${id}` });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;
  // if multer provided a file, set image URL in the body
  if (req.file) {
    req.body.image = `${req.protocol}://${req.get('host')}/public/images/${req.file.filename}`;
  }

  Product.update(req.body, { where: { id: id } })
    .then((num) => {
      if (num == 1) {
        res.send({ message: "Product was updated successfully." });
      } else {
        res.send({
          message: `Cannot update Product with id=${id}. Maybe Product was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: `Error updating Product with id=${id}` });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Product.destroy({ where: { id: id } })
    .then((num) => {
      if (num == 1) {
        res.send({ message: "Product was deleted successfully!" });
      } else {
        res.send({
          message: `Cannot delete Product with id=${id}. Maybe Product was not found!`,
        });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: `Could not delete Product with id=${id}` });
    });
};
