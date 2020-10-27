import React, { Fragment } from 'react';
import { useTheme } from 'styled-components';
import { DataSet } from '../data/types';
import { Theme } from '../theme/types';
import { EChart } from './chart';
import { ChartMap } from './custom';
import { ChartSettings } from './custom/types';

export const CustomChart = (props: {
	className?: string,
	data: DataSet,
	settings: ChartSettings
}) => {
	const { className, data, settings } = props;

	const theme = useTheme() as Theme;
	if (!settings.key) {
		return <Fragment/>;
	}

	const options = ChartMap[settings.key].buildOptions({ data, theme, settings });
	// console.log(JSON.stringify(options));
	return <EChart className={className} options={options}/>;
};