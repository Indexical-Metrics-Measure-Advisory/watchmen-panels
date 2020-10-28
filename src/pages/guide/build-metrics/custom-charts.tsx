import React, { Fragment } from 'react';
import { ChartSettings } from '../../../charts/custom/types';
import { AsRnd } from './as-rnd';
import { ChartContextProvider } from './chart-context';
import { CustomChartPanel } from './custom-chart-panel';
import { useSavedCustomChartContext } from './saved-custom-chart-context';

export const CustomCharts = (props: { rnd: boolean }) => {
	const { rnd } = props;

	const customCharts = useSavedCustomChartContext();

	const onSettingsChanged = (replaced: ChartSettings) => (replacement: ChartSettings) => customCharts.replace(replacement, replaced);

	return <Fragment>
		{customCharts.get().map((settings, index) => {
			return <AsRnd rnd={rnd} key={`${settings.key}-${index}`}>
				<ChartContextProvider>
					<CustomChartPanel settings={settings} onSettingsChanged={onSettingsChanged(settings)}
					                  rnd={rnd}/>
				</ChartContextProvider>
			</AsRnd>;
		})}
	</Fragment>;
};
