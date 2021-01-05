import { EChartOption, EChartsResponsiveOption } from 'echarts';
import {
	ConsoleSpace,
	ConsoleSpaceSubjectChart,
	ConsoleSpaceSubjectChartDataSet,
	ConsoleSpaceSubjectChartType
} from '../../../services/console/types';

export interface ChartTypeDefinition {
	type: ConsoleSpaceSubjectChartType;
	name: string;
	minDimensionCount?: number;
	maxDimensionCount?: number;
	minIndicatorCount?: number;
	maxIndicatorCount?: number;
	defend?: <D extends ChartTypeDefinition>(chart: ConsoleSpaceSubjectChart, def: D) => void;
	canReduceDimensions?: <D extends ChartTypeDefinition>(chart: ConsoleSpaceSubjectChart, def: D) => boolean;
	canAppendDimensions?: <D extends ChartTypeDefinition>(chart: ConsoleSpaceSubjectChart, def: D) => boolean;
	canReduceIndicators?: <D extends ChartTypeDefinition>(chart: ConsoleSpaceSubjectChart, def: D) => boolean;
	canAppendIndicators?: <D extends ChartTypeDefinition>(chart: ConsoleSpaceSubjectChart, def: D) => boolean;
	validate?: <D extends ChartTypeDefinition>(chart: ConsoleSpaceSubjectChart, def: D) => boolean | string;
	buildOptions?: (chart: ConsoleSpaceSubjectChart, space: ConsoleSpace, dataset: ConsoleSpaceSubjectChartDataSet) => EChartOption | EChartsResponsiveOption;
}

export type Validator = (chart: ConsoleSpaceSubjectChart, def: ChartTypeDefinition) => ValidationSuccess | ValidationFailure;

export interface ValidationFailure {
	pass: false,
	error: string;
}

export interface ValidationSuccess {
	pass: true,
}