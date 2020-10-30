import { DataSet } from '../../data/types';
import { Theme } from '../../theme/types';
import { BaseColors24 } from '../color-theme';
import { buildSingleAxis } from './elements/axis';
import { getSeriesDataWhen2DimensionsOnXYAxis } from './elements/series';
import { getValidDimensionsAndIndicators } from './elements/shortcuts';
import { buildTitle } from './elements/title';
import { ChartKey, ChartOptions, ChartScatterDefinition, ChartSettings } from './types';
import {
	buildDimensionsCountAtLeastValidator,
	buildDimensionsCountAtMostValidator,
	buildIndicatorsCountAtLeastValidator
} from './validation-utils';

/**
 * scatter has and only has two dimensions
 */
const buildOptions = (params: {
	data: DataSet,
	theme: Theme,
	settings: ChartSettings
}): ChartOptions => {
	const { data, theme, settings: { title, dimensions, indicators } } = params;

	const [ validDimensions, validIndicators ] = getValidDimensionsAndIndicators(dimensions, indicators);
	const [ xAxis, yAxis ] = validDimensions.map(dimension => {
		return {
			...buildSingleAxis({ data, dimension }),
			axisLabel: {
				// force show all
				interval: 0
			}
		};
	});
	const series = validIndicators.map(indicator => {
		return {
			type: 'scatter',
			encode: {
				x: 0,
				y: 1
			},
			data: getSeriesDataWhen2DimensionsOnXYAxis({ data, indicator, dimensions: validDimensions }).map(item => {
				const [ , label, ...values ] = item.reverse();
				return [ ...values.reverse(), label ];
			})
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
			trigger: 'item',
			axisPointer: {
				type: 'cross'
			},
			formatter: function (params: any) {
				const values: Array<any> = params.value;
				return `${values[0]}, ${values[1]}<br>${values[values.length - 1]}`;
			}
		},
		xAxis,
		yAxis,
		series
	};
};

export const Scatter: ChartScatterDefinition = {
	name: 'Scatter',
	key: ChartKey.SCATTER,
	buildOptions,

	settingsValidators: [
		buildDimensionsCountAtLeastValidator(2),
		buildDimensionsCountAtMostValidator(2),
		buildIndicatorsCountAtLeastValidator(1)
	]
};