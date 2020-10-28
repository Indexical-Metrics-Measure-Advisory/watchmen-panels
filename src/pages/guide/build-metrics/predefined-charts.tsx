import React, { Fragment } from 'react';
import { useGuideContext } from '../guide-context';
import { AsRnd } from './as-rnd';
import { ChartContextProvider } from './chart-context';
import { PredefinedChartPanel } from './predefined-chart-panel';

export const PredefinedCharts = (props: { rnd: boolean }) => {
	const { rnd } = props;

	const guide = useGuideContext();
	const domain = guide.getDomain();
	const charts = domain.charts || [];

	return <Fragment>
		{charts.map(chart => {
			const hidden = !(chart.enabled ? chart.enabled(guide.getData()) : { enabled: true }).enabled;
			return <AsRnd rnd={rnd} hidden={hidden} key={chart.name}>
				<ChartContextProvider>
					<PredefinedChartPanel chart={chart} rnd={rnd}/>
				</ChartContextProvider>
			</AsRnd>;
		})}
	</Fragment>;
};
