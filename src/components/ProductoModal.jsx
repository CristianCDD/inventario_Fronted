// components/ProductoModal.jsx
import React, { useState } from "react";
import axios from "axios";

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Agregar Producto</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nombre:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Código:</label>
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              required
            />
          </div>
          <button type="submit">Guardar</button>
        </form>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default ProductoModal;
