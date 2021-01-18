import { faHighlighter, faPlus, faThumbtack, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from "react";
import styled from 'styled-components';
import { v4 } from 'uuid';
import { useForceUpdate } from '../../../../../common/utils';
import { saveSubject } from '../../../../../services/console/space';
import {
	ConnectedConsoleSpace,
	ConsoleSpaceSubject,
	ConsoleSpaceSubjectChart,
	ConsoleSpaceSubjectChartType
} from '../../../../../services/console/types';
import { LinkButton } from '../../../../component/console/link-button';
import { Chart } from './chart';
import { generateChartRect } from './utils';

const GraphicsContainer = styled.div.attrs({
	'data-widget': 'console-subject-view-graphics'
})`
	display: flex;
	position: absolute;
	flex-direction: column;
	top: 0;
	right: 0;
	width: 100%;
	height: 100%;
	background-color: var(--bg-color);
	transition: width 300ms ease-in-out, opacity 300ms ease-in-out;
	overflow: auto;
	&[data-visible=false] {
		opacity: 0;
		width: 0;
		pointer-events: none;
	}
`;
const Buttons = styled.div.attrs<{ top: number, right: number }>(({ top, right }) => {
	return {
		'data-widget': 'console-subject-view-graphics-buttons',
		style: { top, right }
	};
})<{ top: number, right: number }>`
	display: flex;
	position: fixed;
	margin-top: -1px;
	border-top-left-radius: 15px;
	border-bottom-left-radius: 25px;
	box-shadow: -1px 0 0 0 var(--border-color), 0 1px 0 0 var(--border-color), 0 -1px 0 0 var(--border-color);
	padding: 4px 10px;
	background-color: var(--bg-color);
	z-index: 1;
	> button {
		height: 32px;
		width: 32px;
		&:before {
			border-radius: 100%;
		}
		> svg {
			font-size: 0.9em;
		}
	}
`;
const NoDef = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	position: absolute;
	left: 0;
	height: 100%;
	width: 100%;
	font-family: var(--console-title-font-family);
	font-size: 1.4em;
	> span > span {
		text-decoration: underline;
		cursor: pointer;
	}
`;

export const Graphics = (props: {
	space: ConnectedConsoleSpace;
	subject: ConsoleSpaceSubject;
	visible: boolean
	onVisibleChanged: (visible: boolean) => void;
	switchToDefinition: () => void;
}) => {
	const { space, subject, visible, onVisibleChanged, switchToDefinition } = props;
	const { dataset = {}, graphics: charts = [] } = subject;
	const { columns = [] } = dataset;

	const containerRef = useRef<HTMLDivElement>(null);
	const [ buttonsPosition, setButtonsPosition ] = useState({ top: 0, right: 0 });
	const [ locked, setLocked ] = useState(true);
	const [ saveTimeoutHandle, setSaveTimeoutHandle ] = useState<number | null>(null);
	const forceUpdate = useForceUpdate();
	useEffect(() => {
		const resetButtonsPosition = () => {
			if (!containerRef.current) {
				return;
			}
			const { top, left } = containerRef.current.getBoundingClientRect();
			const { clientWidth, offsetWidth } = containerRef.current;
			const right = window.outerWidth - left - offsetWidth + (offsetWidth - clientWidth);
			if (top !== buttonsPosition.top || right !== buttonsPosition.right) {
				setButtonsPosition({ top, right });
			}
		};
		resetButtonsPosition();

		if (!containerRef.current) {
			return;
		}
		// @ts-ignore
		const resizeObserver = new ResizeObserver(() => {
			if (!containerRef.current) {
				return;
			}

			resetButtonsPosition();
		});
		resizeObserver.observe(containerRef.current);
		return () => resizeObserver.disconnect();
	});

	const doSave = () => {
		if (saveTimeoutHandle) {
			clearTimeout(saveTimeoutHandle);

		}
		setSaveTimeoutHandle(setTimeout(async () => {
			setSaveTimeoutHandle(null);
			await saveSubject(subject);
		}, 10000));
	};

	const onLockClicked = () => setLocked(true);
	const onUnlockClicked = () => setLocked(false);
	const onCreateChartClicked = () => {
		if (!subject.graphics) {
			subject.graphics = [];
		}
		subject.graphics.push({
			name: 'Noname',
			type: ConsoleSpaceSubjectChartType.BAR,
			indicators: [],
			dimensions: [],
			rect: generateChartRect(containerRef.current!)
		});
		if (locked) {
			setLocked(false);
		} else {
			forceUpdate();
		}
		doSave();
	};
	const onDeleteChart = (chart: ConsoleSpaceSubjectChart) => {
		const index = charts.indexOf(chart);
		if (index !== -1) {
			charts.splice(index, 1);
		}
		forceUpdate();
		doSave();
	};
	const onToDefClicked = async () => {
		await saveSubject(subject);
		switchToDefinition();
	};

	const hasColumns = columns.length !== 0;
	const hasCharts = charts.length !== 0;

	return <GraphicsContainer data-visible={visible} ref={containerRef}>
		<Buttons {...buttonsPosition}>
			{hasCharts && !locked
				? <LinkButton tooltip='Lock Charts' right={true} offsetX={-3} offsetY={8}
				              onClick={onLockClicked}>
					<FontAwesomeIcon icon={faThumbtack}/>
				</LinkButton>
				: null}
			{hasCharts && locked
				? <LinkButton tooltip='Settings & Layout' right={true} offsetX={-3} offsetY={8}
				              onClick={onUnlockClicked}>
					<FontAwesomeIcon icon={faHighlighter}/>
				</LinkButton>
				: null}
			{hasColumns
				? <LinkButton tooltip='Add Chart' right={true} offsetX={-3} offsetY={8}
				              onClick={onCreateChartClicked}>
					<FontAwesomeIcon icon={faPlus}/>
				</LinkButton>
				: null}
			<LinkButton tooltip='Minimize' right={true} offsetX={-3} offsetY={8}
			            onClick={() => onVisibleChanged(false)}>
				<FontAwesomeIcon icon={faTimes}/>
			</LinkButton>
		</Buttons>
		{visible
			? (hasColumns
				? (hasCharts
					? charts.map((chart: ConsoleSpaceSubjectChart) => {
						if (!chart.chartId) {
							chart.chartId = v4();
						}
						return <Chart containerRef={containerRef}
						              space={space} subject={subject} chart={chart} locked={locked}
						              onDeleteChart={onDeleteChart}
						              key={chart.chartId}/>;
					})
					: <NoDef>
						<span>No chart defined yet, <span onClick={onCreateChartClicked}>create one</span> now?</span>
					</NoDef>)
				: <NoDef>
					<span>No column defined yet, switch to <span onClick={onToDefClicked}>definition</span>?</span>
				</NoDef>)
			: null}
	</GraphicsContainer>;
};