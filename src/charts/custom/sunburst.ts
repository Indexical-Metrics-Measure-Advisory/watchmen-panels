import { DataColumnType, DataSet } from '../../data/types';
import { Theme } from '../../theme/types';
import { BaseColors24 } from '../color-theme';
import { getDimensionValue } from './elements/dimension';
import { getIndicatorLabel } from './elements/indicator';
import { getValidDimensionsAndIndicators } from './elements/shortcuts';
import { buildTitle } from './elements/title';
import {
	ChartKey,
	ChartOptions,
	ChartSettings,
	ChartSettingsDimension,
	ChartSettingsIndicator,
	ChartSunburstDefinition,
	SeriesData
} from './types';
import {
	buildDimensionsCountAtLeastValidator,
	buildIndicatorsCountAtLeastValidator,
	buildIndicatorsCountAtMostValidator
} from './validation-utils';

const getSeriesData = (options: {
	data: DataSet,
	indicator: ChartSettingsIndicator,
	dimensions: Array<ChartSettingsDimension>,
}): SeriesData => {
	const { data, indicator, dimensions } = options;

	const parsed = (data[indicator.topicName!].data || []).map(item => {
		const label = getIndicatorLabel(indicator);
		const column = indicator.column!;
		const value = item[column.name!];
		return {
			name: label,
			value,
			groups: dimensions.map(dimension => {
				return `${getDimensionValue(item, dimension)}`;
			})
		};
	});

	let colorIndex = 0;
	const topMap: Map<string, any> = new Map();
	const allMap: Map<string, any> = new Map();
	parsed.forEach(item => {
		const { name, value, groups } = item;
		// build group tree
		const parentKey = groups.reduce((key, group, index, groups) => {
			const parentKey = key;
			if (key) {
				key = `${key},${group}`;
				const exists = allMap.get(key);
				if (!exists) {
					const me = {
						name: group,
						children: [],
						itemStyle: { color: BaseColors24[colorIndex++ % BaseColors24.length] }
					};
					allMap.set(key, me);
					const parent = allMap.get(parentKey);
					parent.children.push(me);
				}
			} else {
				// first level
				key = group;
				const exists = topMap.get(key);
				if (!exists) {
					const me = {
						name: group,
						children: [],
						itemStyle: { color: BaseColors24[colorIndex++ % BaseColors24.length] }
					};
					allMap.set(key, me);
					topMap.set(key, me);
				}
			}
			return key;
		}, '');

		const parent = allMap.get(parentKey);
		if (indicator.column?.type !== DataColumnType.NUMERIC) {
			// not a number, use value as name, and set value to 1
			parent.children.push({
				name: value,
				value: 1,
				itemStyle: { color: BaseColors24[colorIndex++ % BaseColors24.length] }
			});
		} else {
			// numeric value can be aggregate
			parent.children.push({
				name,
				value,
				itemStyle: { color: BaseColors24[colorIndex++ % BaseColors24.length] }
			});
		}
	});
	return Array.from(topMap.values());
};

export const buildOptions = (params: {
	data: DataSet,
	theme: Theme,
	settings: ChartSettings
}): ChartOptions => {
	const { data, theme, settings: { title, dimensions, indicators } } = params;

	const [ validDimensions, validIndicators ] = getValidDimensionsAndIndicators(dimensions, indicators);
	const series = validIndicators.map(indicator => {
		return {
			type: 'sunburst',
			radius: [ 0, '90%' ],
			center: [ '50%', '50%' ],
			data: getSeriesData({ data, indicator, dimensions: validDimensions }),
			levels: [ {}, ...validDimensions.map((dimension, index) => {
				return {
					r0: `${index * 46 / validDimensions.length + 7}%`,
					r: `${(index + 1) * 46 / validDimensions.length + 7}%`
				};
			}), { r0: '53%', r: '55%', label: { position: 'outside' } } ]
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

export const Sunburst: ChartSunburstDefinition = {
	name: 'Sunburst',
	key: ChartKey.SUNBURST,
	buildOptions,

	settingsValidators: [
		buildDimensionsCountAtLeastValidator(1),
		buildIndicatorsCountAtLeastValidator(1),
		buildIndicatorsCountAtMostValidator(1)
	]
};