import { faCog, faCompressArrowsAlt, faExpandArrowsAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ResizeDirection } from 're-resizable';
import React, { Fragment, RefObject, useEffect, useRef, useState } from 'react';
import { DraggableData, DraggableEvent } from 'react-draggable';
import { Rnd } from 'react-rnd';
import styled from 'styled-components';
import { useForceUpdate } from '../../../../../common/utils';
import { ConsoleSpaceSubject, ConsoleSpaceSubjectChart } from '../../../../../services/console/types';
import Button, { ButtonType } from '../../../../component/button';
import { LinkButton } from '../../../../component/console/link-button';
import { useDialog } from '../../../../context/dialog';
import { generateChartRect } from './utils';

interface MaxRect {
	top: number;
	left: number;
	width: number;
	height: number;
}

const ChartContainer = styled.div.attrs<{ max: MaxRect | null }>(({ max }) => {
	return {
		'data-widget': 'console-subject-view-chart',
		style: {
			position: max ? 'fixed' : 'relative',
			top: max?.top,
			left: max?.left,
			width: max ? (max.width + 2) : '',
			height: max ? (max.height + 2) : '',
			borderRadius: max ? 0 : '',
			zIndex: max ? 2 : ''
		}
	};
})<{ max: MaxRect | null }>`
	display: flex;
	flex-direction: column;
	border-radius: var(--border-radius);
	border: var(--border);
	height: 100%;
	background-color: var(--bg-color);
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
`;

export const Chart = (props: {
	containerRef: RefObject<HTMLDivElement>;
	subject: ConsoleSpaceSubject;
	chart: ConsoleSpaceSubjectChart;
	lock: boolean;
	onDeleteChart: (chart: ConsoleSpaceSubjectChart) => void;
}) => {
	const { containerRef, chart, lock, onDeleteChart } = props;
	const { rect } = chart;

	const dialog = useDialog();
	const chartRef = useRef<HTMLDivElement>(null);
	const [ maxRect, setMaxRect ] = useState<MaxRect | null>(null);
	const forceUpdate = useForceUpdate();
	useEffect(() => {
		if (rect) {
			return;
		}
		chart.rect = generateChartRect(containerRef.current!);
		forceUpdate();
	});
	const resetRect = () => {
		if (!rect || !rect.max) {
			return;
		}

		const { top, left } = containerRef.current!.getBoundingClientRect();
		const { offsetWidth, offsetHeight } = containerRef.current!;
		if (!!maxRect && top === maxRect.top + 1 && left === maxRect.left + 1 && offsetWidth === maxRect.width && offsetHeight === maxRect.height) {
			return;
		}
		setMaxRect({
			top: top - 1,
			left: left - 1,
			width: offsetWidth,
			height: offsetHeight
		});
	};
	useEffect(() => {
		// @ts-ignore
		const resizeObserver = new ResizeObserver(() => {
			if (!containerRef.current) {
				return;
			}

			resetRect();
		});
		resizeObserver.observe(containerRef.current);
		return () => resizeObserver.disconnect();
	});

	if (!rect) {
		return null;
	}

	const onDragStop = (e: DraggableEvent, d: DraggableData) => {
		rect.top = d.y;
		rect.left = d.x;
		forceUpdate();
	};
	const onResize = (e: MouseEvent | TouchEvent, direction: ResizeDirection, ref: HTMLElement /*, delta: ResizableDelta, position: Position */) => {
		rect.width = ref.offsetWidth;
		rect.height = ref.offsetHeight;
		forceUpdate();
	};
	const onToggleExpandClicked = () => {
		rect.max = !rect.max;

		if (rect.max) {
			resetRect();
		} else {
			setMaxRect(null);
		}
	};
	const onDeleteConfirmClicked = () => {
		onDeleteChart(chart);
		dialog.hide();
	};
	const onDeleteClicked = () => {
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
	const max = !!maxRect;

	const chartDOM = <ChartContainer max={maxRect} ref={chartRef}>
		<Header>
			<span>{chart.name}</span>
			<HeaderButtons data-visible={!lock} data-expanded={rect.max}>
				<LinkButton ignoreHorizontalPadding={true} onClick={onToggleExpandClicked}>
					<FontAwesomeIcon icon={rect.max ? faCompressArrowsAlt : faExpandArrowsAlt}/>
				</LinkButton>
				<LinkButton ignoreHorizontalPadding={true}>
					<FontAwesomeIcon icon={faCog}/>
				</LinkButton>
				<LinkButton ignoreHorizontalPadding={true} onClick={onDeleteClicked}>
					<FontAwesomeIcon icon={faTimes}/>
				</LinkButton>
			</HeaderButtons>
		</Header>
		<Body>

		</Body>
	</ChartContainer>;

	if (max) {
		return chartDOM;
	} else {
		console.log(rect.top);
		return <Rnd enableResizing={!lock} disableDragging={lock}
		            size={{ width: rect.width, height: rect.height }}
		            position={{ x: rect.left, y: rect.top }}
		            onDragStop={onDragStop}
		            onResize={onResize}>
			{chartDOM}
		</Rnd>;
	}

};