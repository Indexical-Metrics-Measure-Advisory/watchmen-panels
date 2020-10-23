import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Path, { toDomain } from '../../../common/path';
import { BigButton, ButtonType } from '../../component/button';
import { OperationBar, OperationBarPlaceholder } from '../component/operations-bar';
import { useGuideContext } from '../guide-context';
import { ChartContextProvider } from './chart-context';
import { CustomChartPanel } from './custom-chart-panel';
import { PredefinedChartPanel } from './predefined-chart-panel';

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

export default () => {
	const history = useHistory();
	const guide = useGuideContext();

	const onMeasureIndicatorsClicked = () => {
		history.push(toDomain(Path.GUIDE_MEASURE_INDICATOR, guide.getDomain().code));
	};
	const onNextClicked = () => {
		history.push(toDomain(Path.GUIDE_EXPORT_REPORT, guide.getDomain().code));
	};

	const domain = guide.getDomain();
	const charts = domain.charts || [];

	return <Fragment>
		<MetricsContainer>
			{charts.map(chart => <ChartContextProvider key={chart.name}>
				<PredefinedChartPanel chart={chart}/>
			</ChartContextProvider>)}
			<ChartContextProvider>
				<CustomChartPanel/>
			</ChartContextProvider>
		</MetricsContainer>
		<OperationBar>
			<BigButton onClick={onMeasureIndicatorsClicked}>Adjust Indicators</BigButton>
			<OperationBarPlaceholder/>
			<BigButton inkType={ButtonType.PRIMARY} onClick={onNextClicked}>Next</BigButton>
		</OperationBar>
	</Fragment>;
}