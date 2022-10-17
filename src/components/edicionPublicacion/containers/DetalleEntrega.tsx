import React, { useEffect } from "react";
import { TextField, Button } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import { makeStyles } from "@material-ui/core/styles";
import { putContenedor } from "../../../services/publicaciones";
import moment from "moment";
import { IEntrega } from "../ListaEntrega/Entrega.interface";
import toast from "react-hot-toast";

interface Props {
  entrega: IEntrega;
  onSaveCalificacion: () => void;
}
export const DetalleEntrega: React.FC<Props> = ({ entrega , onSaveCalificacion}) => {

  const [comentario, setComentario] = React.useState(entrega.comentario || "");
  const [calificacion, setCalificacion] = React.useState(
    entrega.calificacion || ""
  );
  const [saved, setSave] = React.useState(true);

  // useEffect(() => {
  // 	setComentario(entrega);
  // 	setCalificacion(rowData[7]);
  // }, []);

  const handleChangeComentario = (event: any) => {
    setComentario(event.target.value);
    setSave(false);
  };

  const handleChangeCalificacion = (event: any) => {
    setCalificacion(event.target.value);
    setSave(false);
  };

  const handleClickSave = async () => {
    try {
      const contenedor = {
        comentario: comentario,
        calificacion: calificacion,
        estatus: "CALIFICADO",
        ultimaRevision: moment().format(),
      };
      const res = await putContenedor(
        entrega.idPublicacion,
        entrega.id,
        "entregas",
        contenedor
      );
	  onSaveCalificacion();
	  
    } catch (err: any) {
      console.log("err", err.message);
    }
    setSave(true);

    toast.success("La tarea ha sido calificada.");
  };

  return (
    <div style={{ marginTop: 15, display: "flex", flexDirection: "column" }}>
      <form noValidate autoComplete="off">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <TextField
            id="outlined-multiline-static"
            label="Comentario"
            multiline
            rows={5}
            variant="outlined"
            value={comentario}
            style={{ marginTop: 7 }}
            onChange={handleChangeComentario}
          />
          <TextField
            id="outlined-multiline-flexible"
            style={{ marginTop: 7 }}
            label="Calificación"
			type="number"
            value={calificacion}
            onChange={handleChangeCalificacion}
            variant="outlined"
          />
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: 7 }}
            size="small"
            disabled={saved}
            onClick={handleClickSave}
            startIcon={<SaveIcon />}
          />
        </div>
      </form>
    </div>
  );
};
