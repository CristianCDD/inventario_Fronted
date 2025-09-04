import React, { useState } from "react";
import axios from "axios";
import { Modal, Button, TextField } from "@mui/material";
import "../styles/ProductoModal.css"; // Importamos el archivo de estilos CSS

const ProductoModal = ({ onClose, refreshProductos }) => {
  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("https://inventarioapi-cz62.onrender.com/productos/", {
        nombre,
        codigo,
      })
      .then(() => {
        refreshProductos(); // Llamamos a refreshProductos para actualizar la lista
        onClose(); // Cierra el modal
      })
      .catch((error) => {
        console.error("Error creando producto:", error);
      });
  };

  return (
    <Modal open={true} onClose={onClose}>
      <div className="modal">
        <h2>Agregar Producto</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            className="text-field"
            label="Nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            margin="normal"
          />
          <TextField
            className="text-field"
            label="Código"
            type="text"
            fullWidth
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
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

export default ProductoModal;
