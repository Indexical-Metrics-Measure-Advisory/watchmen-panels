import { DataSet } from '../../data/types';
import { Theme } from '../../theme/types';
import { BaseColors24 } from '../color-theme';
import { getSeriesDataAsTree } from './elements/series';
import { getValidDimensionsAndIndicators } from './elements/shortcuts';
import { buildTitle } from './elements/title';
import {
	ChartKey,
	ChartOptions,
	ChartSettings,
	ChartSettingsIndicator,
	ChartSunburstDefinition,
	IndicatorAggregator
} from './types';
import {
	buildDimensionsCountAtLeastValidator,
	buildIndicatorsCountAtLeastValidator,
	buildIndicatorsCountAtMostValidator
} from './validation-utils';

export const buildOptions = (params: {
	data: DataSet,
	theme: Theme,
	settings: ChartSettings
}): ChartOptions => {
	const { data, theme, settings: { title, dimensions, indicators } } = params;

	const [ validDimensions, validIndicators ] = getValidDimensionsAndIndicators(dimensions, indicators);
	const series = validIndicators.map(indicator => {
		const aggregator = (indicator as ChartSettingsIndicator).aggregator;
		const aggregated = aggregator && aggregator != IndicatorAggregator.NONE;
		const max = (aggregated ? 90 : 53) - 7;
		return {
			type: 'sunburst',
			radius: [ 0, '90%' ],
			center: [ '50%', '50%' ],
			data: getSeriesDataAsTree({ data, indicator, dimensions: validDimensions }),
			levels: [ {}, ...validDimensions.map((dimension, index) => {
				return {
					r0: `${index * max / validDimensions.length + 7}%`,
					r: `${(index + 1) * max / validDimensions.length + 7}%`
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