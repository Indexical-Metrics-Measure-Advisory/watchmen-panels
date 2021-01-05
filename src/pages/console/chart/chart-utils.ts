import { ConsoleSpaceSubjectChart, ConsoleSpaceSubjectChartDataSet } from '../../../services/console/types';
import { ChartTypeDefinition, Validator } from './types';

export const buildDescartesByDimensions = (chart: ConsoleSpaceSubjectChart, dataset: ConsoleSpaceSubjectChartDataSet) => {
	const { data } = dataset;
	const { dimensions, indicators } = chart;

	const columnIndexOffset = indicators.length;
	const dimensionIndexes = new Array(dimensions.length).fill(1).map((v, index) => index + columnIndexOffset);
	return data.map(row => {
		return { value: dimensionIndexes.map(index => row[index]).join(','), row };
	});
};

export const validateIndicatorCount: Validator = (chart: ConsoleSpaceSubjectChart, def: ChartTypeDefinition) => {
	const indicatorCount = chart.indicators.length;
	if (!chart.indicators || indicatorCount === 0) {
		return { pass: false, error: 'No indicator defined.' };
	}
	if (def.minIndicatorCount && indicatorCount < def.minIndicatorCount) {
		return { pass: false, error: `At least ${def.minIndicatorCount} indicators, current has ${indicatorCount}.` };
	}
	if (def.maxIndicatorCount && indicatorCount > def.maxIndicatorCount) {
		return { pass: false, error: `At most ${def.maxIndicatorCount} indicators, current has ${indicatorCount}.` };
	}
	return { pass: true };
};

export const validateDimensionCount: Validator = (chart: ConsoleSpaceSubjectChart, def: ChartTypeDefinition) => {
	const dimensionCount = chart.dimensions.length;
	if (!chart.dimensions || dimensionCount === 0) {
		return { pass: false, error: 'No dimensions defined.' };
	}
	if (def.minDimensionCount && dimensionCount < def.minDimensionCount) {
		return { pass: false, error: `At least ${def.minDimensionCount} dimensions, current has ${dimensionCount}.` };
	}
	if (def.maxDimensionCount && dimensionCount > def.maxDimensionCount) {
		return { pass: false, error: `At most ${def.maxDimensionCount} dimensions, current has ${dimensionCount}.` };
	}
	return { pass: true };
};