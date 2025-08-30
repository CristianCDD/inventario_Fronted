import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Modal,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";

const MovimientoModal = ({ onClose }) => {
  const [productos, setProductos] = useState([]);
  const [productoId, setProductoId] = useState("");
  const [tipoMovimiento, setTipoMovimiento] = useState("entrada");
  const [cantidad, setCantidad] = useState(0);

  useEffect(() => {
    // Obtener los productos desde la API para mostrar en el select
    axios
      .get("https://inventarioapi-cz62.onrender.com/listado/")
      .then((response) => {
        setProductos(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Realizar la solicitud POST para agregar el movimiento
    axios
      .post("https://inventarioapi-cz62.onrender.com/movimientos/", {
        producto: productoId,
        tipo_movimiento: tipoMovimiento,
        cantidad,
        fecha: new Date().toISOString().split("T")[0], // Fecha actual
      })
      .then(() => {
        onClose(); // Cerrar el modal
      })
      .catch((error) => {
        console.error("Error creating movement:", error);
      });
  };

  return (
    <Modal open={true} onClose={onClose}>
      <div
        style={{
          padding: "20px",
          backgroundColor: "white",
          width: "300px",
          margin: "auto",
          marginTop: "100px",
          borderRadius: "8px",
        }}
      >
        <h2>Agregar Movimiento</h2>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="producto-select-label">Producto</InputLabel>
            <Select
              labelId="producto-select-label"
              value={productoId}
              onChange={(e) => setProductoId(e.target.value)}
              label="Producto"
              required
            >
              {productos.map((producto) => (
                <MenuItem key={producto.codigo} value={producto.codigo}>
                  {producto.nombre} ({producto.codigo})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="tipo-movimiento-label">Tipo Movimiento</InputLabel>
            <Select
              labelId="tipo-movimiento-label"
              value={tipoMovimiento}
              onChange={(e) => setTipoMovimiento(e.target.value)}
              label="Tipo Movimiento"
              required
            >
              <MenuItem value="entrada">Entrada</MenuItem>
              <MenuItem value="salida">Salida</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Cantidad"
            type="number"
            fullWidth
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            required
            margin="normal"
          />

          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button type="submit" variant="contained" color="primary">
              Guardar
            </Button>
            <Button variant="outlined" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default MovimientoModal;
