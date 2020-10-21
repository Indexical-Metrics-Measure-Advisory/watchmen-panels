import { ECharts } from 'echarts';
import echarts from "echarts/lib/echarts";
import React, { useEffect, useRef, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { Theme } from '../theme/types';

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
		chart.setOption(options);
		setChart(chart);
	}, [ options, theme ]);

	return <ChartContainer>
		<Chart className={className} ref={rootRef}/>
	</ChartContainer>;
};