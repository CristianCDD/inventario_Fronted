import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, TextField, MenuItem } from "@mui/material";
import "../styles/MovimientoModal.css"; // Importamos el archivo de estilos CSS

const MovimientoModal = ({ onClose, refreshProductos }) => {
  const [productos, setProductos] = useState([]);
  const [productoId, setProductoId] = useState("");
  const [tipoMovimiento, setTipoMovimiento] = useState("entrada");
  const [cantidad, setCantidad] = useState(0);

  useEffect(() => {
    axios
      .get("https://inventarioapi-cz62.onrender.com/productos/")
      .then((response) => {
        const productosOrdenados = response.data.sort((a, b) =>
          a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" })
        );
        setProductos(productosOrdenados);
      })
      .catch((error) => console.error("Error al cargar productos:", error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cantidadNumerica = parseInt(cantidad, 10);
    if (isNaN(cantidadNumerica) || cantidadNumerica <= 0) {
      alert("La cantidad debe ser un número positivo.");
      return;
    }

    axios
      .post("https://inventarioapi-cz62.onrender.com/movimientos/", {
        producto: productoId,
        tipo_movimiento: tipoMovimiento,
        cantidad: cantidadNumerica,
        fecha: new Date().toISOString().split("T")[0],
      })
      .then(() => {
        refreshProductos(); // Actualiza la lista de productos tras el POST
        onClose(); // Cierra el modal
      })
      .catch((error) => {
        console.error("Error creando movimiento:", error);
      });
  };

  return (
    <Modal open={true} onClose={onClose}>
      <div className="modal">
        <h2>Agregar Movimiento</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            select
            label="Producto"
            value={productoId}
            onChange={(e) => setProductoId(e.target.value)}
            fullWidth
            className="text-field"
            required
            margin="normal"
          >
            <MenuItem value="">Seleccionar producto</MenuItem>
            {productos.map((producto) => (
              <MenuItem key={producto.id} value={producto.id}>
                {producto.nombre} ({producto.codigo})
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Tipo Movimiento"
            value={tipoMovimiento}
            onChange={(e) => setTipoMovimiento(e.target.value)}
            fullWidth
            className="text-field"
            required
            margin="normal"
          >
            <MenuItem value="entrada">Entrada</MenuItem>
            <MenuItem value="salida">Salida</MenuItem>
          </TextField>

          <TextField
            label="Cantidad"
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            fullWidth
            className="text-field"
            required
            margin="normal"
          />

          <div className="form-buttons">
            <Button variant="outlined" onClick={onClose}>
              Cerrar
            </Button>

            <Button type="submit" variant="contained" color="primary">
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default MovimientoModal;
