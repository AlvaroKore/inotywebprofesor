import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";
import { useQuery } from "@apollo/react-hooks";
import { GRUPO_BY_MODALIDAD_AND_GRADO } from "../constants/graphql_queries/grupos_by_modalidad_and_grado";
import { useDispatch } from "react-redux";
import { setGrupos } from "../store/actions/publicacionActions";
import { MenuItem, Select } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export const SelectGruposByModalidadAndGrado = ({
  idModalidad,
  idGrado,
  idGrupo,
  onChangeGrupo,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { loading, error, data } = useQuery(GRUPO_BY_MODALIDAD_AND_GRADO, {
    variables: { idModalidadCarrera: idModalidad, idGrado: idGrado },
  });

  React.useEffect(() => {
    if (!data?.gruposByIdModalidadCarreraAndIdGrado) return;
    onChangeGrupo({
      value: idGrupo,
      list: data.gruposByIdModalidadCarreraAndIdGrado.map((el) => el.idGrupo),
      defaultValue: "todos",
    });
  }, [idGrupo, data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <InputLabel>Grupo</InputLabel>
      <Select
        fullWidth
        variant="outlined"
        value={idGrupo}
        onChange={(e) => {
          onChangeGrupo({
            value: e.target.value,
            list: data.gruposByIdModalidadCarreraAndIdGrado.map(
              (el) => el.idGrupo
            ),
            defaultValue: "todos",
          });
        }}
        inputProps={{
          name: "idGrupo",
          id: "grupo-native-label-placeholder",
        }}
      >
        <MenuItem value={""}>Todos</MenuItem>

        {data.gruposByIdModalidadCarreraAndIdGrado.map(({ idGrupo }) => (
          <MenuItem key={idGrupo} value={idGrupo}>
            {idGrupo}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText />
    </div>
  );
};
