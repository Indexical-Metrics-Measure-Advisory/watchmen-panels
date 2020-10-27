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

const MetricsContainer = styled.div.attrs({
	'data-widget': 'metrics-container'
})`
	display: grid;
	grid-template-columns: 1fr;
	grid-column-gap: var(--margin);
	grid-row-gap: var(--margin);
	margin: var(--margin) var(--margin) 0;
	&[data-rnd=true] {
		min-height: 26.4cm;
		width: 18cm;
		margin-right: auto;
		border: 1px dashed var(--danger-color);
		border-radius: 2px;
	}
	@media (min-width: 800px) {
		grid-template-columns: repeat(3, 1fr);
	}
	@media (min-width: 1600px) {
		grid-template-columns: repeat(4, 1fr);
	}
`;

const HideDiv = styled.div`
	display: none;
	overflow: hidden;
`;

const AsRnd = (props: {
	rnd: boolean,
	hidden?: boolean,
	children: ((props: any) => React.ReactNode) | React.ReactNode
}) => {
	const { rnd, hidden = false, children } = props;
	if (rnd) {
		if (hidden) {
			return <HideDiv>{children}</HideDiv>;
		} else {
			return <Rnd>{children}</Rnd>;
		}
	} else {
		return <Fragment>{children}</Fragment>;
	}
};

const CustomCharts = (props: { rnd: boolean }) => {
	const { rnd } = props;

	const customCharts = useSavedCustomChartContext();

	const onSettingsChanged = (replaced: ChartSettings) => (replacement: ChartSettings) => customCharts.replace(replacement, replaced);

	return <Fragment>
		{customCharts.get().map((settings, index) => {
			return <AsRnd rnd={rnd}>
				<ChartContextProvider key={`${settings.key}-${index}`}>
					<CustomChartPanel settings={settings} onSettingsChanged={onSettingsChanged(settings)}/>
				</ChartContextProvider>
			</AsRnd>;
		})}
	</Fragment>;
};

const PredefinedCharts = (props: { rnd: boolean }) => {
	const { rnd } = props;

	const guide = useGuideContext();
	const domain = guide.getDomain();
	const charts = domain.charts || [];

	return <Fragment>
		{charts.map(chart => {
			const hidden = !(chart.enabled ? chart.enabled(guide.getData()) : { enabled: true }).enabled;
			return <AsRnd rnd={rnd} hidden={hidden} key={chart.name}>
				<ChartContextProvider>
					<PredefinedChartPanel chart={chart}/>
				</ChartContextProvider>
			</AsRnd>;
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
	const onRndClicked = () => setRnd(!rnd);

	return <Fragment>
		<MetricsContainer data-rnd={rnd}>
			<SavedCustomChartContextProvider>
				<PredefinedCharts rnd={rnd}/>
				<CustomCharts rnd={rnd}/>
				<AsRnd rnd={rnd} hidden={true}>
					<ChartContextProvider>
						<AutonomousCustomChartPanel/>
					</ChartContextProvider>
				</AsRnd>
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