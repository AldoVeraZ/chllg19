document.addEventListener("DOMContentLoaded", function () {
  // utilizaremos el evento DOMContentLoaded para asegurarnos de que el contenido HTML esté completamente cargado antes de ejecutar nuestro JavaScript

  /* Dentro del controlador de eventos DOMContentLoaded, obtenemos referencia al formulario y al contenedor de resultados del HTML. */
  // Obtenemos referencia al formulario y al contenedor de resultados del HTML
  const form = document.getElementById("searchForm");
  const resultsContainer = document.getElementById("resultsContainer");

  // Agregamos un evento de escucha para cuando se envía el formulario
  form.addEventListener("submit", async function (event) {
    // Evitamos que el formulario se envíe de forma predeterminada
    event.preventDefault();

    // Obtenemos el término de búsqueda del input del formulario y lo limpiamos
    const searchTerm = document
      .getElementById("searchInput")
      .value.trim()
      .toLowerCase();

    if (searchTerm === "") {
      // Si el campo de búsqueda está vacío, mostramos un mensaje de error
      displayNoResults("Debes ingresar un término de búsqueda en el campo");
    } else {
      try {
        // Realizamos solicitudes para obtener los productos de diferentes categorías
        const [computers, cellphones, tablets] = await Promise.all([
          fetchProducts("computers"),
          fetchProducts("cellphones"),
          fetchProducts("tablets"),
        ]);

        // Combinamos todos los productos en un solo arreglo
        const allProducts = [...computers, ...cellphones, ...tablets];

        // Filtramos los productos que coinciden con el término de búsqueda
        const matchingProducts = allProducts.filter((product) => {
          const productName = product.name.toLowerCase();
          return (
            productName.includes(searchTerm) ||
            (searchTerm === "pc" && product.type === "computer") ||
            (searchTerm === "computador" && product.type === "computer") ||
            (searchTerm === "celular" && product.type === "cellphone") ||
            (searchTerm === "celulares" && product.type === "cellphone") ||
            (searchTerm === "tablet" && product.type === "tablet") ||
            (searchTerm === "tableta" && product.type === "tablet")
          );
        });

        // Mostrar los resultados de la búsqueda o el mensaje de "No se encontraron productos
        if (matchingProducts.length > 0) {
          displayResults(matchingProducts);
        } else {
          displayNoResults("No se encontraron productos");
        }
      } catch (error) {
        // Manejamos cualquier error que pueda ocurrir durante la búsqueda
        console.log("Error al buscar productos", error);
        displayNoResults("Ocurrió un error al buscar productos");
      }
    }
  }); /* Find de controlador de eventos del formulario */

  // Función para obtener los productos de una categoría específica desde la API
  async function fetchProducts(category) {
    // Realizamos una solicitud para obtener los productos de la categoría especificada desde la API
    const response = await fetch(
      `https://my-json-server.typicode.com/AldoVeraZ/my-fk-db/${category}`
    );
    // Convertimos la respuesta a formato JSON
    const data = await response.json();

    // Agregamos una propiedad 'type' a cada producto para identificar su categoría (computadora, celular, tablet)
    return data.map((product) => ({
      ...product,
      type: category.slice(0, -1), // Eliminamos la última letra "s" para obtener la categoría singular (computer, cellphone, tablet)
    }));
  } // fin funcion categoria

  // Función para mostrar los resultados de la búsqueda en el contenedor de resultados
  function displayResults(products) {
    // Limpiamos cualquier contenido previo del contenedor de resultados
    resultsContainer.innerHTML = "";

    // Creamos una tabla para mostrar los productos
    const table = document.createElement("table");
    table.classList.add("products-table");

    // Creamos el encabezado de la tabla
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const headers = ["IMAGEN", "NOMBRE", "PRECIO"];

    // Agregamos los encabezados a la fila del encabezado
    headers.forEach((headerText) => {
      const th = document.createElement("th");
      th.textContent = headerText;
      headerRow.appendChild(th);
    });

    // Agregamos la fila del encabezado a la tabla
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Creamos el cuerpo de la tabla
    const tbody = document.createElement("tbody");

    // Iteramos sobre los productos y creamos filas para cada uno
    products.forEach((product) => {
      const row = document.createElement("tr");

      // Creamos celdas para la imagen, el nombre y el precio del producto
      const imageCell = document.createElement("td");
      const nameCell = document.createElement("td");
      const priceCell = document.createElement("td");

      // Agregamos los datos del producto a las celdas correspondientes
      imageCell.innerHTML = `<img src="${product.image}" alt="${product.name}" class="product-image">`;
      nameCell.textContent = product.name;
      priceCell.textContent = product.price;

      // Agregamos las celdas a la fila
      row.appendChild(imageCell);
      row.appendChild(nameCell);
      row.appendChild(priceCell);

      // Agregamos la fila al cuerpo de la tabla
      tbody.appendChild(row);
    });

    // Agregamos el cuerpo de la tabla a la tabla
    table.appendChild(tbody);

    // Agregamos la tabla al contenedor de resultados
    resultsContainer.appendChild(table);
  } // displayResults's End

  // Función para mostrar un mensaje cuando no se encuentran productos o cuando el campo de búsqueda está vacío
  function displayNoResults(message) {
    const toastMessage = document.getElementById("toastMessage");
    toastMessage.textContent = message;
    toastMessage.classList.add("show");

    // Ocultar el mensaje de toast después de unos segundos
    setTimeout(function () {
      toastMessage.classList.remove("show");
    }, 3000); // Mostrar durante 3 segundos (ajusta según necesites)
  }
}); /* Fin de Controlador de eventos general */
