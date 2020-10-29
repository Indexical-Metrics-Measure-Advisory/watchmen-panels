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
	settings: ChartSettings,
	errorWrapper: (props: { children?: ((props: any) => React.ReactNode) | React.ReactNode }) => JSX.Element
}) => {
	const { className, data, settings, errorWrapper: ErrorWrapper } = props;

	const theme = useTheme() as Theme;
	if (!settings.key) {
		return <Fragment/>;
	}

	// TODO pre-check settings

	try {
		const options = ChartMap[settings.key].buildOptions({ data, theme, settings });
		return <EChart className={className} options={options}/>;
	} catch (e) {
		console.error(e);
		return <ErrorWrapper>
			<div>Uncaught error occurred, check your chart settings please.</div>
		</ErrorWrapper>;
	}
};