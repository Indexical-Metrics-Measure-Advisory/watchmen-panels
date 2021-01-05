import { ECharts } from 'echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/custom';
import 'echarts/lib/chart/effectScatter';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/scatter';
import 'echarts/lib/chart/sunburst';
import 'echarts/lib/chart/tree';
import 'echarts/lib/chart/treemap';
import 'echarts/lib/component/axisPointer';
import 'echarts/lib/component/dataZoom';
import 'echarts/lib/component/title';
import 'echarts/lib/component/tooltip';
import echarts from 'echarts/lib/echarts';
import React, { useEffect, useRef, useState } from "react";
import styled from 'styled-components';
import {
	ConsoleSpace,
	ConsoleSpaceSubject,
	ConsoleSpaceSubjectChart,
	ConsoleSpaceSubjectChartType
} from '../../../services/console/types';
import { buildEChartsOptions, validate } from './chart-defender';

const ChartDiagramContainer = styled.div`
	display: flex;
	position: absolute;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
`;
const Error = styled.div`
	font-weight: var(--font-demi-bold);
`;
const Chart = styled.div`
	flex-grow: 1;
	height: 100%;
	overflow: hidden;
`;

export const ChartDiagram = (props: {
	space: ConsoleSpace;
	subject: ConsoleSpaceSubject;
	chart: ConsoleSpaceSubjectChart;
	visible: boolean;
}) => {
	const { space, chart, visible } = props;

	const rootRef = useRef<HTMLDivElement>(null);
	const [ chartInstance, setChartInstance ] = useState<ECharts | null>(null);

	useEffect(() => {
		if (visible && rootRef.current) {
			// @ts-ignore
			const resizeObserver = new ResizeObserver(() => {
				chartInstance && chartInstance.resize();
			});
			resizeObserver.observe(rootRef.current);
			return () => resizeObserver.disconnect();
		}
	});
	useEffect(() => {
		if (visible && chart.type !== ConsoleSpaceSubjectChartType.COUNT && rootRef.current) {
			const chartInstance = echarts.init(rootRef.current!);
			try {
				const options = buildEChartsOptions(chart, space, { data: [] })!;
				// console.log(options);
				chartInstance.setOption(options, true);
				setChartInstance(chartInstance);
			} catch (e) {
				console.error(e);
			}
		}
	}, [ visible, space, chart, chart.type ]);

	if (!visible) {
		return null;
	}

	const validation = validate(chart);

	try {
		return <ChartDiagramContainer>
			{validation.pass
				? <Chart ref={rootRef}/>
				: <Error>{validation.error || 'Unfinished definition.'}</Error>}
		</ChartDiagramContainer>;
	} catch (e) {
		console.error(e);
		return <ChartDiagramContainer>
			<Error>Uncaught error occurred, check your chart settings please.</Error>
		</ChartDiagramContainer>;
	}
};