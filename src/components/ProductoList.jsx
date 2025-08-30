// components/ProductoList.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductoModal from "./ProductoModal";
import MovimientoModal from "./MovimientoModal";

const ProductoList = () => {
  const [productos, setProductos] = useState([]);
  const [showProductoModal, setShowProductoModal] = useState(false);
  const [showMovimientoModal, setShowMovimientoModal] = useState(false);

  useEffect(() => {
    // Fetch the product data from API
    axios
      .get("https://inventarioapi-cz62.onrender.com/listado/")
      .then((response) => {
        setProductos(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const handleShowProductoModal = () => {
    setShowProductoModal(true);
  };

  const handleShowMovimientoModal = () => {
    setShowMovimientoModal(true);
  };

  return (
    <div>
      <h1>Listado de Productos</h1>
      <button onClick={handleShowProductoModal}>Agregar Producto</button>
      <button onClick={handleShowMovimientoModal}>Agregar Movimiento</button>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Código</th>
            <th>Stock</th>
            <th>Última Fecha de Movimiento</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.codigo}>
              <td>{producto.nombre}</td>
              <td>{producto.codigo}</td>
              <td>{producto.stock}</td>
              <td>{producto.ultima_fecha_movimiento}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para agregar producto */}
      {showProductoModal && (
        <ProductoModal
          onClose={() => setShowProductoModal(false)}
          refreshProductos={() => {
            axios
              .get("https://inventarioapi-cz62.onrender.com/listado/")
              .then((response) => {
                setProductos(response.data);
              });
          }}
        />
      )}

      {/* Modal para agregar movimiento */}
      {showMovimientoModal && (
        <MovimientoModal onClose={() => setShowMovimientoModal(false)} />
      )}
    </div>
  );
};

export default ProductoList;
