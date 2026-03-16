Real-Time Products Backend

Aplicación backend desarrollada con Node.js + Express que permite gestionar productos y carritos de compra con actualización en tiempo real utilizando WebSockets (Socket.io).

El proyecto incluye:

API REST para productos y carritos

Persistencia de datos con archivos JSON

Interfaz web con Handlebars

Actualización en tiempo real con Socket.io

UI con Bootstrap

Alertas con SweetAlert2

Deploy en Render

🚀 Tecnologías utilizadas

Node.js

Express

Express Handlebars

Socket.io

File System (fs)

Bootstrap

SweetAlert2

JavaScript ES Modules

📁 Estructura del proyecto
primer-proyecto-backend
│
├── node_modules
│
├── public
│   ├── js
│   │   └── socket-client.js
│   │
│   ├── styles
│   │   └── index.css
│   │
│   └── img
│
├── src
│   │
│   ├── data
│   │   ├── carts.json
│   │   └── products.json
│   │
│   ├── routes
│   │   ├── carts.router.js
│   │   └── products.router.js
│   │
│   ├── views
│   │   ├── layouts
│   │   │   └── main.hbs
│   │   │
│   │   ├── pages
│   │   │   ├── home.hbs
│   │   │   └── realtimeproducts.hbs
│   │   │
│   │   └── partials
│   │
│   └── server.js
│
├── app.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
⚙️ Instalación
1️⃣ Clonar el repositorio
git clone https://github.com/TU-USUARIO/primer-proyecto-backend.git
cd primer-proyecto-backend
2️⃣ Instalar dependencias
npm install
3️⃣ Ejecutar el servidor
npm start

El servidor correrá en:

http://localhost:8080
🌐 Deploy

El proyecto está desplegado en Render.

URL del proyecto:

https://primer-proyecto-backend.onrender.com
🖥️ Vistas disponibles
Home
/

Muestra la lista de productos existentes.

Real Time Products
/realtimeproducts

Panel de administración de productos con actualización en tiempo real.

Permite:

➕ Agregar productos

✏️ Actualizar productos

❌ Eliminar productos

🔄 Ver cambios en tiempo real

Todo utilizando WebSockets (Socket.io).

📡 WebSockets (Socket.io)

El servidor utiliza Socket.io para mantener sincronizada la lista de productos entre clientes.

Eventos utilizados:

Cliente → Servidor
addProduct
updateProduct
deleteProduct
Servidor → Cliente
productsUpdated

Este evento actualiza automáticamente la lista de productos en la interfaz.

🛍️ API REST
Base URL
/api/products
/api/carts
Productos
GET todos los productos
GET /api/products
GET producto por ID
GET /api/products/:pid
Crear producto
POST /api/products

Body:

{
  "title": "Producto",
  "description": "Descripción",
  "code": "ABC123",
  "price": 1000,
  "stock": 10,
  "category": "Electronics"
}
Actualizar producto
PUT /api/products/:pid
Eliminar producto
DELETE /api/products/:pid
🛒 Carritos
Crear carrito
POST /api/carts

Respuesta:

{
  "id": 1,
  "products": []
}
Obtener productos de un carrito
GET /api/carts/:cid
Agregar producto a carrito
POST /api/carts/:cid/product/:pid

Si el producto ya existe:

quantity++

Si no existe:

quantity = 1
💾 Persistencia de datos

Los datos se almacenan en archivos JSON dentro de:

src/data/products.json
src/data/carts.json

El sistema utiliza:

fs.readFileSync()
fs.writeFileSync()

para manejar la persistencia.

🎨 Interfaz

La interfaz utiliza:

Bootstrap

Para layout responsive y componentes UI.

SweetAlert2

Para notificaciones:

producto agregado

producto eliminado

producto actualizado

confirmaciones de eliminación

✨ Funcionalidades principales

✔ CRUD completo de productos
✔ CRUD de carritos
✔ Interfaz web con Handlebars
✔ Actualización en tiempo real con WebSockets
✔ Persistencia en JSON
✔ UI responsive con Bootstrap
✔ Alertas con SweetAlert
✔ Deploy en Render