import { EChartOption, EChartsResponsiveOption } from 'echarts';
import {
	ConsoleSpace,
	ConsoleSpaceSubjectChart,
	ConsoleSpaceSubjectChartDataSet,
	ConsoleSpaceSubjectChartIndicatorAggregator,
	ConsoleSpaceSubjectChartType
} from '../../../services/console/types';
import { BAR } from './chart-bar';

export interface ChartTypeDefinition {
	type: ConsoleSpaceSubjectChartType;
	name: string;
	minDimensionCount?: number;
	minIndicatorCount?: number;
	defend?: (chart: ConsoleSpaceSubjectChart) => void;
	canReduceDimensions?: (chart: ConsoleSpaceSubjectChart) => boolean;
	canAppendDimensions?: (chart: ConsoleSpaceSubjectChart) => boolean;
	canReduceIndicators?: (chart: ConsoleSpaceSubjectChart) => boolean;
	canAppendIndicators?: (chart: ConsoleSpaceSubjectChart) => boolean;
	validate?: (chart: ConsoleSpaceSubjectChart) => boolean | string;
	buildOptions?: (chart: ConsoleSpaceSubjectChart, space: ConsoleSpace, dataset: ConsoleSpaceSubjectChartDataSet) => EChartOption | EChartsResponsiveOption;
}

export const COUNT: ChartTypeDefinition = {
	type: ConsoleSpaceSubjectChartType.COUNT,
	name: 'Count',
	minDimensionCount: 0
};

export const LINE: ChartTypeDefinition = {
	type: ConsoleSpaceSubjectChartType.LINE,
	name: 'Bar'
};
export const SCATTER: ChartTypeDefinition = {
	type: ConsoleSpaceSubjectChartType.SCATTER,
	name: 'Scatter'
};
export const PIE: ChartTypeDefinition = {
	type: ConsoleSpaceSubjectChartType.PIE,
	name: 'Pie'
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

export const ChartTypes: Array<ChartTypeDefinition> = [ COUNT, BAR, PIE, DOUGHNUT, NIGHTINGALE, SCATTER, SUNBURST, TREE, TREEMAP ];
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
	const defend = def.defend;
	if (defend) {
		defend(chart);
		return;
	}

	new Array(Math.max((def.minDimensionCount || 1) - chart.dimensions.length, 0)).fill(1).forEach(() => chart.dimensions.push({}));
	new Array(Math.max((def.minIndicatorCount || 1) - chart.indicators.length, 0)).fill(1).forEach(() => chart.indicators.push({ aggregator: ConsoleSpaceSubjectChartIndicatorAggregator.NONE }));
};

export const isDimensionCanRemove = (chart: ConsoleSpaceSubjectChart) => {
	const def = findChartTypeDefinition(chart.type!);
	const canReduceDimensions = def.canReduceDimensions;
	if (canReduceDimensions) {
		return canReduceDimensions(chart);
	}

	return (chart.dimensions || []).length > (def.minDimensionCount || 1);
};
export const isDimensionCanAppend = (chart: ConsoleSpaceSubjectChart) => {
	const def = findChartTypeDefinition(chart.type!);
	const canAppendDimensions = def.canAppendDimensions;
	if (canAppendDimensions) {
		return canAppendDimensions(chart);
	}

	return true;
};
export const isIndicatorCanRemove = (chart: ConsoleSpaceSubjectChart) => {
	const def = findChartTypeDefinition(chart.type!);
	const canReduceIndicators = def.canReduceIndicators;
	if (canReduceIndicators) {
		return canReduceIndicators(chart);
	}

	return (chart.indicators || []).length > (def.minIndicatorCount || 1);
};
export const isIndicatorCanAppend = (chart: ConsoleSpaceSubjectChart) => {
	const def = findChartTypeDefinition(chart.type!);
	const canAppendIndicators = def.canAppendIndicators;
	if (canAppendIndicators) {
		return canAppendIndicators(chart);
	}

	return true;
};
export const validate = (chart: ConsoleSpaceSubjectChart): { pass: boolean; error?: string } => {
	if (!chart.type) {
		return { pass: false, error: 'No chart type defined.' };
	}

	const def = findChartTypeDefinition(chart.type);
	const validate = def.validate;
	if (validate) {
		const ret = validate(chart);
		if (ret === true) {
			return { pass: true };
		} else {
			return { pass: false, error: typeof ret === 'string' ? ret : (void 0) };
		}
	}

	if (!chart.indicators || chart.indicators.length === 0) {
		return { pass: false, error: 'No indicator defined.' };
	}
	return { pass: true };
};
export const buildEChartsOptions = (chart: ConsoleSpaceSubjectChart, space: ConsoleSpace, dataset: ConsoleSpaceSubjectChartDataSet) => {
	const def = findChartTypeDefinition(chart.type!);
	return def.buildOptions && def.buildOptions(chart, space, dataset);
};
