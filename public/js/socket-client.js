console.log("IN CLIENT");

const socket = io();

const productForm = document.getElementById("productForm");
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
      price: formData.get("price"),
      stock: formData.get("stock"),
      category: formData.get("category"),
    };

    socket.emit("addProduct", product);
    productForm.reset();

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Producto agregado correctamente/Product added successfully ",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
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
      text: `Se eliminará el producto con ID ${pid}/ The product with the ID ${pid} will be deleted `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar/ Yes, delete",
      cancelButtonText: "Cancelar/Cancel"
    }).then((result) => {

      if (result.isConfirmed) {

        socket.emit("deleteProduct", pid);
        deleteForm.reset();

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Producto eliminado/ Product deleted",
          showConfirmButton: false,
          timer: 2000
        });

      }

    });

  });
}

socket.on("productsUpdated", (products) => {

  if (!productsList) return;

  productsList.textContent = "";

  products.forEach((product) => {
    const li = document.createElement("li");
    li.textContent = `ID: ${product.id} | ${product.title} | $${product.price} | Stock: ${product.stock}`;
    productsList.appendChild(li);

  });

});