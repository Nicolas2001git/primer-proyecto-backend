import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import app from "../app.js";
import { connectDB } from "./config/db.js";
import { ProductModel } from "./models/product-model.js";

dotenv.config();

const PORT = process.env.PORT || 8080;

connectDB();

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", async (socket) => {
  console.log(`Usuario ID: ${socket.id} conectado`);

  const products = await ProductModel.find();
  socket.emit("productsUpdated", products);

  socket.on("addProduct", async (productData) => {
    await ProductModel.create({
      title: productData.title,
      description: productData.description,
      code: productData.code,
      price: Number(productData.price),
      status: true,
      stock: Number(productData.stock),
      category: productData.category,
      thumbnails: []
    });

    const products = await ProductModel.find();
    io.emit("productsUpdated", products);
  });

  socket.on("updateProduct", async ({ pid, updateData }) => {
    await ProductModel.findByIdAndUpdate(pid, {
      ...updateData,
      price: updateData.price !== undefined ? Number(updateData.price) : undefined,
      stock: updateData.stock !== undefined ? Number(updateData.stock) : undefined
    });

    const products = await ProductModel.find();
    io.emit("productsUpdated", products);
  });

  socket.on("deleteProduct", async (pid) => {
    await ProductModel.findByIdAndDelete(pid);

    const products = await ProductModel.find();
    io.emit("productsUpdated", products);
  });

  socket.on("disconnect", () => {
    console.log(`Usuario ID: ${socket.id} desconectado`);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});