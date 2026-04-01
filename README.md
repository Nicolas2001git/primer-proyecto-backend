# Real-Time Products Backend

Aplicación backend desarrollada con **Node.js + Express** que permite gestionar productos y carritos de compra, integrando **actualización en tiempo real con Socket.io** y persistencia en **MongoDB Atlas**.

Este proyecto combina una API REST, renderizado con Handlebars y comunicación en tiempo real, ofreciendo una experiencia dinámica e interactiva.


## 🚀 Funcionalidades principales

* 📦 CRUD completo de productos
* 🛒 Gestión de carritos
* 🔄 Actualización en tiempo real con WebSockets
* 🌐 API REST estructurada
* 🧠 Persistencia con MongoDB (Mongoose)
* 🎨 Renderizado con Handlebars
* ⚡ Alertas interactivas con SweetAlert2
* 📱 Interfaz responsive con Bootstrap

## 🧰 Tecnologías utilizadas

* Node.js
* Express
* Express-Handlebars
* MongoDB Atlas
* Mongoose
* Socket.io
* Bootstrap 5
* SweetAlert2
* dotenv


## 📁 Estructura del proyecto

```
PROYECTO BACKEND 1
│
├── public/
│   ├── img/
│   ├── js/ 
│        └── socket-client.js    
│   └── styles/
│       └── index.css
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── models/
│   │   ├── cart-model.js
│   │   └── product-model.js
│   │
│   ├── routes/
│   │   ├── carts.router.js
│   │   └── products.router.js
│   │
│   ├── views/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── cart.hbs
│   │   │   ├── home.hbs
│   │   │   ├── productDetail.hbs
│   │   │   ├── products.hbs
│   │   │   └── realtimeproducts.hbs
│   │   │
│   │   └── partials/   
│   │
│   └── server.js
│
├── .env
├── app.js
├── package.json
├── README.md
```


## ⚙️ Variables de entorno

Crear un archivo `.env`:

```env
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_secret_key
PORT=8080
```

## 🔌 Conexión a MongoDB

La aplicación utiliza **MongoDB Atlas**.

Requisitos:

* Usuario y contraseña configurados
* IP whitelist habilitada (`0.0.0.0/0`)
* URI correctamente definida en `MONGO_URI`

## ▶️ Ejecución local

```bash
npm install
npm run dev
```

Abrir en navegador:

```
http://localhost:8080
```



## 🌐 Endpoints principales

### 📦 Productos

* `GET /api/products` → Lista de productos
* `GET /api/products/:pid` → Producto por ID
* `POST /api/products` → Crear producto
* `PUT /api/products/:pid` → Actualizar producto
* `DELETE /api/products/:pid` → Eliminar producto

---

### 🛒 Carritos

* `POST /api/carts` → Crear carrito
* `GET /api/carts/:cid` → Obtener carrito
* `POST /api/carts/:cid/products/:pid` → Agregar producto

---

## 🔄 Tiempo real (Socket.io)

Ruta principal:

```
/home
```


---

## 🖥️ Vistas (Handlebars)

* `/home` → Página principal
* `/products` → Listado de productos
* `/products/:pid` → Detalle de producto
* `/cart/:cid` → Carrito
* `/realtimeproducts` → Productos en tiempo real


## ☁️ Deploy en Render

Pasos:

1. Subir proyecto a GitHub
2. Crear Web Service en Render
3. Configurar variables de entorno:
   * `MONGO_URI`
   * `SECRET_KEY`
4. Hacer deploy



