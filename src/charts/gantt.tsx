import color from 'color';
import dayjs from 'dayjs';
import echarts from "echarts/lib/echarts";
import React from 'react';
import { useTheme } from 'styled-components';
import { Theme } from '../theme/types';
import { EChart } from './chart';
import { BaseColors24 } from './color-theme';

export interface GanttDataItem {
	owner: string;
	name: string;
	startDate: string;
	endDate: string;
}

interface RenderItem {
	dataIndex: number;
}

const renderItem = (params: any, api: any) => {
	// value index as below
	// 0: start date
	// 1: end date
	// 2: yAxis (owner)
	const categoryIndex = api.value(2);
	const start = api.coord([ api.value(0), categoryIndex ]);
	const end = api.coord([ api.value(1), categoryIndex ]);
	const height = api.size([ 0, 1 ])[1] * 0.8;

	const rectShape = echarts.graphic.clipRectByRect({
		x: start[0],
		y: start[1] - height / 2,
		width: end[0] - start[0],
		height: height
	}, {
		x: params.coordSys.x,
		y: params.coordSys.y,
		width: params.coordSys.width,
		height: params.coordSys.height
	});

	return {
		type: 'rect',
		shape: rectShape,
		style: api.style()
	};
};

const decorate = (data: Array<GanttDataItem>) => {
	// end date add 1 day, to make sure the bar is continuous
	return data.map(item => {
		return {
			...item,
			endDate: dayjs(item.endDate).add(1, 'day').format('YYYY/MM/DD')
		};
	});
};
const buildOptions = (options: {
	data: Array<GanttDataItem>,
	theme: Theme,
	title?: string
}) => {
	let { data, theme, title } = options;

	data = decorate(data);
	const yAxis = [ ...new Set(data.map(data => data.owner)) ].sort((a, b) => a.localeCompare(b));
	const colors = BaseColors24;
	const colorCount = colors.length;

	const taskCount = data.length;
	const memberCount = new Set(data.map(item => item.owner)).size;
	const minStartDate = data.map(item => item.startDate).sort((d1, d2) => d1.localeCompare(d2))[0];
	const maxEndDate = data.map(item => item.endDate).sort((d1, d2) => d2.localeCompare(d1))[0];

	const buildTitle = (title?: string) => {
		if (!title) {
			return;
		}

		return {
			text: title.replace('{{tasks}}', `${taskCount}`).replace('{{members}}', `${memberCount}`),
			bottom: '5%',
			left: '50%',
			textAlign: 'center',
			textStyle: {
				color: theme.fontColor,
				fontSize: theme.fontSize,
				lineHeight: theme.fontSize,
				fontWeight: theme.fontBold
			}
		};
	};
	return {
		title: buildTitle(title),
		tooltip: {
			trigger: 'item',
			formatter: function (params: any) {
				const startDate = params.value[0];
				const endDate = dayjs(params.value[1]).add(-1, 'day').format('YYYY/MM/DD');
				return `${params.name}<br>${startDate} - ${endDate}`;
			}
		},
		grid: {
			left: '5%',
			bottom: '12%',
			containLabel: true
		},
		xAxis: {
			type: 'time',
			min: minStartDate,
			max: maxEndDate
		},
		yAxis: {
			type: 'category',
			data: yAxis
		},
		series: [
			{
				type: 'custom',
				renderItem,
				encode: { x: [ 0, 1 ], y: [ 2 ] },
				data: data.map((item, itemIndex) => {
					const colour = color(colors[itemIndex % colorCount]);
					return {
						name: item.name,
						value: [ item.startDate, item.endDate, item.owner ],
						itemStyle: {
							normal: {
								color: {
									type: 'linear',
									x: 0, y: 0, x2: 1, y2: 0,
									colorStops: [ {
										offset: 0,
										color: colour.fade(0.75).rgb().toString() // 0% 处的颜色
									},
										{
											offset: 1,
											color: colour.fade(0.15).rgb().toString() // 100% 处的颜色
										}
									]
								}
							}
						}
					};
				})
			}
		]
	};
};

export const Gantt = (props: {
	className?: string,
	data: Array<GanttDataItem>,
	title?: string;
}) => {
	const { className, data, title } = props;

	const theme = useTheme() as Theme;
	const options = buildOptions({ data, theme, title });

	return <EChart className={className} options={options}/>;
};