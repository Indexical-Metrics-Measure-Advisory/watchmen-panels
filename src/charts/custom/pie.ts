import { buildOptionsForPieOrDoughnutOrNightingale } from './pie-doughnut-nightingale';
import { ChartKey, ChartPieDefinition } from './types';
import {
	buildDimensionsCountAtLeastValidator,
	buildIndicatorsCountAtLeastValidator,
	buildIndicatorsCountAtMostValidator
} from './validation-utils';

export const Pie: ChartPieDefinition = {
	name: 'Pie',
	key: ChartKey.PIE,
	buildOptions: buildOptionsForPieOrDoughnutOrNightingale({}),

	settingsValidators: [
		buildDimensionsCountAtLeastValidator(1),
		buildIndicatorsCountAtLeastValidator(1),
		buildIndicatorsCountAtMostValidator(1)
	]
};