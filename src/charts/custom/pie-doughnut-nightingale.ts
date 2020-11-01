import { DataSet } from '../../data/types';
import { Theme } from '../../theme/types';
import { BaseColors24 } from '../color-theme';
import { getSeriesDataWhenDimensionsOnXAxis } from './elements/series';
import { getValidDimensionsAndIndicators } from './elements/shortcuts';
import { buildTitle } from './elements/title';
import { ChartOptions, ChartSettings } from './types';

export const buildRichLabel = (colors: Array<string>) => {
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
	}, {} as { [key in string]: any });
};

export const buildOptionsForPieOrDoughnutOrNightingale = (options: {
	rose?: 'radius' | 'area',
	innerRing?: number
}) => (params: {
	data: DataSet,
	theme: Theme,
	settings: ChartSettings
}): ChartOptions => {
	const { rose = false, innerRing = 0 } = options;

	const { data, theme, settings: { title, dimensions, indicators } } = params;

	const [ validDimensions, validIndicators ] = getValidDimensionsAndIndicators(dimensions, indicators);
	const series = validIndicators.map(indicator => {
		return {
			type: 'pie',
			radius: [ `${innerRing}%`, '50%' ],
			center: [ '50%', '50%' ],
			clockwise: true,
			avoidLabelOverlap: true,
			roseType: rose,
			label: {
				show: true,
				position: 'outside',
				alignTo: 'edge',
				formatter: function (params: any) {
					const name = params.name;
					const percent = params.percent + '%';
					const value = params.value;
					const colorIndex = params.dataIndex % BaseColors24.length;
					return [ `{a${colorIndex}|${name}：${value}, ${percent}}`, `{hr${colorIndex}|}` ].join('\n');
				},
				rich: buildRichLabel(BaseColors24)
			},
			labelLine: {
				normal: {
					length: 20,
					length2: 100,
					lineStyle: {
						width: 1
					}
				}
			},
			data: getSeriesDataWhenDimensionsOnXAxis({ data, indicator, dimensions: validDimensions }).map(item => {
				return {
					name: item[0],
					value: item[1],
					tooltip: {
						formatter: function (params: any) {
							return `${params.name}<br>${item[2]}<br>${params.percent}%`;
						}
					}
				};
			}).sort((item1, item2) => item1.value - item2.value)
		};
	});

	return {
		title: buildTitle({ title, theme }),
		color: BaseColors24,
		grid: {
			top: 64,
			bottom: 64,
			containLabel: true
		},
		tooltip: {
			trigger: 'item'
		},
		series
	};
};
