import React, { useState } from "react";
import axios from "axios";
import {
  Modal,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const ProductoModal = ({ onClose, refreshProductos }) => {
  // Estado para almacenar los valores del formulario
  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Realizamos una solicitud POST para agregar el nuevo producto
    axios
      .post("https://inventarioapi-cz62.onrender.com/productos/", {
        nombre,
        codigo,
      })
      .then(() => {
        // Refrescamos la lista de productos después de agregar el nuevo producto
        refreshProductos();
        // Cerramos el modal
        onClose();
      })
      .catch((error) => {
        console.error("Error creando producto:", error);
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
        <h2>Agregar Producto</h2>
        <form onSubmit={handleSubmit}>
          {/* Campo Nombre */}
          <TextField
            label="Nombre"
            type="text"
            fullWidth
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            margin="normal"
          />

          {/* Campo Código */}
          <TextField
            label="Código"
            type="text"
            fullWidth
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            required
            margin="normal"
          />

          {/* Botones de Guardar y Cerrar */}
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

export default ProductoModal;
