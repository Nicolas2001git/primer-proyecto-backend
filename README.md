# PRIMER PROYECTO BACKEND

API REST desarrollada con **Node.js + Express** que permite gestionar productos y carritos de compra con persistencia en archivos JSON.

Este proyecto implementa:

* CRUD completo de productos
* Creación y gestión de carritos
* Agregado de productos a carritos
* Persistencia de datos usando `fs`
* Arquitectura modular con routers

---

## 🚀 Tecnologías utilizadas

* Node.js
* Express
* File System (`fs`)
* JavaScript ES Modules

---

## 📁 Estructura del Proyecto

```
PROYECTO BACKEND 1
│
├── node_modules
├── src
│   ├── data
│   │   ├── carts.json
│   │   └── products.json
│   │
│   ├── routes
│   │   ├── products.router.js
│   │   └── carts.router.js
│   │
│   └── app.js
│
├── .gitignore
├── package.json
└── package-lock.json
```

---

## ⚙️ Configuración e instalación

### 1️⃣ Clonar el repositorio

```bash
git clone <URL_DEL_REPO>
cd PROYECTO BACKEND 1
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Ejecutar el servidor

```bash
npm start
```

El servidor corre en:

```
http://localhost:8080
```

Archivo principal:
`app.js` 

---

# 📌 Endpoints disponibles

---

# 🛍️ Productos

Router:
`products.router.js` 

Base URL:

```
/api/products
```

---

## 🔹 GET /api/products

Obtiene todos los productos.

---

## 🔹 GET /api/products/:pid

Obtiene un producto por ID.

Ejemplo:

```
GET /api/products/1
```

Si no existe:

```json
{
  "status": "error",
  "message": "Product not found #1"
}
```

---

## 🔹 POST /api/products

Crea un nuevo producto.

### Body requerido:

```json
{
  "title": "Producto",
  "description": "Descripción",
  "code": "ABC123",
  "price": 1000,
  "stock": 10,
  "category": "Electronics"
}
```

Campos opcionales:

* `status` (default: true)
* `thumbnails` (default: [])

---

## 🔹 PUT /api/products/:pid

Actualiza campos parciales de un producto.

---

## 🔹 DELETE /api/products/:pid

Elimina un producto por ID.

---

# 🛒 Carritos

Router:
`carts.router.js` 

Base URL:

```
/api/carts
```

---

## 🔹 POST /api/carts

Crea un nuevo carrito.

Respuesta:

```json
{
  "id": 1,
  "products": []
}
```

---

## 🔹 GET /api/carts/:cid

Devuelve los productos de un carrito específico.

---

## 🔹 POST /api/carts/:cid/product/:pid

Agrega un producto a un carrito.

* Si el producto ya existe en el carrito → incrementa cantidad.
* Si no existe → lo agrega con quantity = 1.

---

# 💾 Persistencia de datos

Los datos se almacenan en:

* `products.json` 
* `carts.json` 

El sistema utiliza `fs.readFileSync` y `fs.writeFileSync` para mantener persistencia.

# 🧠 Características técnicas destacadas

✔ Generación automática de IDs
✔ Validación de campos obligatorios
✔ Manejo de errores con status HTTP
✔ Arquitectura modular con Express Router
✔ Uso de `express.json()` y `express.urlencoded()`
✔ Separación clara entre rutas y servidor principal
