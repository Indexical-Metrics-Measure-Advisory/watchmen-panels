import { ConsoleSpaceSubjectChartType } from '../../../services/console/types';
import { ChartTypeDefinition } from './types';

export const COUNT: ChartTypeDefinition = {
	type: ConsoleSpaceSubjectChartType.COUNT,
	name: 'Count',
	minDimensionCount: 0,
	maxDimensionCount: 0,
	minIndicatorCount: 1,
	maxIndicatorCount: 1
};
