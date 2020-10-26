export enum DataColumnType {
	TEXT = 'text',
	NUMERIC = 'numeric',
	BOOLEAN = 'boolean',
	DATE = 'date',
	TIME = 'time',
	DATETIME = 'datetime',
	OBJECT = 'object',
	ARRAY = 'array',
	UNKNOWN = 'unknown'
}

export interface DataColumn {
	name: string;
	label: string;
	type: DataColumnType;
	native: boolean;
}

export interface ObjectDataColumn extends DataColumn {
	childTypes: Array<DataColumn>;
}

export type DataTopic = {
	columns: Array<DataColumn>,
	data: Array<any>,
	hash: string;
};

export type DataSet = {
	[key in string]: DataTopic
};
