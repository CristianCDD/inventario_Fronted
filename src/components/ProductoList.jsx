import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductoModal from "./ProductoModal";
import MovimientoModal from "./MovimientoModal";
import HistorialModal from "./HistorialModal";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Pagination,
  Stack,
} from "@mui/material";
import "../styles/ProductoList.css";

const ProductoList = () => {
  const [productos, setProductos] = useState([]);
  const [showProductoModal, setShowProductoModal] = useState(false);
  const [showMovimientoModal, setShowMovimientoModal] = useState(false);
  const [showHistorialModal, setShowHistorialModal] = useState(false);
  const [historialFechas, setHistorialFechas] = useState([]);
  const [selectedProductoId, setSelectedProductoId] = useState(null);

  // --- NUEVO: paginación ---
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = () => {
    axios
      .get("https://inventarioapi-cz62.onrender.com/listado/")
      .then((response) => {
        const productosFiltrados = response.data.filter((p) => p.stock >= 1);
        setProductos(productosFiltrados);
        setPage(1); // reset a la primera página cuando recargas datos
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };

  const refreshProductos = () => cargarProductos();

  // Asegura que la página actual no exceda el total cuando cambia la lista
  const totalPages = Math.max(1, Math.ceil(productos.length / rowsPerPage));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [productos, totalPages, page]);

  // Calcula las filas visibles de la página actual
  const startIndex = (page - 1) * rowsPerPage;
  const currentRows = productos.slice(startIndex, startIndex + rowsPerPage);

  const handleShowProductoModal = () => setShowProductoModal(true);
  const handleShowMovimientoModal = () => setShowMovimientoModal(true);

  const handleDelete = (id_producto) => {
    const isConfirmed = window.confirm(
      "¿Estás seguro de eliminar este producto? Esto eliminará el historial de registros asociados."
    );
    if (!isConfirmed) return;

    axios
      .delete(
        `https://inventarioapi-cz62.onrender.com/productos/${id_producto}/`
      )
      .then(() => {
        refreshProductos();
      })
      .catch((error) => {
        console.error("Error eliminando el producto:", error);
      });
  };

  const handleShowHistorial = (id_producto) => {
    setSelectedProductoId(id_producto);
    axios
      .get(`https://inventarioapi-cz62.onrender.com/historial/${id_producto}`)
      .then((response) => {
        setHistorialFechas(response.data.historial_movimientos);
        setShowHistorialModal(true);
      })
      .catch((error) => {
        console.error("Error fetching historial:", error);
      });
  };

  const handlePageChange = (_e, value) => setPage(value);

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
            {currentRows.map((producto) => (
              <TableRow key={producto.id_producto}>
                <TableCell>{producto.nombre}</TableCell>
                <TableCell>{producto.codigo}</TableCell>
                <TableCell>{producto.stock}</TableCell>
                <TableCell>{producto.ultima_fecha_movimiento}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDelete(producto.id_producto)}
                  >
                    Eliminar
                  </Button>
                  <Button
                    className="btnHistorial"
                    variant="outlined"
                    onClick={() => handleShowHistorial(producto.id_producto)}
                  >
                    Historial
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {productos.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No hay productos para mostrar
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* --- NUEVO: Pagination abajo y centrado --- */}
      <Stack spacing={2} alignItems="center" style={{ marginTop: 16 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          variant="outlined"
          shape="rounded"
          showFirstButton
          showLastButton
        />
      </Stack>

      {/* Modal para agregar producto */}
      {showProductoModal && (
        <ProductoModal
          onClose={() => setShowProductoModal(false)}
          refreshProductos={refreshProductos}
        />
      )}

      {/* Modal para agregar movimiento */}
      {showMovimientoModal && (
        <MovimientoModal
          onClose={() => setShowMovimientoModal(false)}
          refreshProductos={refreshProductos}
        />
      )}

      {/* Modal para mostrar historial */}
      {showHistorialModal && (
        <HistorialModal
          onClose={() => setShowHistorialModal(false)}
          historialFechas={historialFechas}
          idProducto={selectedProductoId}
          onSaved={() => {
            axios
              .get(
                `https://inventarioapi-cz62.onrender.com/historial/${selectedProductoId}`
              )
              .then((response) =>
                setHistorialFechas(response.data.historial_movimientos)
              )
              .catch((err) =>
                console.error("Error refrescando historial:", err)
              );
            refreshProductos();
          }}
        />
      )}
    </div>
  );
};

export default ProductoList;
