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
	aggregator?: IndicatorAggregator
}

export interface ChartSettingsDimension {
	topicName?: string;
	column?: DataColumn;
	label?: string;
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

