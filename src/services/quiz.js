import axios from "axios";
import { getUserLocalStorage } from "../utils/getUserLocalStorage";

export const getQuiz = async (filtros) => {
  try {
    const base_url = process.env.REACT_APP_API_URL;

    const params = filtros;
    //console.log('params', params)
    const { idAccount, tokenAut, idUsuarioConPrefijo } = getUserLocalStorage();

    //   const url = `${base_url}/${idAccount}/publicaciones/${tipoPublicacion}`;
    const url = `${base_url}/v1/cuentas/${idAccount}/cuestionarios?idUsuario=${idUsuarioConPrefijo}`;

    const result = await axios({
      method: "get",
      url: url,
      headers: { idUsuario: idUsuarioConPrefijo, tokenAut },
      params: params,
    });

    return result.data;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.detail) {
      throw new Error(err.response.data.detail);
    } else {
      throw new Error(err);
    }
  }
};

export const calificarReactivoEnsayo = async ({
  puntosObtenidosEnsayo,
  idAplicacion,
  idCuestionario,
  reactivo,
}) => {
  try {
    const base_url = process.env.REACT_APP_API_URL;
    const { idAccount, tokenAut, idUsuarioConPrefijo } = getUserLocalStorage();

    //   const url = `${base_url}/${idAccount}/publicaciones/${id}/destinatarios`;
    const url = `${base_url}/${idAccount}/cuestionarios/${idCuestionario}/aplicaciones/${idAplicacion}/reactivos/${reactivo.id}`;
    console.log("reactivo", reactivo);
    delete reactivo.categoria
    delete reactivo.dificultad
    const data = {
      duracionRespuesta: reactivo.duracionRespuesta,
      respuestaEnsayo: reactivo.respuesta,
      tipoReactivo: "ENSAYO",
      puntosObtenidosEnsayo: puntosObtenidosEnsayo,
    }

    console.log('data', data)
    const result = await axios({
      method: "put",
      data,
      url: url,
      headers: { idUsuario: idUsuarioConPrefijo, tokenAut },
    });

    return result.data;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.detail) {
      throw new Error(err.response.data.detail);
    } else {
      throw new Error(err);
    }
  }
};

export const getDestinatariosByIdQuiz = async (idCuestionario) => {
  try {
    const base_url = process.env.REACT_APP_API_URL;
    const { idAccount, tokenAut, idUsuarioConPrefijo } = getUserLocalStorage();

    //   const url = `${base_url}/${idAccount}/publicaciones/${id}/destinatarios`;
    const url = `${base_url}/v1/cuentas/${idAccount}/cuestionarios/${idCuestionario}/aplicaciones`;

    const result = await axios({
      method: "get",
      url: url,
      headers: { idUsuario: idUsuarioConPrefijo, tokenAut },
    });

    return result.data;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.detail) {
      throw new Error(err.response.data.detail);
    } else {
      throw new Error(err);
    }
  }
};
