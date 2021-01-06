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
import React, { RefObject, useEffect, useRef, useState } from "react";
import styled from 'styled-components';
import { BaseColors24 } from '../../../charts/color-theme';
import { fetchChartData, fetchCountChartData } from '../../../services/console/space';
import {
	ConsoleSpace,
	ConsoleSpaceSubject,
	ConsoleSpaceSubjectChart,
	ConsoleSpaceSubjectChartDataSet,
	ConsoleSpaceSubjectChartType
} from '../../../services/console/types';
import { buildEChartsOptions, validate } from './chart-defender';
import { ValidationFailure, ValidationSuccess } from './types';

const ChartDiagramContainer = styled.div`
	display: flex;
	position: absolute;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
`;
const Error = styled.div`
	display: none;
	font-family: var(--console-title-font-family);
	&[data-visible=true] {
		display: block;
	}
`;
const Chart = styled.div`
	flex-grow: 1;
	height: 100%;
	overflow: hidden;
	&[data-visible=false] {
		display: none;
	}
`;
const CountChart = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	font-family: var(--console-title-font-family);
	color: ${BaseColors24[4]};
	width: 100%;
	height: 100%;
	&[data-visible=false] {
		display: none;
	}
`;

const setCountChartFontSize = (countChartRef: RefObject<HTMLDivElement>) => {
	if (countChartRef.current) {
		if (getComputedStyle(countChartRef.current).display !== 'none') {
			const { clientHeight } = countChartRef.current;
			const fontSize = Math.min(512, clientHeight / 2);
			countChartRef.current.style.fontSize = `${fontSize}px`;
		}
	}
};

const CountChartDiagram = (props: {
	rootRef: RefObject<HTMLDivElement>;
	data: ConsoleSpaceSubjectChartDataSet | null;
	visible: boolean;
}) => {
	const { rootRef, data, visible } = props;

	const countChartRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (visible && rootRef.current) {
			// @ts-ignore
			const resizeObserver = new ResizeObserver(() => {
				setCountChartFontSize(countChartRef);
			});
			resizeObserver.observe(rootRef.current);
			setCountChartFontSize(countChartRef);
			return () => resizeObserver.disconnect();
		}
	});

	if (!visible) {
		return null;
	}

	// there is only one value in row-0, column-0
	let value = ((data?.data || [])[0] || [ 0 ])[0];
	if (typeof value === 'number') {
		value = value.toLocaleString();
	}

	return <CountChart ref={countChartRef}>
		{value || 'No data fetched yet.'}
	</CountChart>;
};
export const ChartDiagram = (props: {
	space: ConsoleSpace;
	subject: ConsoleSpaceSubject;
	chart: ConsoleSpaceSubjectChart;
	visible: boolean;
}) => {
	const { space, subject, chart, visible } = props;

	const rootRef = useRef<HTMLDivElement>(null);
	const [ chartInstance, setChartInstance ] = useState<ECharts | null>(null);
	const [ data, setData ] = useState<ConsoleSpaceSubjectChartDataSet | null>(null);
	const [ validation, setValidation ] = useState<ValidationSuccess | ValidationFailure>({
		pass: false,
		error: 'Chart not prepared yet.'
	});

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
		if (visible && rootRef.current) {
			const ret = validate(chart);
			if (!ret.pass) {
				setValidation(ret);
			} else if (chart.type === ConsoleSpaceSubjectChartType.COUNT) {
				// count chart use special logic
				(async () => {
					const data = await fetchCountChartData(subject.subjectId, chart.chartId!);
					setChartInstance(null);
					setData(data);
				})();
			} else {
				(async () => {
					const chartInstance = echarts.init(rootRef.current!);
					try {
						// TODO fetch data remotely
						const data = await fetchChartData(subject.subjectId, chart.chartId!);
						const options = buildEChartsOptions(chart, space, data)!;
						// console.log(options);
						chartInstance.setOption(options, true);
						setChartInstance(chartInstance);
						setData(data);
					} catch (e) {
						console.error(e);
						setValidation({
							pass: false,
							error: 'Unpredicted error occurred, check your chart settings please.'
						});
					}
				})();
			}
		}
	}, [ visible, space, subject.subjectId, chart, chart.type ]);

	if (!visible) {
		return null;
	}

	try {
		return <ChartDiagramContainer>
			<Chart ref={rootRef} data-visible={validation.pass}>
				<CountChartDiagram rootRef={rootRef} data={data}
				                   visible={chart.type === ConsoleSpaceSubjectChartType.COUNT}/>
			</Chart>
			<Error data-visible={!validation.pass}>
				{!validation.pass && (validation.error || 'Unfinished definition.')}
			</Error>
		</ChartDiagramContainer>;
	} catch (e) {
		console.error(e);
		return <ChartDiagramContainer>
			<Error data-visible={true}>Unpredicted error occurred, check your chart settings please.</Error>
		</ChartDiagramContainer>;
	}
};