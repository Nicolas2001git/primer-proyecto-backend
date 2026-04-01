import { Router } from "express";
import mongoose from "mongoose";
import { ProductModel } from "../models/product-model.js";

const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
  try {
    let { limit = 10, page = 1, sort, query } = req.query;

    limit = Number(limit);
    page = Number(page);

    const filter = {};

    if (query) {
      if (query === "true" || query === "false") {
        filter.status = query === "true";
      } else {
        filter.category = query;
      }
    }

    let products = await ProductModel.find(filter).lean();

    if (sort === "asc") {
      products.sort((a, b) => a.price - b.price);
    }

    if (sort === "desc") {
      products.sort((a, b) => b.price - a.price);
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    const result = products.slice(start, end);

    const totalPages = Math.ceil(products.length / limit) || 1;
    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;

    res.send({
      status: "success",
      payload: result,
      totalPages,
      prevPage,
      nextPage,
      page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: prevPage
        ? `/api/products?page=${prevPage}&limit=${limit}${query ? `&query=${query}` : ""}${sort ? `&sort=${sort}` : ""}`
        : null,
      nextLink: nextPage
        ? `/api/products?page=${nextPage}&limit=${limit}${query ? `&query=${query}` : ""}${sort ? `&sort=${sort}` : ""}`
        : null
    });

  } catch (error) {
    res.status(500).send({
      status: "error",
      error: error.message
    });
  }
});

productsRouter.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).send({
        status: "error",
        error: "ID inválido / Invalid ID"
      });
    }

    const product = await ProductModel.findById(pid).lean();

    if (!product) {
      return res.status(404).send({
        status: "error",
        error: "Producto no encontrado / Product not found"
      });
    }

    res.send({
      status: "success",
      payload: product
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      error: error.message
    });
  }
});

productsRouter.post("/", async (req, res) => {
  try {
    const newProduct = await ProductModel.create(req.body);

    res.status(201).send({
      status: "success",
      payload: newProduct
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      error: error.message
    });
  }
});

productsRouter.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).send({
        status: "error",
        error: "ID inválido / Invalid ID"
      });
    }

    const updated = await ProductModel.findByIdAndUpdate(
      pid,
      req.body,
      { new: true }
    ).lean();

    if (!updated) {
      return res.status(404).send({
        status: "error",
        error: "Producto no encontrado / Product not found"
      });
    }

    res.send({
      status: "success",
      payload: updated
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      error: error.message
    });
  }
});

productsRouter.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).send({
        status: "error",
        error: "ID inválido / Invalid ID"
      });
    }

    const deleted = await ProductModel.findByIdAndDelete(pid);

    if (!deleted) {
      return res.status(404).send({
        status: "error",
        error: "Producto no encontrado / Product not found"
      });
    }

    res.send({
      status: "success",
      message: "Producto eliminado / Product deleted"
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      error: error.message
    });
  }
});

export default productsRouter;