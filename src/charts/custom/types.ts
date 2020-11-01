import { DataColumn, DataSet } from '../../data/types';
import { Theme } from '../../theme/types';

export enum ChartAxisType {
	CATEGORY = 'category',
	TIME = 'time',
	VALUE = 'value'
}

export enum IndicatorAggregator {
	NONE = 'none',
	COUNT = 'count',
	SUMMARY = 'sum',
	AVERAGE = 'avg',
	MEDIAN = 'med',
	MAXIMUM = 'max',
	MINIMUM = 'min'
}

export interface ChartSettingsIndicator {
	topicName?: string;
	column?: DataColumn;
	label?: string;
	required?: boolean;
	aggregator?: IndicatorAggregator
}

export interface ChartSettingsDimension {
	topicName?: string;
	column?: DataColumn;
	label?: string;
	required?: boolean;
}

export interface ChartSettings {
	key?: ChartKey;
	title?: string;
	indicators: Array<ChartSettingsIndicator>;
	dimensions: Array<ChartSettingsDimension>;
}

export enum ChartKey {
	BAR = 'bar',
	LINE = 'line',
	SCATTER = 'scatter',
	PIE = 'pie',
	DOUGHNUT = 'doughnut',
	NIGHTINGALE = 'nightingale',
	SUNBURST = 'sunburst',
	TREE = 'tree',
	TREEMAP = 'treemap'
}

export interface ChartOptions {
}

export type ChartSettingsValidator = (settings: ChartSettings) => Array<string>;

export interface ChartDefinition {
	name: string;
	key: ChartKey;
	buildOptions: (params: {
		data: DataSet,
		theme: Theme,
		settings: ChartSettings
	}) => ChartOptions;
	settingsValidators: ChartSettingsValidator | Array<ChartSettingsValidator>
}

export interface ChartBarDefinition extends ChartDefinition {
	key: ChartKey.BAR
}

export interface ChartLineDefinition extends ChartDefinition {
	key: ChartKey.LINE
}

export interface ChartScatterDefinition extends ChartDefinition {
	key: ChartKey.SCATTER
}

export interface ChartPieDefinition extends ChartDefinition {
	key: ChartKey.PIE
}

export interface ChartDoughnutDefinition extends ChartDefinition {
	key: ChartKey.DOUGHNUT
}

export interface ChartNightingaleDefinition extends ChartDefinition {
	key: ChartKey.NIGHTINGALE
}

export interface ChartSunburstDefinition extends ChartDefinition {
	key: ChartKey.SUNBURST
}

export interface ChartTreeDefinition extends ChartDefinition {
	key: ChartKey.TREE
}

export interface ChartTreeMapDefinition extends ChartDefinition {
	key: ChartKey.TREEMAP
}

export type SeriesDataItem = Array<any>;
export type SeriesData = Array<SeriesDataItem>;
export type AggregatorParameters = {
	items: Array<SeriesDataItem>;
	indicator: ChartSettingsIndicator;
	keyCount: number;
}
export type AggregateResult = {
	value: any;
	label: string;
}
export type Aggregator = (params: AggregatorParameters) => AggregateResult;
