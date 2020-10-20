import color from 'color';
import 'echarts/lib/chart/pie';
import { BaseColors12, BaseColors24, BaseColors6 } from './color-theme';

// // [ {
// // 	'name': '北京',
// // 	'value': 25
// // }, {
// // 	'name': '上海',
// // 	'value': 20
// // }, {
// // 	'name': '广州',
// // 	'value': 18
// // }, {
// // 	'name': '深圳',
// // 	'value': 15
// // }, {
// // 	'name': '未知',
// // 	'value': 13
// // }, {
// // 	'name': '海外',
// // 	'value': 9
// // } ]

export interface NightingaleRoseDataItem {
	name: string;
	value: number;
}

interface PieDataItem extends NightingaleRoseDataItem {
	labelLine: {
		lineStyle: {
			width: number;
			color: string;
		}
	}
}

interface DotStyle {
	backgroundColor: string;
	borderRadius: number;
	width: number;
	height: number;
	padding: Array<number>;
}

interface TextStyle {
	color: string;
	fontSize: number;
	padding: Array<number>;
}

type RichLabel = { [key in string]: DotStyle | TextStyle };

interface RenderItem {
	name: string;
	percent: number;
	dataIndex: number;
}

const buildRichLabel = (colors: Array<string>): RichLabel => {
	return colors.reduce((rich, v, index) => {
		// dot style
		rich[`hr${index}`] = {
			backgroundColor: colors[index],
			borderRadius: 3,
			width: 3,
			height: 3,
			padding: [ 3, 3, 0, -12 ]
		};
		// text style
		rich[`a${index}`] = {
			padding: [ 8, -60, -20, -20 ],
			color: colors[index],
			fontSize: 12
		};
		return rich;
	}, {} as RichLabel);
};
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
const randomLinearTypes = () => linearTypes[Math.floor(Math.random() * 8)];
const buildItemStyle = (colors: Array<string>) => {
	return colors.map(c => {
		const colour = color(c);
		return {
			type: 'linear',
			...randomLinearTypes(),
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

const decorate = (data: Array<NightingaleRoseDataItem>): Array<NightingaleRoseDataItem> => {
	const map: { [key in string]: NightingaleRoseDataItem } = {};

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

const decorateLineStyles = (data: Array<NightingaleRoseDataItem>, colors: Array<string>): Array<PieDataItem> => {
	const colorCount = colors.length;
	return data.map((item, index) => {
		return {
			...item,
			labelLine: {
				lineStyle: {
					width: 1,
					color: colors[index % colorCount]
				}
			}
		};
	});
};

export const useDoughnut = (options: {
	data: Array<NightingaleRoseDataItem>
}) => {
	let { data } = options;
	data = decorate(data);

	const colors = data.length > 18 ? BaseColors24 : (data.length > 6 ? BaseColors12 : BaseColors6);
	const colorCount = colors.length;

	data = decorateLineStyles(data, colors);

	const itemStyles = buildItemStyle(colors);

	return {
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
				formatter: function (params: RenderItem) {
					const name = params.name;
					const percent = params.percent + '%';
					const colorIndex = params.dataIndex % colorCount;
					return [ `{a${colorIndex}|${name}：${percent}}`, `{hr${colorIndex}|}` ].join('\n');
				},
				rich: buildRichLabel(colors)
			},
			itemStyle: {
				normal: {
					color: function (params: RenderItem) {
						return itemStyles[params.dataIndex % colorCount];
					}
				}
			},
			data
		} ]
	};
};