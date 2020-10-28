import React from 'react';
import { AsRnd } from './as-rnd';
import { ChartContextProvider } from './chart-context';
import { AutonomousCustomChartPanel } from './custom-chart-panel';

export const AutonomousCustomChart = (props: { rnd: boolean }) => {
	const { rnd } = props;

	return <AsRnd rnd={rnd} hidden={true}>
		<ChartContextProvider>
			<AutonomousCustomChartPanel rnd={rnd}/>
		</ChartContextProvider>
	</AsRnd>;
};