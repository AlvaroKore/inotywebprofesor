import React, { useState, useEffect } from "react";
import { RadioTipoPublicacion } from "../../RadioTipoPublicacion";
import { RadioTipoFechaEvaluacion } from "../../RadioTipoFechaEvaluacion";
import { FechaRangoPicker } from "../../FechaRangoPicker";
import { SelectPublicador } from "../SelectPublicador";
import moment from "moment";
import {
  getDestinatariosByIdPublicacion,
  getPublicacion,
} from "../../../services/publicaciones";
import { Button, FormControlLabel, Switch } from "@material-ui/core";
import { DataTablePublicacion } from "../DataTablePublicacion";
import { arrayOfObjectsToTableForm } from "../../../utils/arrayOfObjectsToTableForm";
import { Box, Grid } from "@material-ui/core";
import { RadioTipoAutorizacion } from "../RadioTipoAutorizacion";
import { getDestinatariosByIdQuiz, getQuiz } from "../../../services/quiz";
import { SelectCiclosByTipo } from "../../SelectCiclosByTipo";
import { useDispatch, useSelector } from "react-redux";
import {
  setAlcance,
  setIdCiclo,
  setIdNivel,
} from "../../../store/actions/publicacionActions";
import { SelectNivelesByIdUsuario } from "../../SelectNivelesByUsuario";
import { TablaCuestionariosProvider } from "../TablaCuestionarios/context/TablaCuestionariosContext";

