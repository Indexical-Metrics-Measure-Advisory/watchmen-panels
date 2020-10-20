import { EChartOption, EChartsResponsiveOption } from 'echarts';
// import 'echarts/lib/chart/effectScatter';
// import 'echarts/lib/chart/scatter';
// import 'echarts/lib/component/calendar';
// import 'echarts/lib/component/legend';
// import 'echarts/lib/component/title';
// import 'echarts/lib/component/toolbox';
// import 'echarts/lib/component/tooltip';
import echarts from "echarts/lib/echarts";
import React, { useRef } from 'react';
import styled from 'styled-components';

const ChartContainer = styled.div`
	overflow: hidden;
`;

export const EChart = (props: {
	chartOptions: EChartOption | EChartsResponsiveOption,
	className?: string
}) => {
	const { className, chartOptions } = props;

	const rootRef = useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		const chart = echarts.init(rootRef.current!, 'dark');
		chart.setOption(chartOptions);
	}, [ chartOptions ]);

	return <ChartContainer className={className} ref={rootRef}/>;
};