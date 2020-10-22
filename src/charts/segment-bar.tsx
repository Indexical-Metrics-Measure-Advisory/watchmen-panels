import color from 'color';
import React from 'react';
import { useTheme } from 'styled-components';
import { Theme } from '../theme/types';
import { EChart } from './chart';
import { BaseColors12, BaseColors24, BaseColors6 } from './color-theme';

export interface Segment {
	name: string;
	label: string;
	take: (value: any) => boolean;
}

export interface BarDataItem {
	name: string;
	value: any;
}

const buildOptions = (options: {
	data: Array<BarDataItem>,
	segments: Array<Segment>,
	theme: Theme,
	title?: string
}) => {
	const { data, segments, theme, title } = options;
	const colors = data.length > 18 ? BaseColors24 : (data.length > 6 ? BaseColors12 : BaseColors6);
	const colorCount = colors.length;

	const count = data.length;

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

	const groups = segments.reduce((decorated, segment) => {
		data.forEach((item) => {
			if (!segment.take(item.value)) {
				return;
			}
			if (decorated[segment.name]) {
				decorated[segment.name].value += 1;
			} else {
				decorated[segment.name] = { value: 1, label: segment.label };
			}
		});
		return decorated;
	}, {} as { [key in string]: { value: number, label: string } });
	const decoratedData = Object.keys(groups).map((segment, index) => {
		const colour = color(colors[index % colorCount]);
		return {
			value: [ segment, groups[segment].value, groups[segment].label ],
			itemStyle: {
				normal: {
					color: {
						type: 'linear',
						x: 1, y: 1, x2: 0, y2: 0,
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
	});

	return {
		title: buildTitle(title),
		grid: {
			top: '3%'
		},
		xAxis: {
			type: 'category',
			data: segments.map(segment => segment.name)
		},
		yAxis: {
			type: 'value',
			max: function (value: any) {
				return value.max * 1.2;
			}
		},
		series: [ {
			type: 'bar',
			label: {
				show: true,
				formatter: '{@[2]}',
				color: theme.fontColor
			},
			encode: { x: 0, y: 1 },
			data: decoratedData
		} ]
	};
};

export const SegmentBar = (props: {
	className?: string,
	segments: Array<Segment>,
	data: Array<BarDataItem>,
	title?: string;
}) => {
	const { className, data, segments, title } = props;

	const theme = useTheme() as Theme;
	const options = buildOptions({ data, segments, theme, title });

	return <EChart className={className} options={options}/>;
};