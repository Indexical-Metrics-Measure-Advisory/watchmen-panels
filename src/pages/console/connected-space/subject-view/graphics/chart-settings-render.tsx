import React, { Fragment } from 'react';
import { ConsoleSpaceSubjectChart } from '../../../../../services/console/types';
import { ChartColors } from './chart-colors';
import { SettingsSegmentTitle } from './components';

export const ChartSettingsRender = (props: {
	chart: ConsoleSpaceSubjectChart;
}) => {
	const { chart } = props;

	return <Fragment>
		<SettingsSegmentTitle><span>Render</span></SettingsSegmentTitle>
		<ChartColors chart={chart}/>
	</Fragment>;
};