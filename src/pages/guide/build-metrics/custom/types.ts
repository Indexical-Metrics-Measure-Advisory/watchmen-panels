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

export interface ChartSettings {
	key?: ChartKey
}
