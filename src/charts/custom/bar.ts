import { buildOptionsForBarOrLine } from './bar-or-line';
import { ChartBarDefinition, ChartKey } from './types';

const buildOptions = buildOptionsForBarOrLine('bar');

export const Bar: ChartBarDefinition = {
	name: 'Bar',
	key: ChartKey.BAR,
	buildOptions
};