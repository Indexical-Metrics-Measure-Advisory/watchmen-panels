import color from 'color';
import React from 'react';
import { useTheme } from 'styled-components';
import { Theme } from '../theme/types';
import { EChart } from './chart';
import { BaseColors12, BaseColors24, BaseColors6 } from './color-theme';
import { buildRichLabel } from './custom/pie-doughnut-nightingale';

export interface DoughnutDataItem {
	name: string;
	value: number;
}

const linearTypes = [
	{ x: 0, y: 0, x2: 1, y2: 1 }, // top-left -> right-bottom
	{ x: 0, y: 0, x2: 0, y2: 1 }, // top -> bottom
	{ x: 0, y: 0, x2: 1, y2: 0 }, // left -> right
	{ x: 1, y: 0, x2: 0, y2: 0 }, // right -> left
	{ x: 0, y: 1, x2: 0, y2: 0 }, // bottom -> top
	{ x: 1, y: 1, x2: 0, y2: 0 }, // right-bottom -> top-left
	{ x: 1, y: 0, x2: 0, y2: 1 }, // top-right -> left-bottom
	{ x: 0, y: 1, x2: 1, y2: 0 }  // left-bottom -> top-right
];
// const randomLinearTypes = () => linearTypes[Math.floor(Math.random() * 8)];
const buildItemStyle = (colors: Array<string>) => {
	return colors.map(c => {
		const colour = color(c);
		return {
			type: 'linear',
			...linearTypes[colors.length % 8],
			colorStops: [ {
				offset: 0,
				color: colour.fade(0.95).rgb().toString() // 0% 处的颜色
			},
				{
					offset: 1,
					color: colour.fade(0.45).rgb().toString() // 100% 处的颜色
				}
			]
			// globalCoord: false // 缺省为 false
		};
	});
};

const decorate = (data: Array<DoughnutDataItem>): Array<DoughnutDataItem> => {
	const map: { [key in string]: DoughnutDataItem } = {};

	data.forEach(item => {
		if (map[item.name]) {
			map[item.name].value += item.value ?? 0;
		} else {
			map[item.name] = { ...item };
		}
	});

	return Object.keys(map)
		.map(key => map[key])
		.sort(({ value: v1 }, { value: v2 }) => v2 - v1);
};

const buildOptions = (options: {
	data: Array<DoughnutDataItem>,
	theme: Theme,
	title?: string
}) => {
	let { data, theme, title } = options;
	data = decorate(data);
	const colors = data.length > 18 ? BaseColors24 : (data.length > 6 ? BaseColors12 : BaseColors6);
	const colorCount = colors.length;

	const count = data.reduce((count, item) => count + item.value, 0);

	const itemStyles = buildItemStyle(colors);
	const buildTitle = (title?: string) => {
		if (!title) {
			return;
		}

		return {
			text: title.replace('{{count}}', `${count}`),
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
		grid: {
			top: '3%'
		},
		series: [ {
			type: 'pie',
			radius: [ '30%', '60%' ],
			center: [ '50%', '50%' ],
			clockwise: true,
			avoidLabelOverlap: true,
			label: {
				show: true,
				position: 'outside',
				alignTo: 'edge',
				formatter: function (params: any) {
					const name = params.name;
					const percent = params.percent + '%';
					const colorIndex = params.dataIndex % colorCount;
					return [ `{a${colorIndex}|${name}：${percent}}`, `{hr${colorIndex}|}` ].join('\n');
				},
				rich: buildRichLabel(colors)
			},
			labelLine: {
				length: 10,
				length2: 100,
				show: true
			},
			itemStyle: {
				normal: {
					color: function (params: any) {
						return itemStyles[params.dataIndex % colorCount];
					}
				}
			},
			data
		} ]
	};
};
export const CountDoughnut = (props: {
	className?: string,
	data: Array<DoughnutDataItem>,
	title?: string;
}) => {
	const { className, data, title } = props;

	const theme = useTheme() as Theme;
	const options = buildOptions({ data, theme, title });

	return <EChart className={className} options={options}/>;
};