// components/MovimientoModal.jsx
import React, { useState } from "react";
import axios from "axios";

const MovimientoModal = ({ onClose }) => {
  const [productoId, setProductoId] = useState("");
  const [tipoMovimiento, setTipoMovimiento] = useState("entrada");
  const [cantidad, setCantidad] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("https://inventarioapi-cz62.onrender.com/movimientos/", {
        producto: productoId,
        tipo_movimiento: tipoMovimiento,
        cantidad,
        fecha: new Date().toISOString().split("T")[0], // Fecha actual
      })
      .then(() => {
        onClose();
      })
      .catch((error) => {
        console.error("Error creando movimiento:", error);
      });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Agregar Movimiento</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Producto ID:</label>
            <input
              type="text"
              value={productoId}
              onChange={(e) => setProductoId(e.target.value)}
            />
          </div>
          <div>
            <label>Tipo Movimiento:</label>
            <select
              value={tipoMovimiento}
              onChange={(e) => setTipoMovimiento(e.target.value)}
            >
              <option value="entrada">Entrada</option>
              <option value="salida">Salida</option>
            </select>
          </div>
          <div>
            <label>Cantidad:</label>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
            />
          </div>
          <button type="submit">Guardar</button>
        </form>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default MovimientoModal;
