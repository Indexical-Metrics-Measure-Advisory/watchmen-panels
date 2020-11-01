import { buildOptionsForPieOrDoughnutOrNightingale } from './pie-doughnut-nightingale';
import { ChartDoughnutDefinition, ChartKey } from './types';
import {
	buildDimensionsCountAtLeastValidator,
	buildIndicatorsCountAtLeastValidator,
	buildIndicatorsCountAtMostValidator
} from './validation-utils';

export const Doughnut: ChartDoughnutDefinition = {
	name: 'Doughnut',
	key: ChartKey.DOUGHNUT,
	buildOptions: buildOptionsForPieOrDoughnutOrNightingale({ innerRing: 25 }),

	settingsValidators: [
		buildDimensionsCountAtLeastValidator(1),
		buildIndicatorsCountAtLeastValidator(1),
		buildIndicatorsCountAtMostValidator(1)
	]
};