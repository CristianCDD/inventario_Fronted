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
        setProductos(response.data);
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
        setProductos(response.data); // Actualiza el estado con los nuevos productos
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
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
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((producto) => (
              <TableRow key={producto.codigo}>
                <TableCell>{producto.nombre}</TableCell>
                <TableCell>{producto.codigo}</TableCell>
                <TableCell>{producto.stock}</TableCell>
                <TableCell>{producto.ultima_fecha_movimiento}</TableCell>
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
