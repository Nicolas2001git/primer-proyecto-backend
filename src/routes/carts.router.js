import { Router } from "express";
import mongoose from "mongoose";
import { CartModel } from "../models/cart-model.js";
import { ProductModel } from "../models/product-model.js";

const cartsRouter = Router();

cartsRouter.post("/", async (req, res) => {
  try {
    const newCart = await CartModel.create({ products: [] });

    res.status(201).send({
      status: "success",
      payload: newCart
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      error: error.message
    });
  }
});

cartsRouter.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).send({
        status: "error",
        error: "ID de carrito inválido / Invalid cart ID"
      });
    }

    let cart = await CartModel.findById(cid)
      .populate("products.product");

    if (!cart) {
      return res.status(404).send({
        status: "error",
        error: "Carrito no encontrado / Cart not found"
      });
    }

    const originalLength = cart.products.length;

    cart.products = cart.products.filter(
      (item) => item.product !== null
    );

    if (cart.products.length !== originalLength) {
      await cart.save();
    }

    res.send({
      status: "success",
      payload: cart
    });

  } catch (error) {
    res.status(500).send({
      status: "error",
      error: error.message
    });
  }
});

cartsRouter.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).send({
        status: "error",
        error: "ID inválido / Invalid ID"
      });
    }

    const cart = await CartModel.findById(cid);
    if (!cart) {
      return res.status(404).send({
        status: "error",
        error: "Carrito no encontrado / Cart not found"
      });
    }

    const product = await ProductModel.findById(pid);
    if (!product) {
      return res.status(404).send({
        status: "error",
        error: "Producto no encontrado / Product not found"
      });
    }

    const productInCart = cart.products.find(
      (item) => item.product.toString() === pid
    );

    if (productInCart) {
      productInCart.quantity += 1;
    } else {
      cart.products.push({
        product: pid,
        quantity: 1
      });
    }

    await cart.save();

    res.send({
      status: "success",
      payload: cart
    });

  } catch (error) {
    res.status(500).send({
      status: "error",
      error: error.message
    });
  }
});

cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).send({
        status: "error",
        error: "ID inválido / Invalid ID"
      });
    }

    const cart = await CartModel.findById(cid);
    if (!cart) {
      return res.status(404).send({
        status: "error",
        error: "Carrito no encontrado / Cart not found"
      });
    }

    cart.products = cart.products.filter(
      (item) => item.product.toString() !== pid
    );

    await cart.save();

    res.send({
      status: "success",
      payload: cart
    });

  } catch (error) {
    res.status(500).send({
      status: "error",
      error: error.message
    });
  }
});

cartsRouter.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).send({
        status: "error",
        error: "ID de carrito inválido / Invalid cart ID"
      });
    }

    const cart = await CartModel.findById(cid);
    if (!cart) {
      return res.status(404).send({
        status: "error",
        error: "Carrito no encontrado / Cart not found"
      });
    }

    cart.products = products;
    await cart.save();

    res.send({
      status: "success",
      payload: cart
    });

  } catch (error) {
    res.status(500).send({
      status: "error",
      error: error.message
    });
  }
});

cartsRouter.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).send({
        status: "error",
        error: "ID inválido / Invalid ID"
      });
    }

    const cart = await CartModel.findById(cid);
    if (!cart) {
      return res.status(404).send({
        status: "error",
        error: "Carrito no encontrado / Cart not found"
      });
    }

    const productInCart = cart.products.find(
      (item) => item.product.toString() === pid
    );

    if (!productInCart) {
      return res.status(404).send({
        status: "error",
        error: "Producto no encontrado en el carrito / Product not found in cart"
      });
    }

    productInCart.quantity = Number(quantity);
    await cart.save();

    res.send({
      status: "success",
      payload: cart
    });

  } catch (error) {
    res.status(500).send({
      status: "error",
      error: error.message
    });
  }
});

cartsRouter.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).send({
        status: "error",
        error: "ID de carrito inválido / Invalid cart ID"
      });
    }

    const cart = await CartModel.findById(cid);
    if (!cart) {
      return res.status(404).send({
        status: "error",
        error: "Carrito no encontrado / Cart not found"
      });
    }

    cart.products = [];
    await cart.save();

    res.send({
      status: "success",
      payload: cart
    });

  } catch (error) {
    res.status(500).send({
      status: "error",
      error: error.message
    });
  }
});

export default cartsRouter;