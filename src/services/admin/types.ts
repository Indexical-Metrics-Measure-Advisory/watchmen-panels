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

export enum FactorType {
	SEQUENCE = 'sequence',
	NUMBER = 'number',
	TEXT = 'text',
	DATETIME = 'datetime',
	BOOLEAN = 'boolean',
	ENUM = 'enum'
}

export interface QueriedFactorForPipeline {
	factorId: string;
	name: string;
	label: string;
	description?: string;
	type: FactorType;
}

export enum TopicType {
	RAW = 'raw',
	DISTINCT = 'distinct',
	AGGREGATE = 'aggregate',
	TIME = 'time',
	RATIO = 'ratio',
	NOT_DEFINED = 'not-defined'
}

export interface QueriedTopicForPipeline {
	topicId: string;
	code: string;
	name: string;
	type: TopicType;
	factors: Array<QueriedFactorForPipeline>;
}

export interface GroupsHolder {
	groupIds?: Array<string>
}

export interface User extends GroupsHolder {
	userId?: string;
	name?: string;
	nickName?: string;
}

export interface QueriedUserGroupForGroupsHolder {
	userGroupId: string;
	name: string;
	description?: string;
}

export interface UserGroup {
	userGroupId?: string;
	name?: string;
	description?: string;
	userIds?: Array<string>;
	spaceIds?: Array<string>;
}

export interface QueriedUserForUserGroup {
	userId: string;
	name: string;
	nickName?: string;
}

export interface QueriedSpaceForUserGroup {
	spaceId: string;
	name: string;
	description?: string;
}

export interface Space extends GroupsHolder {
	spaceId?: string;
	name?: string;
	description?: string;
	topicIds?: Array<string>;
}

export interface QueriedTopicForSpace {
	topicId: string;
	name: string;
	description?: string;
}