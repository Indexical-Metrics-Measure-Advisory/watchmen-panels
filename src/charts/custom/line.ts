import { buildOptionsForBarOrLine } from './bar-or-line';
import { ChartKey, ChartLineDefinition } from './types';
import { buildDimensionsCountAtLeastValidator, buildIndicatorsCountAtLeastValidator } from './validation-utils';

const buildOptions = buildOptionsForBarOrLine('line');

export const Line: ChartLineDefinition = {
	name: 'Line',
	key: ChartKey.LINE,
	buildOptions,

	settingsValidators: [
		buildDimensionsCountAtLeastValidator(1),
		buildIndicatorsCountAtLeastValidator(1)
	]
};