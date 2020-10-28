import React, { Fragment, useEffect, useRef, useState } from 'react';
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
	position: relative;;
	grid-template-columns: 1fr;
	grid-column-gap: var(--margin);
	grid-row-gap: var(--margin);
	margin: var(--margin) var(--margin) 0;
	&[data-rnd=true] {
		height: calc(42.0cm - 3.3cm);
		width: calc(29.7cm - 3cm);
		margin-right: auto;
		&:before,
		&:after {
			display: flex;
			align-items: center;
			justify-content: center;
			position: absolute;
			top: 0;
			left: 0;
			font-size: 1.5em;
			font-weight: var(--font-bold);
			opacity: 0.2;
			border-radius: 2px;
		}
		&:before {
			content: 'A4';
			height: calc(29.7cm - 3.3cm);
			width: calc(21cm - 3cm);
			color: var(--success-color);
			border: 2px dashed var(--success-color);
			z-index: -1;
		}
		&:after {
			content: 'A3';
			height: calc(42.0cm - 6cm);
			width: calc(29.7cm - 4.6cm);
			color: var(--danger-color);
			z-index: -2;
			border: 2px dashed var(--danger-color);
		}
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
	const metricsContainerRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!rnd || metricsContainerRef.current == null) {
			return;
		}

		const onBeforePrint = () => {
			document.documentElement.setAttribute('data-on-print', 'true');
		};
		const onAfterPrint = () => {
			document.documentElement.removeAttribute('data-on-print');
		};
		window.addEventListener('beforeprint', onBeforePrint);
		window.addEventListener('afterprint', onAfterPrint);

		const charts = document.querySelectorAll('.react-draggable');
		let top = 0;
		let left = 0;
		Array.from(charts).forEach(chart => {
			const div = chart as HTMLDivElement;
			div.style.width = '8.5cm';
			div.style.height = '6cm';
			div.style.top = `${top}cm`;
			div.style.left = `${left}cm`;
			if (left === 0) {
				left = 9.6;
			} else {
				left = 0;
				top += 6 + 1;
			}
		});

		return () => {
			window.removeEventListener('beforeprint', onBeforePrint);
			window.removeEventListener('afterprint', onAfterPrint);
		};
	}, [ rnd ]);

	const onMeasureIndicatorsClicked = () => {
		history.push(toDomain(Path.GUIDE_MEASURE_INDICATOR, guide.getDomain().code));
	};
	const onSaveAsPdfClicked = () => window.print();
	const onRndClicked = () => setRnd(!rnd);

	return <Fragment>
		<MetricsContainer data-rnd={rnd} ref={metricsContainerRef}>
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