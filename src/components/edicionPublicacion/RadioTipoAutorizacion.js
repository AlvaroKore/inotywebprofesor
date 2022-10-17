import React from 'react';
import { FormControl, RadioGroup, FormControlLabel, Radio, FormLabel } from '@material-ui/core';

export const RadioTipoAutorizacion = ({ tipoAutorizacion, onChangeTipoAutorizacion }) => {
	return (
		<div>
			<FormControl component="fieldset">
				<h4 >Estado Autorización</h4>
				<RadioGroup
					aria-label="Estado Autorizacion"
					value={tipoAutorizacion}
					row={true}
					name="tipoAutorizacion"
					onChange={onChangeTipoAutorizacion}
				>
					<FormControlLabel value="TODAS" control={<Radio />} label="Todas" />
					<FormControlLabel value="AUTORIZADAS" control={<Radio />} label="Autorizadas" />
					<FormControlLabel value="SIN_AUTORIZAR" control={<Radio />} label="Sin Autorizar" />
				</RadioGroup>
			</FormControl>
		</div>
	);
};
