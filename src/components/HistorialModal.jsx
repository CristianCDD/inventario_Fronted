import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Stack,
  Box,
  TextField,
  Divider,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import HistoryIcon from "@mui/icons-material/History";
import Inventory2Icon from "@mui/icons-material/Inventory2";

const tipoColor = (tipo) => {
  const t = (tipo || "").toLowerCase();
  if (t === "entrada") return "success";
  if (t === "salida") return "error";
  return "default";
};

const HistorialModal = ({ onClose, historialFechas, idProducto, onSaved }) => {
  // copia editable
  const [rows, setRows] = useState(
    (historialFechas || []).map((m) => ({
      ...m,
      _edit: false,
      _fecha: m.fecha,
      _cantidad: m.cantidad,
    }))
  );
  const [savingId, setSavingId] = useState(null);

  // re-sincroniza cuando cambie el historial en props
  useEffect(() => {
    setRows(
      (historialFechas || []).map((m) => ({
        ...m,
        _edit: false,
        _fecha: m.fecha,
        _cantidad: m.cantidad,
      }))
    );
  }, [historialFechas]);

  const toggleEdit = (id, cancel = false) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              _edit: !r._edit,
              ...(cancel ? { _fecha: r.fecha, _cantidad: r.cantidad } : {}),
            }
          : r
      )
    );
  };

  const handleChange = (id, field, value) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleSave = async (row) => {
    try {
      setSavingId(row.id);
      // construimos payload solo con cambios
      const payload = { id: row.id };
      if (row._fecha !== row.fecha) payload.fecha = row._fecha;
      if (Number(row._cantidad) !== Number(row.cantidad))
        payload.cantidad = Number(row._cantidad);

      if (Object.keys(payload).length === 1) {
        // no hay cambios
        toggleEdit(row.id, true);
        return;
      }

      await axios.patch(
        `https://inventarioapi-cz62.onrender.com/historial/${idProducto}/`,
        payload
      );

      // reflejar cambios en UI
      setRows((prev) =>
        prev.map((r) =>
          r.id === row.id
            ? {
                ...r,
                fecha: row._fecha,
                cantidad: Number(row._cantidad),
                _edit: false,
              }
            : r
        )
      );

      onSaved && onSaved();
    } catch (e) {
      console.error(e);
      alert("No se pudo guardar el cambio.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <Dialog
      open
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: 3, overflow: "hidden" },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          fontWeight: 800,
          pr: 1,
        }}
      >
        <HistoryIcon />
        Historial de Movimientos
        <Box sx={{ flex: 1 }} />
        <IconButton onClick={onClose} aria-label="cerrar">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          maxHeight: 520,
          p: 2,
          bgcolor: "background.default",
        }}
      >
        {rows.length === 0 ? (
          <Box
            sx={{
              py: 8,
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            <Inventory2Icon sx={{ fontSize: 56, mb: 1 }} />
            <Typography variant="h6">Sin movimientos</Typography>
            <Typography variant="body2">
              No hay registros para este producto.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {rows.map((mov, idx) => (
              <Card
                key={`mov-${mov.id ?? "noid"}-${mov.fecha}-${
                  mov.tipo_movimiento
                }-${idx}`}
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  "&:hover": { boxShadow: 2 },
                  transition: "box-shadow .2s ease",
                }}
              >
                <CardHeader
                  title={
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{ flexWrap: "wrap" }}
                    >
                      <Typography variant="subtitle1" fontWeight={700}>
                        ID #{mov.id}
                      </Typography>
                      <Chip
                        size="small"
                        label={mov.tipo_movimiento}
                        color={tipoColor(mov.tipo_movimiento)}
                        variant="filled"
                        sx={{ textTransform: "capitalize" }}
                      />
                    </Stack>
                  }
                  subheader={
                    <Typography variant="caption" color="text.secondary">
                      Producto: {idProducto}
                    </Typography>
                  }
                  action={
                    !mov._edit ? (
                      <Tooltip title="Editar">
                        <IconButton onClick={() => toggleEdit(mov.id)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Guardar">
                          <span>
                            <IconButton
                              color="primary"
                              onClick={() => handleSave(mov)}
                              disabled={savingId === mov.id}
                            >
                              <SaveIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Cancelar">
                          <IconButton
                            color="inherit"
                            onClick={() => toggleEdit(mov.id, true)}
                          >
                            <CancelIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    )
                  }
                />

                <CardContent sx={{ pt: 0 }}>
                  <Stack spacing={1.5}>
                    {/* Fecha */}
                    <Box>
                      <Typography variant="overline" color="text.secondary">
                        Fecha
                      </Typography>
                      {mov._edit ? (
                        <TextField
                          type="date"
                          size="small"
                          value={mov._fecha}
                          onChange={(e) =>
                            handleChange(mov.id, "_fecha", e.target.value)
                          }
                          sx={{ mt: 0.5 }}
                          InputLabelProps={{ shrink: true }}
                        />
                      ) : (
                        <Typography variant="body1" fontWeight={600}>
                          {mov.fecha}
                        </Typography>
                      )}
                    </Box>

                    <Divider flexItem />

                    {/* Cantidad */}
                    <Box>
                      <Typography variant="overline" color="text.secondary">
                        Cantidad
                      </Typography>
                      {mov._edit ? (
                        <TextField
                          type="number"
                          size="small"
                          inputProps={{ min: 0 }}
                          value={mov._cantidad}
                          onChange={(e) =>
                            handleChange(mov.id, "_cantidad", e.target.value)
                          }
                          sx={{ mt: 0.5, maxWidth: 160 }}
                        />
                      ) : (
                        <Typography variant="body1" fontWeight={600}>
                          {mov.cantidad}
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HistorialModal;
