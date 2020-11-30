export enum SearchWhat {
	TOPIC = 'topic',
	FACTOR = 'factor',
	DIRECTION = 'direction'
}

export enum Direction {
	TO_SOURCE = 'to the source',
	TO_USAGE = 'to the usage',
	BOTH = 'both sides'
}

export interface SearchPanelState {
	visible: boolean;
	top: number;
	left: number;
}

export interface SearchState<T> {
	searched: boolean;
	searchText: string;
	data: Array<T>;
}
