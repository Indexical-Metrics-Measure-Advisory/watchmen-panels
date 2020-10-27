import React, { Fragment, useState } from 'react';
import { Rnd } from 'react-rnd';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { ChartSettings } from '../../../charts/custom/types';
import Path, { toDomain } from '../../../common/path';
import { BigButton, ButtonType } from '../../component/button';
import { OperationBar, OperationBarPlaceholder } from '../component/operations-bar';
import { useGuideContext } from '../guide-context';
import { ChartContextProvider } from './chart-context';
import { AutonomousCustomChartPanel, CustomChartPanel } from './custom-chart-panel';
import { PredefinedChartPanel } from './predefined-chart-panel';
import { SavedCustomChartContextProvider, useSavedCustomChartContext } from './saved-custom-chart-context';

const MetricsContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	grid-column-gap: var(--margin);
	grid-row-gap: var(--margin);
	margin: var(--margin) var(--margin) 0;
	flex-direction: column;
	@media (min-width: 800px) {
		grid-template-columns: repeat(3, 1fr);
	}
	@media (min-width: 1600px) {
		grid-template-columns: repeat(4, 1fr);
	}
`;

const AsRnd = (props: { rnd: boolean, children: ((props: any) => React.ReactNode) | React.ReactNode }) => {
	const { rnd, children } = props;
	if (rnd) {
		return <Rnd>
			{children}
		</Rnd>;
	} else {
		return <Fragment>{children}</Fragment>;
	}
};

const CustomCharts = () => {
	const customCharts = useSavedCustomChartContext();

	const onSettingsChanged = (replaced: ChartSettings) => (replacement: ChartSettings) => customCharts.replace(replacement, replaced);

	return <Fragment>
		{customCharts.get().map((settings, index) => {
			return <ChartContextProvider key={`${settings.key}-${index}`}>
				<CustomChartPanel settings={settings} onSettingsChanged={onSettingsChanged(settings)}/>
			</ChartContextProvider>;
		})}
	</Fragment>;
};

export default () => {
	const history = useHistory();
	const guide = useGuideContext();

	const [ rnd, setRnd ] = useState(false);

	const onMeasureIndicatorsClicked = () => {
		history.push(toDomain(Path.GUIDE_MEASURE_INDICATOR, guide.getDomain().code));
	};
	const onSaveAsPdfClicked = () => guide.print();
	const onRndClicked = () => {
		// history.push(toDomain(Path.GUIDE_EXPORT_REPORT, guide.getDomain().code));
		setRnd(!rnd);
	};

	const domain = guide.getDomain();
	const charts = domain.charts || [];

	return <Fragment>
		<MetricsContainer>
			<SavedCustomChartContextProvider>
				{charts.map(chart => <AsRnd rnd={rnd} key={chart.name}>
					<ChartContextProvider>
						<PredefinedChartPanel chart={chart}/>
					</ChartContextProvider>
				</AsRnd>)}
				<CustomCharts/>
				<ChartContextProvider>
					<AutonomousCustomChartPanel/>
				</ChartContextProvider>
			</SavedCustomChartContextProvider>
		</MetricsContainer>
		<OperationBar>
			<BigButton onClick={onMeasureIndicatorsClicked}>Adjust Indicators</BigButton>
			<OperationBarPlaceholder/>
			{
				rnd
					? <BigButton inkType={ButtonType.PRIMARY} onClick={onSaveAsPdfClicked}>Save as Pdf</BigButton>
					: null
			}
			<BigButton inkType={ButtonType.PRIMARY} onClick={onRndClicked}>
				{rnd ? 'Quit Export' : 'Export'}
			</BigButton>
		</OperationBar>
	</Fragment>;
}