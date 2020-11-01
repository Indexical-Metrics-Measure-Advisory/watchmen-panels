import { buildOptionsForPieOrDoughnutOrNightingale } from './pie-doughnut-nightingale';
import { ChartKey, ChartNightingaleDefinition } from './types';
import {
	buildDimensionsCountAtLeastValidator,
	buildIndicatorsCountAtLeastValidator,
	buildIndicatorsCountAtMostValidator
} from './validation-utils';

export const Nightingale: ChartNightingaleDefinition = {
	name: 'Nightingale',
	key: ChartKey.NIGHTINGALE,
	buildOptions: buildOptionsForPieOrDoughnutOrNightingale({ rose: 'area' }),

	settingsValidators: [
		buildDimensionsCountAtLeastValidator(1),
		buildIndicatorsCountAtLeastValidator(1),
		buildIndicatorsCountAtMostValidator(1)
	]
};