import { buildOptionsForBarOrLine } from './bar-or-line';
import { ChartKey, ChartLineDefinition } from './types';

const buildOptions = buildOptionsForBarOrLine('line');

export const Line: ChartLineDefinition = {
	name: 'Line',
	key: ChartKey.LINE,
	buildOptions
};