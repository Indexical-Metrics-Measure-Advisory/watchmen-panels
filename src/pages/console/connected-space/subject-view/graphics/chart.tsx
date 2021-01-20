import {faCog, faCompressArrowsAlt, faExpandArrowsAlt, faTimes} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React, {Fragment, RefObject, useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import {useForceUpdate} from '../../../../../common/utils';
import {ConsoleSpace, ConsoleSpaceSubject, ConsoleSpaceSubjectChart} from '../../../../../services/console/types';
import Button, {ButtonType} from '../../../../component/button';
import {LinkButton} from '../../../../component/console/link-button';
import {useDialog} from '../../../../context/dialog';
import {ChartDiagram} from '../../../chart/chart-diagram';
import {useSubjectContext} from '../context';
import {ChartSettingsPanel} from './chart-settings-panel';
import {ChartRect} from './types';
import {CHART_MIN_HEIGHT, CHART_MIN_WIDTH, generateChartRect} from './utils';

enum DragType {
	NONE = 'none',
	DND = 'drag-drop',
	RESIZE_TOP = 'resize-top',
	RESIZE_LEFT = 'resize-left',
	RESIZE_RIGHT = 'resize-right',
	RESIZE_BOTTOM = 'resize-bottom',
	RESIZE_TOP_LEFT = 'resize-top-left',
	RESIZE_TOP_RIGHT = 'resize-top-right',
	RESIZE_BOTTOM_LEFT = 'resize-bottom-left',
	RESIZE_BOTTOM_RIGHT = 'resize-bottom-right'
}

interface DragState {
	top: number;
	left: number;
	width: number;
	height: number;
	type: DragType;
	startX: number;
	startY: number;
}

const ChartContainer = styled.div
	.attrs<{ 'data-max': boolean, rect: ChartRect | null }>(
		({'data-max': max, rect}
		) => {
			return {
				'data-widget': 'console-subject-view-chart',
				style: {
					position: max ? 'fixed' : 'absolute',
					top: rect?.top,
					left: rect?.left,
					width: rect?.width,
					height: rect?.height,
					borderRadius: max ? 0 : '',
					zIndex: max ? 2 : ''
				}
			};
		})<{ 'data-max': boolean, rect: ChartRect | null }>`
	display: block;
	border-radius: var(--border-radius);
	border: var(--border);
	background-color: var(--bg-color);
	transition: all 300ms ease-in-out;
	&[data-max=false]:hover {
		box-shadow: var(--console-hover-shadow);
	}
`;
const ChartDragHandle = styled.div`
	display: flex;
	flex-direction: column;
	position: absolute;
	top: -3px;
	left: -3px;
	width: calc(100% + 6px);
	height: calc(100% + 6px);
`;
const ChartDragHandlePart = styled.div`
	display: block;
	position: absolute;
	&[data-locked=true] {
		display: none;
	}
	&[data-position=${DragType.RESIZE_TOP}],
	&[data-position=${DragType.RESIZE_BOTTOM}] {
		left: 6px;
		width: calc(100% - 12px);
		cursor: row-resize;
	}
	&[data-position=${DragType.RESIZE_LEFT}],
	&[data-position=${DragType.RESIZE_RIGHT}] {
		top: 6px;
		height: calc(100% - 12px);
		cursor: col-resize;
	}
	&[data-position^=${DragType.RESIZE_TOP}] {
		top: 0;
		height: 6px;
	}
	&[data-position^=${DragType.RESIZE_BOTTOM}] {
		bottom: 0;
		height: 6px;
	}
	&[data-position$=left] {
		left: 0;
		width: 6px;
	}
	&[data-position$=right] {
		right: 0;
		width: 6px;
	}
	&[data-position=${DragType.RESIZE_TOP_LEFT}] {
		cursor: nw-resize;
	}
	&[data-position=${DragType.RESIZE_TOP_RIGHT}] {
		cursor: ne-resize;
	}
	&[data-position=${DragType.RESIZE_BOTTOM_RIGHT}] {
		cursor: se-resize;
	}
	&[data-position=${DragType.RESIZE_BOTTOM_LEFT}] {
		cursor: sw-resize;
	}
	&[data-part-type=dragging] {
		display: none;
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		//background-color: rgba(0, 0, 0, 0.05);
		z-index: 1000;
		&:not([data-position=${DragType.NONE}]) {
			display: block;
		}
		&[data-position=${DragType.DND}] {
			cursor: move;
		}
	}
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
	margin: 3px 3px 0;
	padding: 0 calc(var(--margin) / 2);
	border-bottom: var(--border);
	cursor: move;
	&[data-locked=true] {
		cursor: default;
	}
	> span:first-child {
		flex-grow: 1;
	}
`;
const HeaderButtons = styled.div.attrs({
	'data-widget': 'console-subject-view-chart-header-buttons'
})`
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
		> svg {
			font-size: 0.8em;
		}
	}
`;
const Body = styled.div.attrs({
	'data-widget': 'console-subject-view-chart-body'
})`
	flex-grow: 1;
	position: relative;
	margin: 0 3px 3px;
`;

const resizeFromTop = (top: number, height: number, clientY: number, startY: number) => {
	let newHeight: number, newTop: number;
	if (clientY <= startY) {
		// more height gained from top
		newHeight = Math.max(height + startY - clientY, CHART_MIN_HEIGHT);
		newTop = Math.max(top + clientY - startY, 0);
	} else if (clientY - startY <= height) {
		// reduce height, but still on top of bottom border
		newHeight = Math.max(height - (clientY - startY), CHART_MIN_HEIGHT);
		newTop = Math.max(top + clientY - startY, 0);
	} else {
		// resize from top side, mouse client Y is under original bottom border
		// which means new height is min value, so just simply move top
		// and top is current mouse client Y
		newHeight = CHART_MIN_HEIGHT;
		newTop = Math.max(top + clientY - startY, 0);
	}
	return {top: newTop, height: newHeight};
};

const resizeFromBottom = (top: number, height: number, clientY: number, startY: number) => {
	let newHeight: number, newTop = top;
	if (startY - clientY <= 0) {
		// more height gained from bottom
		newHeight = Math.max(height + clientY - startY, CHART_MIN_HEIGHT);
	} else if (startY - clientY <= height) {
		// reduce height, but still on bottom of top border
		newHeight = Math.max(height - (startY - clientY), CHART_MIN_HEIGHT);
		if (newHeight === CHART_MIN_HEIGHT) {
			// start to push, not resize anymore
			newTop = Math.max(top - (startY - clientY - (height - CHART_MIN_HEIGHT)), 0);
		}
	} else {
		// resize from bottom side, mouse client Y is above original top border
		// which means new height is min value, so just simply move top
		// and top is current mouse client Y subtract current height change
		newHeight = CHART_MIN_HEIGHT;
		newTop = Math.max(top - (startY - clientY - (height - CHART_MIN_HEIGHT)), 0);
	}
	return {top: newTop, height: newHeight};
};

const resizeFromLeft = (left: number, width: number, clientX: number, startX: number) => {
	let newWidth: number, newLeft: number;
	if (clientX <= startX) {
		// more width gained from left
		newWidth = Math.max(width + startX - clientX, CHART_MIN_WIDTH);
		newLeft = Math.max(left + clientX - startX, 0);
	} else if (clientX - startX <= width) {
		// reduce width, but still on left of right border
		newWidth = Math.max(width - (clientX - startX), CHART_MIN_WIDTH);
		newLeft = Math.max(left + clientX - startX, 0);
	} else {
		// resize from left side, mouse client X is over original right border
		// which means new width is min value, so just simply move left
		// and left is current mouse client X
		newWidth = CHART_MIN_WIDTH;
		newLeft = Math.max(left + clientX - startX, 0);
	}
	return {left: newLeft, width: newWidth};
};

const resizeFromRight = (left: number, width: number, clientX: number, startX: number) => {
	let newWidth: number, newLeft = left;
	if (startX - clientX <= 0) {
		// more width gained from right
		newWidth = Math.max(width + clientX - startX, CHART_MIN_WIDTH);
	} else if (startX - clientX <= width) {
		// reduce width, but still on right of left border
		newWidth = Math.max(width - (startX - clientX), CHART_MIN_WIDTH);
		if (newWidth === CHART_MIN_WIDTH) {
			// start to push, not resize anymore
			newLeft = Math.max(left - (startX - clientX - (width - CHART_MIN_WIDTH)), 0);
		}
	} else {
		// resize from right side, mouse client X is over original left border
		// which means new width is min value, so just simply move left
		// and left is current mouse client X subtract current width change
		newWidth = CHART_MIN_WIDTH;
		newLeft = Math.max(left - (startX - clientX - (width - CHART_MIN_WIDTH)), 0);
	}
	return {left: newLeft, width: newWidth};
};

export const Chart = (props: {
	containerRef: RefObject<HTMLDivElement>;
	space: ConsoleSpace;
	subject: ConsoleSpaceSubject;
	chart: ConsoleSpaceSubjectChart;
	locked: boolean;
	settings?: boolean;
	onDeleteChart: (chart: ConsoleSpaceSubjectChart) => void;
}) => {
	const {
		containerRef,
		space, subject, chart,
		locked, settings = true,
		onDeleteChart
	} = props;

	const dialog = useDialog();
	const {save: saveSubject} = useSubjectContext();
	const chartRef = useRef<HTMLDivElement>(null);
	const headerRef = useRef<HTMLDivElement>(null);
	const headerButtonsRef = useRef<HTMLDivElement>(null);
	const [max, setMax] = useState(false);
	const [settingsVisible, setSettingsVisible] = useState(false);
	const [dragState, setDragState] = useState<DragState>({
		top: 0,
		left: 0,
		width: 0,
		height: 0,
		type: DragType.NONE,
		startX: 0,
		startY: 0
	});
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
			const chartContainer = chartRef.current;
			const {top: currentTop, left: currentLeft} = chartContainer.getBoundingClientRect();
			const {clientWidth: currentWidth, clientHeight: currentHeight} = chartContainer;
			const {top, left, width, height} = maxChart();
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
		const {top, left} = containerRef.current!.getBoundingClientRect();
		const {offsetWidth, offsetHeight} = containerRef.current!;
		return {
			top: top - 1,
			left: left - 1,
			width: offsetWidth + 2,
			height: offsetHeight + 2
		};
	};

	const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
		if (max || locked || !chartRef.current) {
			return;
		}

		// start dnd
		const {clientX, clientY} = event;
		const top = parseFloat(chartRef.current.style.top);
		const left = parseFloat(chartRef.current.style.left);
		const width = parseFloat(chartRef.current.style.width);
		const height = parseFloat(chartRef.current.style.height);
		const target = event.target as HTMLElement;
		const position = target.getAttribute('data-position');
		if (position) {
			// sides and corners
			chartRef.current.style.transition = 'none';
			chartRef.current.style.boxShadow = 'var(--console-primary-hover-shadow)';
			setDragState({top, left, width, height, type: position as DragType, startX: clientX, startY: clientY});
		} else if (headerRef.current?.contains(target) && !headerButtonsRef.current?.contains(target)) {
			// in header, but not in header buttons
			chartRef.current.style.transition = 'none';
			chartRef.current.style.boxShadow = 'var(--console-primary-hover-shadow)';
			setDragState({top, left, width, height, type: DragType.DND, startX: clientX, startY: clientY});
		}
	};
	const releaseDraggingIfCan = () => {
		if (dragState.type !== DragType.NONE) {
			// end dnd
			if (chartRef.current) {
				const chartContainer = chartRef.current;
				chartContainer.style.transition = '';
				chartContainer.style.boxShadow = '';
				const {width, height} = chartContainer.getBoundingClientRect();
				chart.rect = {
					top: parseInt(chartContainer.style.top),
					left: parseInt(chartContainer.style.left),
					width,
					height
				};
			}
			setDragState({top: 0, left: 0, width: 0, height: 0, type: DragType.NONE, startX: 0, startY: 0});
			window.getSelection()?.removeAllRanges();
			saveSubject();
		}
	};
	const onMouseUp = () => releaseDraggingIfCan();
	const onMouseLeave = () => releaseDraggingIfCan();
	const onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
		if (max || locked || !chartRef.current || dragState.type === DragType.NONE) {
			return;
		}

		const {clientX, clientY} = event;
		const chartContainer = chartRef.current;
		const chartStyle = chartContainer.style;
		const {top, left, width, height, type} = dragState;
		const {startX, startY} = dragState;

		switch (type) {
			case DragType.DND: {
				// console.log('top:', top, startY, clientY, top + clientY - startY, 'left:', left, startX, clientX, left + clientX - startX);
				chartStyle.top = `${Math.max(0, top + clientY - startY)}px`;
				chartStyle.left = `${Math.max(0, left + clientX - startX)}px`;
				break;
			}
			case DragType.RESIZE_TOP: {
				const {top: newTop, height: newHeight} = resizeFromTop(top, height, clientY, startY);
				chartStyle.top = `${newTop}px`;
				chartStyle.height = `${newHeight}px`;
				break;
			}
			case DragType.RESIZE_BOTTOM: {
				const {top: newTop, height: newHeight} = resizeFromBottom(top, height, clientY, startY);
				chartStyle.top = `${newTop}px`;
				chartStyle.height = `${newHeight}px`;
				break;
			}
			case DragType.RESIZE_LEFT: {
				const {left: newLeft, width: newWidth} = resizeFromLeft(left, width, clientX, startX);
				chartStyle.left = `${newLeft}px`;
				chartStyle.width = `${newWidth}px`;
				break;
			}
			case DragType.RESIZE_RIGHT: {
				const {left: newLeft, width: newWidth} = resizeFromRight(left, width, clientX, startX);
				chartStyle.left = `${newLeft}px`;
				chartStyle.width = `${newWidth}px`;
				break;
			}
			case DragType.RESIZE_TOP_LEFT: {
				const {top: newTop, height: newHeight} = resizeFromTop(top, height, clientY, startY);
				const {left: newLeft, width: newWidth} = resizeFromLeft(left, width, clientX, startX);
				chartStyle.top = `${newTop}px`;
				chartStyle.left = `${newLeft}px`;
				chartStyle.width = `${newWidth}px`;
				chartStyle.height = `${newHeight}px`;
				break;
			}
			case DragType.RESIZE_TOP_RIGHT: {
				const {top: newTop, height: newHeight} = resizeFromTop(top, height, clientY, startY);
				const {left: newLeft, width: newWidth} = resizeFromRight(left, width, clientX, startX);
				chartStyle.top = `${newTop}px`;
				chartStyle.left = `${newLeft}px`;
				chartStyle.width = `${newWidth}px`;
				chartStyle.height = `${newHeight}px`;
				break;
			}
			case DragType.RESIZE_BOTTOM_LEFT: {
				const {top: newTop, height: newHeight} = resizeFromBottom(top, height, clientY, startY);
				const {left: newLeft, width: newWidth} = resizeFromLeft(left, width, clientX, startX);
				chartStyle.top = `${newTop}px`;
				chartStyle.left = `${newLeft}px`;
				chartStyle.width = `${newWidth}px`;
				chartStyle.height = `${newHeight}px`;
				break;
			}
			case DragType.RESIZE_BOTTOM_RIGHT: {
				const {top: newTop, height: newHeight} = resizeFromBottom(top, height, clientY, startY);
				const {left: newLeft, width: newWidth} = resizeFromRight(left, width, clientX, startX);
				chartStyle.top = `${newTop}px`;
				chartStyle.left = `${newLeft}px`;
				chartStyle.width = `${newWidth}px`;
				chartStyle.height = `${newHeight}px`;
				break;
			}
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
	const onCloseSettings = () => {
		setSettingsVisible(false);
		saveSubject();
	};
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
				<div style={{flexGrow: 1}}/>
				<Button inkType={ButtonType.PRIMARY} onClick={onDeleteConfirmClicked}>Yes</Button>
				<Button inkType={ButtonType.DEFAULT} onClick={dialog.hide}>Cancel</Button>
			</Fragment>
		);
	};

	const rect = max ? maxChart() : chart.rect;

	// console.log(chart)
	return <ChartContainer data-max={max} rect={rect}
	                       ref={chartRef}>
		<ChartDragHandle onMouseDown={onMouseDown} onMouseUp={onMouseUp}
		                 onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
			<Header data-position={DragType.DND} data-locked={locked} ref={headerRef}>
				<span>{chart.name || 'Noname'}</span>
				<HeaderButtons data-visible={!locked} data-expanded={max} ref={headerButtonsRef}>
					<LinkButton ignoreHorizontalPadding={true} tooltip={max ? 'Minimize' : 'Maximize'} center={true}
					            onClick={onToggleMaxClicked}>
						<FontAwesomeIcon icon={max ? faCompressArrowsAlt : faExpandArrowsAlt}/>
					</LinkButton>
					{settings
						? <LinkButton ignoreHorizontalPadding={true} tooltip='Open Settings' center={true}
						              onClick={onOpenSettingsClicked}>
							<FontAwesomeIcon icon={faCog}/>
						</LinkButton>
						: null}
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
			<ChartDragHandlePart data-position={DragType.RESIZE_TOP} data-locked={locked}/>
			<ChartDragHandlePart data-position={DragType.RESIZE_LEFT} data-locked={locked}/>
			<ChartDragHandlePart data-position={DragType.RESIZE_RIGHT} data-locked={locked}/>
			<ChartDragHandlePart data-position={DragType.RESIZE_BOTTOM} data-locked={locked}/>
			<ChartDragHandlePart data-position={DragType.RESIZE_TOP_LEFT} data-locked={locked}/>
			<ChartDragHandlePart data-position={DragType.RESIZE_TOP_RIGHT} data-locked={locked}/>
			<ChartDragHandlePart data-position={DragType.RESIZE_BOTTOM_LEFT} data-locked={locked}/>
			<ChartDragHandlePart data-position={DragType.RESIZE_BOTTOM_RIGHT} data-locked={locked}/>
			<ChartDragHandlePart data-part-type='dragging' data-position={dragState.type} data-locked={locked}/>
		</ChartDragHandle>
	</ChartContainer>;
};