export const EdicionPublicacionContainer = ({ tipoUsuario }) => {
  const [tipoPublicacion, setTipoPublicacion] = useState("avisos");
  const [tipoAutorizacion, setTipoAutorizacion] = useState("TODAS");
  const [tipoFechaEvaluacion, setTipoFechaEvaluacion] =
    useState("FECHA_PUBLICACION");
  const [fechaInicial, setFechaInicial] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");
  const [idUsuario, setIdUsuario] = useState("");
  const [tableRows, setTableRows] = useState([]);
  const [loading, setLoading] = useState(false)

  const idCiclo = useSelector((state) => state.publicaciones.idCiclo);
  const idNivel = useSelector((state) => state.publicaciones.idNivel);
  const niveles = useSelector((state) => state.publicaciones.niveles);
  const alcance = useSelector((state) => state.publicaciones.alcance);

  const dispatch = useDispatch();

  const usuarioStorage = JSON.parse(localStorage.getItem("inoty-user"));

  //const [ tableFields, setTableFields ] = useState([]);

  useEffect(() => {
    if (fechaInicial === "" || fechaFinal === "") {
      let fInicio = moment().startOf("month").toDate();
      let fFinal = moment().endOf("month").toDate();

      fInicio.setHours(0);
      fInicio.setMinutes(0);
      fInicio.setSeconds(0);

      fFinal.setHours(23);
      fFinal.setMinutes(59);
      fFinal.setSeconds(59);

      setFechaInicial(moment(fInicio).format("YYYY-MM-DDTHH:mm"));
      setFechaFinal(moment(fFinal).format("YYYY-MM-DDTHH:mm"));
      dispatch(setIdCiclo(""));
      dispatch(setIdNivel(""));
    }
  }, []);

  const handleChangeTipoAutorizacion = (e) => {
    setTipoAutorizacion(e.target.value);
  };

  const handleChangeTipoPublicacion = (e) => {
    setTipoPublicacion(e.target.value);
  };
  const handleChangeTipoFechaEvaluacion = (e) => {
    setTipoFechaEvaluacion(e.target.value);
  };

  const handleChangeFechaInicial = (event) => {
    setFechaInicial(event.target.value);
  };

  const handleChangeFechaFinal = (event) => {
    setFechaFinal(event.target.value);
  };

  const handleChangeIdUsuario = (event) => {
    setIdUsuario(event.target.value);
  };

  const handleClickGetPublicaciones = async () => {
    if (tipoPublicacion === "cuestionarios") {
      return;
    }

    try {
      const inicialFormat = moment(fechaInicial).format();
      const finalFormat = moment(fechaFinal).format();

      let filtros = {};
      setLoading(true)

      switch (tipoFechaEvaluacion) {
        case "FECHA_PUBLICACION":
          filtros.fCreacionInicial = inicialFormat;
          filtros.fCreacionFinal = finalFormat;
          break;
        case "FECHA_VIGENCIA":
          filtros.fPublicacionInicial = inicialFormat;
          filtros.fPublicacionFinal = finalFormat;
          break;
        case "FECHA_MODIFICACION":
          filtros.fModificacionInicial = inicialFormat;
          filtros.fModificacionFinal = finalFormat;
          break;
        default:
          filtros.fPublicacionInicial = inicialFormat;
          filtros.fPublicacionFinal = finalFormat;
          break;
      }

      switch (tipoAutorizacion) {
        case "AUTORIZADAS": {
          filtros.autorizadas = true;
          break;
        }
        case "SIN_AUTORIZAR": {
          filtros.autorizadas = false;
          break;
        }
        default:
          break;
      }
      console.log("idUsuario", idUsuario);
      console.log("tipoUsuario", tipoUsuario);
      const userStorage = JSON.parse(localStorage.getItem("inoty-user"));

      if (tipoUsuario === "PROFESOR") {
        filtros.idUsuario = userStorage.idUsuarioConPrefijo;
      }
      if (idCiclo !== "") {
        filtros.ciclos = idCiclo;
      }
      if (idNivel !== "") {
        filtros.niveles = idNivel;
      } else {
        // filtros.idNivel = niveles.join(",")
      }

      // Tipo de publicacion puede ser 'avisos', 'tareas' o 'cuestionarios'

      const publicaciones = await getPublicacion(tipoPublicacion, filtros);
      console.log("publicaciones", publicaciones);

      const rowsWithDestinatarios = await Promise.all(
        publicaciones.map(async (element) => {
          try {
            const destinatarios = await getDestinatariosByIdPublicacion(
              element.id
            );
            element.destinatarios = destinatarios;
            return element;
          } catch (err) {
            console.log("error map");
            console.log(err);
          }
        })
      );
      console.log(rowsWithDestinatarios);
      setTableRows(rowsWithDestinatarios);
      setLoading(false)
    } catch (err) {
      console.log("err", err);
      setLoading(false)
    }
  };

  return (
    <div>
      <Box>
        <Grid container spacing={1}>
          <Grid item md={3}>
            <SelectCiclosByTipo
              tipo={"NORMAL"}
              idCiclo={idCiclo}
              onChangeCiclo={(e) => {
                dispatch(setIdCiclo(e.target.value));
              }}
              label="Ciclo"
            />

            <SelectNivelesByIdUsuario
              idUsuario={usuarioStorage.idUsuario}
              idNivel={idNivel}
              label="Nivel"
              onChangeNivel={(e, lista) => {
                dispatch(setIdNivel(e.target.value));
                //TODO dispatch nivel en alcance
                dispatch(
                  setAlcance({
                    ...alcance,
                    niveles: [e.target.value],
                  })
                );
              }}
            />
          </Grid>
          <Grid item md={3}>
            <RadioTipoPublicacion
              tipoPublicacion={tipoPublicacion}
              onChangeTipoPublicacion={handleChangeTipoPublicacion}
              tipoUsuario={tipoUsuario}
            />
            <RadioTipoFechaEvaluacion
              tipoFechaEvaluacion={tipoFechaEvaluacion}
              onChangeTipoFechaEvaluacion={handleChangeTipoFechaEvaluacion}
            />
          </Grid>
          <Grid item md={3}>
            <RadioTipoAutorizacion
              tipoAutorizacion={tipoAutorizacion}
              onChangeTipoAutorizacion={handleChangeTipoAutorizacion}
            />
            <FechaRangoPicker
              fechaInicial={fechaInicial}
              fechaFinal={fechaFinal}
              onChangeFechaInicial={handleChangeFechaInicial}
              onChangeFechaFinal={handleChangeFechaFinal}
            />

            {tipoUsuario === "USUARIO" && (
              <SelectPublicador
                idUsuario={idUsuario}
                onChangeIdUsuario={handleChangeIdUsuario}
              />
            )}
          </Grid>

          <Grid
            item
            md={3}
            style={{
              display: "flex",
              flexDirection: "column-reverse",
              paddingBottom: 30,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleClickGetPublicaciones}
              disabled={loading}
            >
              {loading?"Cargando": "Consultar"}
            </Button>
          </Grid>

          {/* <pre style={{background:"pink"}}>
              alcance: {JSON.stringify(alcance,null,2)}
            </pre> */}

          <Grid item xs={12} sm={12} md={12}>
            <TablaCuestionariosProvider>
              <DataTablePublicacion
                rows={tableRows}
                setTableRows={setTableRows}
                tipoPublicacion={tipoPublicacion}
              />
            </TablaCuestionariosProvider>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};
