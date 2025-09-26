import React, { useState, useEffect, useMemo } from "react";
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
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import "../styles/ProductoList.css";

const ProductoList = () => {
  const [productos, setProductos] = useState([]);
  const [showProductoModal, setShowProductoModal] = useState(false);
  const [showMovimientoModal, setShowMovimientoModal] = useState(false);
  const [showHistorialModal, setShowHistorialModal] = useState(false);
  const [historialFechas, setHistorialFechas] = useState([]);
  const [selectedProductoId, setSelectedProductoId] = useState(null);

  // --- NUEVO: buscador ---
  const [query, setQuery] = useState("");

  // --- Paginación ---
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = () => {
    axios
      .get("https://inventarioapi-cz62.onrender.com/listado/")
      .then((response) => {
        setProductos(response.data); // ya no filtramos por stock
        setPage(1);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };

  const refreshProductos = () => cargarProductos();

  // --- Filtrado memorizado por nombre o código ---
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return productos;
    return productos.filter((p) => {
      const nombre = (p.nombre ?? "").toString().toLowerCase();
      const codigo = (p.codigo ?? "").toString().toLowerCase();
      return nombre.includes(q) || codigo.includes(q);
    });
  }, [productos, query]);

  // Asegurar que la paginación use la lista filtrada
  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [filtered.length, totalPages, page]);

  // Resetear a página 1 cuando cambie el término de búsqueda
  useEffect(() => {
    setPage(1);
  }, [query]);

  // Filas visibles de la página actual (de la lista filtrada)
  const startIndex = (page - 1) * rowsPerPage;
  const currentRows = filtered.slice(startIndex, startIndex + rowsPerPage);

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

      {/* --- Barra de acciones --- */}
      <Stack
        className="acciones"
        direction="row"
        spacing={2} // espacio uniforme entre botones y buscador
        alignItems="center"
      >
        <Button variant="contained" onClick={handleShowProductoModal}>
          Agregar Producto
        </Button>
        <Button
          className="btnMovimiento"
          variant="contained"
          onClick={handleShowMovimientoModal}
        >
          Agregar Movimiento
        </Button>

        {/* --- Buscador pegado a los botones --- */}
        <TextField
          className="buscador"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre o código…"
          variant="outlined"
          size="small"
          sx={{ minWidth: 300 }} // ancho mínimo para que no quede muy chico
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: query ? (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Limpiar búsqueda"
                  onClick={() => setQuery("")}
                  edge="end"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />
      </Stack>
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

      {/* Pagination abajo y centrado (usa el total de la lista filtrada) */}
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
