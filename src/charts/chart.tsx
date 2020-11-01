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
import React, { useEffect, useRef, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { Theme } from '../theme/types';
import { ChartInstanceContextEvent, useChartInstanceContext } from './chart-instance-context';

const ChartContainer = styled.div.attrs({
	'data-widget': 'chart'
})`
	overflow: hidden;
	display: flex;
	flex-direction: column;
`;
const Chart = styled.div`
	flex-grow: 1;
	overflow: hidden;
`;

export const EChart = (props: {
	options: any,
	className?: string
}) => {
	const { className, options } = props;

	const theme = useTheme() as Theme;
	const chartInstance = useChartInstanceContext();
	const rootRef = useRef<HTMLDivElement>(null);
	const [ chart, setChart ] = useState<ECharts | null>(null);

	useEffect(() => {
		if (rootRef.current) {
			// @ts-ignore
			const resizeObserver = new ResizeObserver(() => {
				if (chart) {
					chart.resize();
				}
			});
			resizeObserver.observe(rootRef.current);
			return () => resizeObserver.disconnect();
		}
	});
	useEffect(() => {
		const chart = echarts.init(rootRef.current!);
		options.backgroundColor = options.backgroundColor ?? theme.chartBgColorLight;
		chart.setOption(options, true);
		setChart(chart);
	}, [ options, theme ]);
	useEffect(() => {
		const listener = () => {
			const chart = echarts.init(rootRef.current!);
			chart.setOption(options, true);
			const dataUrl = chart.getDataURL({
				type: 'png',
				pixelRatio: window.devicePixelRatio,
				backgroundColor: 'transparent'
			});
			chartInstance.sendImage(dataUrl);
		};
		chartInstance.on(ChartInstanceContextEvent.DOWNLOAD, listener);
		return () => {
			chartInstance.off(ChartInstanceContextEvent.DOWNLOAD, listener);
		};
	});

	return <ChartContainer>
		<Chart className={className} ref={rootRef}/>
	</ChartContainer>;
};