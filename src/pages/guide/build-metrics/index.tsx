import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { ChartSettings } from '../../../charts/custom/types';
import Path, { toDomain } from '../../../common/path';
import Button, { BigButton, ButtonType } from '../../component/button';
import { OperationBar, OperationBarPlaceholder } from '../component/operations-bar';
import { useGuideContext } from '../guide-context';
import { ChartContextProvider } from './chart-context';
import { AutonomousCustomChartPanel, CustomChartPanel } from './custom-chart-panel';
import { HideChart, HideOnPrintProvider, useHideOnPrintContext } from './hide-on-print-context';
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
			opacity: 0.15;
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
					<CustomChartPanel settings={settings} onSettingsChanged={onSettingsChanged(settings)}
					                  rnd={rnd}/>
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
					<PredefinedChartPanel chart={chart} rnd={rnd}/>
				</ChartContextProvider>
			</AsRnd>;
		})}
	</Fragment>;
};

const TrashButton = styled(Button).attrs({
	'data-widget': 'chart-hide-on-print-btn'
})`
	display: block;
	position: fixed;
	font-size: 32px;
	line-height: 64px;
	width: 64px;
	right: 32px;
	bottom: 32px;
	z-index: 10000;
	padding: 0;
	border: 0;
	border-radius: 100%;
	&[data-ink-type=default] {
	 	color: var(--invert-color);
	 	background-color: var(--primary-hover-color);
	}
	> svg {
		opacity: 0.3;
	}
	> span {
		display: block;
	    position: absolute;
	    font-size: var(--font-size);
	    font-weight: var(--font-boldest);
	    top: calc(var(--font-size) - 2px);
	    right: calc(var(--font-size) - 2px);
	    line-height: 0.8em;
	    opacity: 0.7;
	}
	&:hover {
		border-top-left-radius: 0;
		border-top-right-radius: 0;
		> div {
			border: var(--border);
			border-color: var(--primary-hover-color);
			max-height: 282px;
		}
	}
`;
const HideCharts = styled.div`
	overflow: auto;
	display: flex;
	flex-direction: column;
	max-height: 0;
	width: 200px;
	position: absolute;
	right: 0;
	bottom: 63px;
	border-radius: var(--border-radius);
	border-bottom-right-radius: 0;
	z-index: 1;
	transition: all 300ms ease-in-out;
	> div {
		display: flex;
		align-items: center;
		height: 28px;
		line-height: initial;
		border-top: var(--border);
		border-top-color: var(--primary-hover-color);
		padding: 0 calc(var(--margin) / 2);
		white-space: nowrap;
		overflow-x: hidden;
		text-overflow: ellipsis;
		font-size: 12px;
		color: var(--font-color);
		&:first-child {
			border-top-color: transparent;
		}
		&:hover {
			background-color: var(--primary-hover-color);
			color: var(--invert-color);
			> span:first-child {
				color: var(--primary-hover-color);
				background-color: var(--invert-color);
			}
		}
		> span:first-child {
			display: block;
			margin-right: 6px;
			width: 32px;
			border-radius: 9px;
			background-color: var(--primary-hover-color);
			color: var(--invert-color);
			transition: all 300ms ease-in-out;
			height: 18px;
			line-height: 18px;
		}
		> span:last-child {
			width: calc(100% - 38px);
			text-align: left;
		}
	}
`;

const HideOnPrintButton = (props: { rnd: boolean }) => {
	const { rnd } = props;

	const hideOnPrintContext = useHideOnPrintContext();

	if (!rnd) {
		return null;
	}

	const charts = hideOnPrintContext.get();
	const has = charts.length !== 0;

	const onRecoverClicked = (chart: HideChart) => () => {
		chart.recover();
	};

	return <TrashButton>
		<FontAwesomeIcon icon={faTrashAlt}/>
		<span>{charts.length}</span>
		<HideCharts>
			{
				has
					? charts.map((chart, index) => {
						return <div key={`${chart.title}-${index}`} onClick={onRecoverClicked(chart)}>
							<span>{index + 1}</span>
							<span>{chart.title}</span>
						</div>;
					})
					: <div>
						<span>0</span>
						<span>No chart is hidden.</span>
					</div>
			}
		</HideCharts>
	</TrashButton>;
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
			const container = metricsContainerRef.current!;
			const containerRect = container.getBoundingClientRect();
			const charts = container.querySelectorAll('.react-draggable');
			const { width, height } = Array.from(charts).reduce((size, chart) => {
				const rect = chart.getBoundingClientRect();
				size.width = Math.max(size.width, rect.left + rect.width - containerRect.left);
				size.height = Math.max(size.height, rect.top + rect.height - containerRect.top);
				return size;
			}, { width: 0, height: 0 });
			container.style.width = `${width}px`;
			container.style.height = `${height}px`;
			document.documentElement.setAttribute('data-on-print', 'true');
		};
		const onAfterPrint = () => {
			const container = metricsContainerRef.current!;
			container.style.width = ``;
			container.style.height = ``;
			document.documentElement.removeAttribute('data-on-print');
		};
		window.addEventListener('beforeprint', onBeforePrint);
		window.addEventListener('afterprint', onAfterPrint);

		const charts = metricsContainerRef.current.querySelectorAll('.react-draggable');
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

	return <HideOnPrintProvider>
		<MetricsContainer data-rnd={rnd} ref={metricsContainerRef}>
			<SavedCustomChartContextProvider>
				<PredefinedCharts rnd={rnd}/>
				<CustomCharts rnd={rnd}/>
				<AsRnd rnd={rnd} hidden={true}>
					<ChartContextProvider>
						<AutonomousCustomChartPanel rnd={rnd}/>
					</ChartContextProvider>
				</AsRnd>
			</SavedCustomChartContextProvider>
		</MetricsContainer>
		<OperationBar>
			{rnd ? null : <BigButton onClick={onMeasureIndicatorsClicked}>Adjust Indicators</BigButton>}
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
		<HideOnPrintButton rnd={rnd}/>
	</HideOnPrintProvider>;
}