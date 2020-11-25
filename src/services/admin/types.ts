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

export interface QueriedReport {
	reportId: string;
	name: string;
	description?: string;
	predefined: boolean;
	topicCount: number;
	groupCount: number;
	spaceCount: number;
}

export interface QueriedSpace {
	spaceId: string;
	name: string;
	description?: string;
	topicCount: number;
	reportCount: number;
	groupCount: number;
	connectionCount: number;
}

export interface QueriedUserGroup {
	userGroupId: string;
	name: string;
	description?: string;
	userCount: number;
	spaceCount: number;
	topicCount: number;
	reportCount: number;
}

export interface QueriedUser {
	userId: string;
	name: string;
	spaceCount: number;
	topicCount: number;
	reportCount: number;
}