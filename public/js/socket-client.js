console.log("IN CLIENT");

const socket = io();

const productForm = document.getElementById("productForm");
const updateForm = document.getElementById("updateForm");
const deleteForm = document.getElementById("deleteForm");
const productsList = document.getElementById("productsList");

if (productForm) {
  productForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(productForm);

    const product = {
      title: formData.get("title"),
      description: formData.get("description"),
      code: formData.get("code"),
      price: Number(formData.get("price")),
      stock: Number(formData.get("stock")),
      category: formData.get("category"),
    };

    socket.emit("addProduct", product);
    productForm.reset();

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Producto agregado correctamente / Product added successfully",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });
  });
}

if (updateForm) {
  updateForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(updateForm);
    const pid = formData.get("pid");

    const updateData = {};
    const price = formData.get("price");
    const stock = formData.get("stock");

    if (price !== "") updateData.price = Number(price);
    if (stock !== "") updateData.stock = Number(stock);

    if (Object.keys(updateData).length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No hay cambios para actualizar",
        text: "Ingresá al menos un campo para modificar"
      });
      return;
    }

    socket.emit("updateProduct", { pid, updateData });

    updateForm.reset();

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Producto actualizado / Product updated",
      showConfirmButton: false,
      timer: 1800
    });
  });
}

if (deleteForm) {
  deleteForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(deleteForm);
    const pid = formData.get("pid");

    Swal.fire({
      title: "¿Eliminar producto? / Delete product?",
      text: `Se eliminará el producto con ID ${pid} / The product with the ID ${pid} will be deleted`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar / Yes, delete",
      cancelButtonText: "Cancelar / Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        socket.emit("deleteProduct", pid);
        deleteForm.reset();

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Producto eliminado / Product deleted",
          showConfirmButton: false,
          timer: 1800
        });
      }
    });
  });
}

socket.on("productsUpdated", (products) => {
  if (!productsList) return;

  productsList.innerHTML = "";

  products.forEach((product) => {
    const col = document.createElement("div");
    col.className = "col-md-4 col-sm-6";

    col.innerHTML = `
      <div class="card product-card h-100 shadow-sm">
        <div class="card-body">
          <h5 class="card-title product-title">${product.title}</h5>
          <p class="card-text text-body-secondary product-id">ID: ${product.id}</p>
          <p class="card-text product-info"><strong>Price:</strong> $${product.price}</p>
          <p class="card-text product-info"><strong>Stock:</strong> ${product.stock}</p>
        </div>
      </div>
    `;

    productsList.appendChild(col);
  });
});