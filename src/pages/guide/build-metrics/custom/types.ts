export enum ChartKey {
	BAR = 'bar'
}

export interface ChartDefinition {
	name: string;
	key: ChartKey;
}

export interface ChartBarDefinition extends ChartDefinition {
	key: ChartKey.BAR
}

export interface ChartSettingsIndicator {
	topicName?: string;
	columnName?: string;
}

export interface ChartSettingsDimension {
	topicName?: string;
	columnName?: string;
}

export interface ChartSettings {
	key?: ChartKey;
	name?: string;
	title?: string;
	indicators: Array<ChartSettingsIndicator>;
	dimensions: Array<ChartSettingsDimension>;
}
