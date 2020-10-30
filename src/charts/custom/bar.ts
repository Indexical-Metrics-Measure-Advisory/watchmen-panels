import { buildOptionsForBarOrLine } from './bar-or-line';
import { ChartBarDefinition, ChartKey } from './types';
import { buildDimensionsCountAtLeastValidator, buildIndicatorsCountAtLeastValidator } from './validation-utils';

const buildOptions = buildOptionsForBarOrLine('bar');

export const Bar: ChartBarDefinition = {
	name: 'Bar',
	key: ChartKey.BAR,
	buildOptions,

	settingsValidators: [
		buildDimensionsCountAtLeastValidator(1),
		buildIndicatorsCountAtLeastValidator(1)
	]
};