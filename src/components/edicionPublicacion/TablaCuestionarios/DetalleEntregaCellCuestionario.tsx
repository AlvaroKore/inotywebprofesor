import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { ICuestionarioAplicacion } from "./interfaces/CuestionarioAplicacion.interface";
import { ICuestionario } from "../../Quizzes/interfaces/cuestionario.interface";
import { EntregaDetailCuestionarioAplicacion } from "./EntregaDetailCuestionarioAplicacion";
import { ListaEntregaCuestionarioAplicacion } from "./ListaEntregaCuestionarioAplicacion";

interface Props {
  cuestionariosAplicacion: any[];
  cuestionario: ICuestionario;
}

const useStyles = makeStyles((theme) => ({
  detalle: {
    color: "blue",
    "&:hover": { cursor: "pointer" },
  },
  paper: {
    position: "absolute",
    width: 600,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    outline: 0,
  },
}));

export const DetalleEntregaCellCuestionarioAplicacion: React.FC<Props> = ({
  cuestionariosAplicacion,
  cuestionario,
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const [entregaDetail, setEntregaDetail] = useState();
  const [showDetail, setShowDetail] = useState(false);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <span className={classes.detalle} onClick={() => setOpen(true)}>
        {cuestionariosAplicacion.length}
      </span>

      <Modal
        style={{
          outline: 0,
          border: "none",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={{ outline: 0 }} className={classes.paper}>
          {/* <h2>{cuestionario.descripcion}</h2> */}
          {showDetail ? (
            <EntregaDetailCuestionarioAplicacion 
              entrega={entregaDetail}
              setShowDetail={setShowDetail}
              cuestionario={cuestionario}
            />
          ) : (
            <ListaEntregaCuestionarioAplicacion
              entregas={cuestionariosAplicacion}
              setEntregaDetail={setEntregaDetail}
              setShowDetail={setShowDetail}
              cuestionario={cuestionario}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};
