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
	SCATTER = 'scatter'
}

export interface ChartOptions {
}

export interface ChartDefinition {
	name: string;
	key: ChartKey;
	buildOptions: (params: {
		data: DataSet,
		theme: Theme,
		settings: ChartSettings
	}) => ChartOptions;
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
