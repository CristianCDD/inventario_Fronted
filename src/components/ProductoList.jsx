import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductoModal from "./ProductoModal";
import MovimientoModal from "./MovimientoModal";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import "../styles/ProductoList.css"; // Importamos el archivo de estilos CSS

const ProductoList = () => {
  const [productos, setProductos] = useState([]);
  const [showProductoModal, setShowProductoModal] = useState(false);
  const [showMovimientoModal, setShowMovimientoModal] = useState(false);

  // Fetch the product data from the API
  useEffect(() => {
    axios
      .get("https://inventarioapi-cz62.onrender.com/listado/")
      .then((response) => {
        // Filtra los productos cuyo stock es mayor o igual a 1
        const productosFiltrados = response.data.filter(
          (producto) => producto.stock >= 1
        );
        setProductos(productosFiltrados);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  // Handle showing the "Agregar Producto" modal
  const handleShowProductoModal = () => {
    setShowProductoModal(true);
  };

  // Handle showing the "Agregar Movimiento" modal
  const handleShowMovimientoModal = () => {
    setShowMovimientoModal(true);
  };

  // Función para actualizar la lista de productos
  const refreshProductos = () => {
    axios
      .get("https://inventarioapi-cz62.onrender.com/listado/")
      .then((response) => {
        // Filtra los productos cuyo stock es mayor o igual a 1
        const productosFiltrados = response.data.filter(
          (producto) => producto.stock >= 1
        );
        setProductos(productosFiltrados); // Actualiza el estado con los productos filtrados
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };

  // Función para eliminar un producto
  const handleDelete = (id_producto) => {
    // Mostrar el mensaje de confirmación
    const isConfirmed = window.confirm(
      "¿Estás seguro de eliminar este producto? Esto eliminará el historial de registros asociados."
    );

    // Si el usuario confirma la eliminación
    if (isConfirmed) {
      // Realizamos la solicitud DELETE al servidor para eliminar el producto
      axios
        .delete(
          `https://inventarioapi-cz62.onrender.com/productos/${id_producto}/`
        )
        .then((response) => {
          // Si la eliminación es exitosa, actualizamos la lista de productos
          console.log(`Producto con ID ${id_producto} eliminado correctamente`);
          refreshProductos(); // Actualiza la lista de productos
        })
        .catch((error) => {
          console.error("Error eliminando el producto:", error);
        });
    } else {
      // Si el usuario cancela, no hacemos nada
      console.log("Eliminación cancelada");
    }
  };

  return (
    <div>
      <h1>Listado de Productos</h1>
      <Button
        variant="contained"
        onClick={handleShowProductoModal}
        style={{ margin: "10px" }}
      >
        Agregar Producto
      </Button>
      <Button
        variant="contained"
        onClick={handleShowMovimientoModal}
        style={{ margin: "10px" }}
      >
        Agregar Movimiento
      </Button>

      {/* Material-UI Table */}
      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Código</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Última Fecha de Movimiento</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((producto) => (
              <TableRow key={producto.codigo}>
                <TableCell>{producto.nombre}</TableCell>
                <TableCell>{producto.codigo}</TableCell>
                <TableCell>{producto.stock}</TableCell>
                <TableCell>{producto.ultima_fecha_movimiento}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDelete(producto.id_producto)} // Llama a la función handleDelete
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal para agregar producto */}
      {showProductoModal && (
        <ProductoModal
          onClose={() => setShowProductoModal(false)}
          refreshProductos={refreshProductos} // Pasamos la función de actualización
        />
      )}

      {/* Modal para agregar movimiento */}
      {showMovimientoModal && (
        <MovimientoModal
          onClose={() => setShowMovimientoModal(false)}
          refreshProductos={refreshProductos} // Pasamos la función de actualización
        />
      )}
    </div>
  );
};

export default ProductoList;
