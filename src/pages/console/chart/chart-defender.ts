import {
	ConsoleSpace,
	ConsoleSpaceSubjectChart,
	ConsoleSpaceSubjectChartDataSet,
	ConsoleSpaceSubjectChartIndicatorAggregator,
	ConsoleSpaceSubjectChartType
} from '../../../services/console/types';
import { BAR } from './chart-bar';
import { COUNT } from './chart-count';
import { LINE } from './chart-line';
import { PIE } from './chart-pie';
import { validateDimensionCount, validateIndicatorCount } from './chart-utils';
import { ChartTypeDefinition, ValidationFailure, ValidationSuccess, Validator } from './types';

export const SCATTER: ChartTypeDefinition = {
	type: ConsoleSpaceSubjectChartType.SCATTER,
	name: 'Scatter'
};

export const DOUGHNUT: ChartTypeDefinition = {
	type: ConsoleSpaceSubjectChartType.DOUGHNUT,
	name: 'Doughnut'
};
export const NIGHTINGALE: ChartTypeDefinition = {
	type: ConsoleSpaceSubjectChartType.NIGHTINGALE,
	name: 'Nightingale'
};
export const SUNBURST: ChartTypeDefinition = {
	type: ConsoleSpaceSubjectChartType.SUNBURST,
	name: 'Sunburst'
};
export const TREE: ChartTypeDefinition = {
	type: ConsoleSpaceSubjectChartType.TREE,
	name: 'Tree'
};
export const TREEMAP: ChartTypeDefinition = {
	type: ConsoleSpaceSubjectChartType.TREEMAP,
	name: 'Treemap'
};

export const ChartTypes: Array<ChartTypeDefinition> = [ COUNT, BAR, LINE, PIE, DOUGHNUT, NIGHTINGALE, SCATTER, SUNBURST, TREE, TREEMAP ];
export const ChartTypeDropdownOptions = ChartTypes.map(({ name, type }) => ({ label: name, value: type }));
export const ChartTypeMap: Map<ConsoleSpaceSubjectChartType, ChartTypeDefinition> = ChartTypes.reduce((map, def) => {
	map.set(def.type, def);
	return map;
}, new Map());
export const findChartTypeDefinition = (type: ConsoleSpaceSubjectChartType) => ChartTypeMap.get(type)!;

export const defendChart = (chart: ConsoleSpaceSubjectChart) => {
	if (!chart.type) {
		chart.type = ConsoleSpaceSubjectChartType.BAR;
	}
	if (!chart.dimensions) {
		chart.dimensions = [];
	}
	if (!chart.indicators) {
		chart.indicators = [];
	}

	const def = findChartTypeDefinition(chart.type);
	new Array(Math.max((def.minDimensionCount || 1) - chart.dimensions.length, 0)).fill(1).forEach(() => chart.dimensions.push({}));
	new Array(Math.max((def.minIndicatorCount || 1) - chart.indicators.length, 0)).fill(1).forEach(() => chart.indicators.push({ aggregator: ConsoleSpaceSubjectChartIndicatorAggregator.NONE }));

	const defend = def.defend;
	if (defend) {
		defend(chart, def);
		return;
	}
};

export const isDimensionCanRemove = (chart: ConsoleSpaceSubjectChart) => {
	const def = findChartTypeDefinition(chart.type!);
	const currentCount = chart.dimensions.length;
	if (currentCount <= (def.minDimensionCount || 1)) {
		return false;
	}

	const canReduceDimensions = def.canReduceDimensions;
	return !canReduceDimensions || canReduceDimensions(chart, def);
};
export const isDimensionCanAppend = (chart: ConsoleSpaceSubjectChart) => {
	const def = findChartTypeDefinition(chart.type!);
	const currentCount = chart.dimensions.length;
	if (def.maxDimensionCount && currentCount >= def.maxDimensionCount) {
		return false;
	}

	const canAppendDimensions = def.canAppendDimensions;
	return !canAppendDimensions || canAppendDimensions(chart, def);
};
export const isIndicatorCanRemove = (chart: ConsoleSpaceSubjectChart) => {
	const def = findChartTypeDefinition(chart.type!);
	const currentCount = chart.indicators.length;
	if (currentCount <= (def.minIndicatorCount || 1)) {
		return false;
	}
	const canReduceIndicators = def.canReduceIndicators;
	return !canReduceIndicators || canReduceIndicators(chart, def);
};
export const isIndicatorCanAppend = (chart: ConsoleSpaceSubjectChart) => {
	const def = findChartTypeDefinition(chart.type!);
	const currentCount = chart.indicators.length;
	if (def.maxIndicatorCount && currentCount >= def.maxIndicatorCount) {
		return false;
	}

	const canAppendIndicators = def.canAppendIndicators;
	return !canAppendIndicators || canAppendIndicators(chart, def);
};
const customValidate: Validator = (chart: ConsoleSpaceSubjectChart, def: ChartTypeDefinition) => {
	const validate = def.validate;
	if (validate) {
		const ret = validate(chart, def);
		if (ret === true) {
			return { pass: true };
		} else {
			return { pass: false, error: typeof ret === 'string' ? ret : '' };
		}
	}
	return { pass: true };
};
export const validate = (chart: ConsoleSpaceSubjectChart): ValidationSuccess | ValidationFailure => {
	if (!chart.type) {
		return { pass: false, error: 'No chart type defined.' };
	}

	const def = findChartTypeDefinition(chart.type);
	return [
		validateDimensionCount,
		validateIndicatorCount,
		customValidate
	].reduce((prev: ValidationSuccess | ValidationFailure, validate) => {
		if (!prev.pass) {
			// previous not passed, return directly
			return prev;
		} else {
			return validate(chart, def);
		}
	}, { pass: true });
};
export const buildEChartsOptions = (chart: ConsoleSpaceSubjectChart, space: ConsoleSpace, dataset: ConsoleSpaceSubjectChartDataSet) => {
	const def = findChartTypeDefinition(chart.type!);
	return def.buildOptions && def.buildOptions(chart, space, dataset);
};
