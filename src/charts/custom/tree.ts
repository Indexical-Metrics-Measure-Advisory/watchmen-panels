import { DataSet } from '../../data/types';
import { Theme } from '../../theme/types';
import { BaseColors24 } from '../color-theme';
import { getSeriesDataAsTree } from './elements/series';
import { getValidDimensionsAndIndicators } from './elements/shortcuts';
import { buildTitle } from './elements/title';
import { ChartKey, ChartOptions, ChartSettings, ChartTreeDefinition } from './types';
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
		return {
			type: 'tree',
			left: '6%',
			right: '6%',
			initialTreeDepth: validDimensions.length + 1,
			label: {
				normal: {
					position: 'insideTopRight',
					distance: 10
				}
			},
			data: [ {
				name: 'Root',
				children: getSeriesDataAsTree({ data, indicator, dimensions: validDimensions })
			} ]
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

export const Tree: ChartTreeDefinition = {
	name: 'Tree',
	key: ChartKey.TREE,
	buildOptions,

	settingsValidators: [
		buildDimensionsCountAtLeastValidator(1),
		buildIndicatorsCountAtLeastValidator(1),
		buildIndicatorsCountAtMostValidator(1)
	]
};