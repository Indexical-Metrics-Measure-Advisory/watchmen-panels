export interface DataPage<T> {
	data: Array<T>;
	itemCount: number;
	pageNumber: number;
	pageSize: number;
	pageCount: number;
}

export interface QueriedTopic {
	topicId: string;
	code: string;
	name: string;
	description?: string;
	raw: boolean;
	factorCount: number;
	reportCount: number;
	groupCount: number;
	spaceCount: number;
}