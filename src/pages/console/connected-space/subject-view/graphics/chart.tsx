import { faCog, faCompressArrowsAlt, faExpandArrowsAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, RefObject, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useForceUpdate } from '../../../../../common/utils';
import { ConsoleSpace, ConsoleSpaceSubject, ConsoleSpaceSubjectChart } from '../../../../../services/console/types';
import Button, { ButtonType } from '../../../../component/button';
import { LinkButton } from '../../../../component/console/link-button';
import { useDialog } from '../../../../context/dialog';
import { ChartDiagram } from '../../../chart/chart-diagram';
import { ChartSettingsPanel } from './chart-settings-panel';
import { ChartRect } from './types';
import { generateChartRect } from './utils';

const ChartContainer = styled.div
	.attrs<{ 'data-max': boolean, rect: ChartRect | null }>(
		({ 'data-max': max, rect }
		) => {
			return {
				'data-widget': 'console-subject-view-chart',
				style: {
					position: max ? 'fixed' : 'absolute',
					top: rect?.top,
					left: rect?.left,
					width: rect ? (rect.width + 2) : '',
					height: rect ? (rect.height + 2) : '',
					borderRadius: max ? 0 : '',
					zIndex: max ? 2 : ''
				}
			};
		})<{ 'data-max': boolean, rect: ChartRect | null }>`
	display: flex;
	flex-direction: column;
	border-radius: var(--border-radius);
	border: var(--border);
	background-color: var(--bg-color);
	transition: all 300ms ease-in-out;
`;
const Header = styled.div.attrs({
	'data-widget': 'console-subject-view-chart-header'
})`
	display: flex;
	align-items: center;
	font-variant: petite-caps;
	font-size: 0.8em;
	font-weight: var(--font-demi-bold);
	height: 40px;
	padding: 0 calc(var(--margin) / 2);
	border-bottom: var(--border);
	> span:first-child {
		flex-grow: 1;
	}
`;
const HeaderButtons = styled.div`
	display: flex;
	align-items: center;
	margin-right: calc(var(--margin) / -4);
	&[data-visible=false] {
		> button:not(:first-child) {
			display: none;
		}
	}
	&[data-expanded=true] {
		> button:first-child > svg {
			transform: rotateZ(180deg);
		}
	}
	> button {
		height: 32px;
		width: 32px;
		&:first-child > svg {
			transition: transform 300ms ease-in-out;
		}
	}
`;
const Body = styled.div.attrs({
	'data-widget': 'console-subject-view-chart-body'
})`
	flex-grow: 1;
	position: relative;
`;

export const Chart = (props: {
	containerRef: RefObject<HTMLDivElement>;
	space: ConsoleSpace;
	subject: ConsoleSpaceSubject;
	chart: ConsoleSpaceSubjectChart;
	locked: boolean;
	onDeleteChart: (chart: ConsoleSpaceSubjectChart) => void;
}) => {
	const {
		containerRef,
		space, subject, chart,
		locked,
		onDeleteChart
	} = props;

	const dialog = useDialog();
	const chartRef = useRef<HTMLDivElement>(null);
	const [ max, setMax ] = useState(false);
	const [ settingsVisible, setSettingsVisible ] = useState(false);
	const forceUpdate = useForceUpdate();
	useEffect(() => {
		// initialize rect, defensive
		if (chart.rect) {
			return;
		}
		chart.rect = generateChartRect(containerRef.current!);
		forceUpdate();
	});
	useEffect(() => {
		// @ts-ignore
		const resizeObserver = new ResizeObserver(() => {
			if (!containerRef.current || !chartRef.current || !max) {
				return;
			}
			const chart = chartRef.current;
			const { top: currentTop, left: currentLeft } = chart.getBoundingClientRect();
			const { clientWidth: currentWidth, clientHeight: currentHeight } = chart;
			const { top, left, width, height } = maxChart();
			if (top === currentTop && left === currentLeft && width === currentWidth && height === currentHeight) {
				return;
			}
			forceUpdate();
		});
		resizeObserver.observe(containerRef.current);
		return () => resizeObserver.disconnect();
	});

	if (!chart.rect) {
		return null;
	}

	const maxChart = () => {
		const { top, left } = containerRef.current!.getBoundingClientRect();
		const { offsetWidth, offsetHeight } = containerRef.current!;
		return {
			top: top - 1,
			left: left - 1,
			width: offsetWidth,
			height: offsetHeight
		};
	};

	// TODO drag and drop
	const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
		if (max || locked) {
			return;
		}
	};
	const onMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
		if (max || locked) {
			return;
		}
	};
	const onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
		if (max || locked) {
			return;
		}
	};
	const onToggleMaxClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		event.stopPropagation();
		setMax(!max);
	};
	const onOpenSettingsClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		event.stopPropagation();
		setSettingsVisible(true);
	};
	const onCloseSettings = () => setSettingsVisible(false);
	const onDeleteConfirmClicked = () => {
		onDeleteChart(chart);
		dialog.hide();
	};
	const onDeleteClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		event.stopPropagation();
		dialog.show(
			<div data-widget='dialog-console-delete'>
				<span>Are you sure to delete this chart?</span>
			</div>,
			<Fragment>
				<div style={{ flexGrow: 1 }}/>
				<Button inkType={ButtonType.PRIMARY} onClick={onDeleteConfirmClicked}>Yes</Button>
				<Button inkType={ButtonType.DEFAULT} onClick={dialog.hide}>Cancel</Button>
			</Fragment>
		);
	};

	const rect = max ? maxChart() : chart.rect;

	// console.log(chart)
	return <ChartContainer data-max={max} rect={rect}
	                       ref={chartRef}>
		<Header onMouseDown={onMouseDown} onMouseUp={onMouseUp}
		        onMouseMove={onMouseMove}>
			<span>{chart.name || 'Noname'}</span>
			<HeaderButtons data-visible={!locked} data-expanded={max}>
				<LinkButton ignoreHorizontalPadding={true} tooltip={max ? 'Minimize' : 'Maximize'} center={true}
				            onClick={onToggleMaxClicked}>
					<FontAwesomeIcon icon={max ? faCompressArrowsAlt : faExpandArrowsAlt}/>
				</LinkButton>
				<LinkButton ignoreHorizontalPadding={true} tooltip='Open Settings' center={true}
				            onClick={onOpenSettingsClicked}>
					<FontAwesomeIcon icon={faCog}/>
				</LinkButton>
				<LinkButton ignoreHorizontalPadding={true} tooltip='Delete Chart' center={true}
				            onClick={onDeleteClicked}>
					<FontAwesomeIcon icon={faTimes}/>
				</LinkButton>
			</HeaderButtons>
		</Header>
		<Body>
			<ChartDiagram space={space} subject={subject} chart={chart} visible={!settingsVisible}/>
			<ChartSettingsPanel space={space} subject={subject} chart={chart} visible={!locked && settingsVisible}
			                    closeSettings={onCloseSettings}/>
		</Body>
	</ChartContainer>;
};