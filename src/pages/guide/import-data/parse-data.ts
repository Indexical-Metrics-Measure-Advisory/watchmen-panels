import { DataColumn, DataColumnType, ObjectDataColumn } from '../../../data/types';

const BOOLEAN_TEXTS = [ 'TRUE', 'T', 'FALSE', 'F', 'YES', 'Y', 'NO', 'N' ];
const NUMBER_PATTERN = /^(-?\d+)(\.\d+)?$/;
const DATE_PATTERN = /^(\d{2}|\d{4})([-/])(\d{1,2})([-/])(\d{1,2})$/;
const TIME_PATTERN = /^(\d{1,2}):(\d{1,2})$/;
const DATETIME_PATTERN = /^(\d{2}|\d{4})([-/])(\d{1,2})([-/])(\d{1,2})(\d{1,2}):(\d{1,2})$/;

const detectType = (value: any): DataColumnType => {
	if (!value) {
		return DataColumnType.UNKNOWN;
	} else if (typeof value === 'number') {
		return DataColumnType.NUMERIC;
	} else if (typeof value === 'boolean') {
		return DataColumnType.BOOLEAN;
	} else if (Array.isArray(value)) {
		return DataColumnType.ARRAY;
	} else if (typeof value === 'string') {
		if (BOOLEAN_TEXTS.includes(value.toUpperCase())) {
			return DataColumnType.BOOLEAN;
		} else if (NUMBER_PATTERN.test(value)) {
			return DataColumnType.NUMERIC;
		} else if (DATE_PATTERN.test(value) && !isNaN(new Date(value).getTime())) {
			return DataColumnType.DATE;
		} else if (TIME_PATTERN.test(value) && !isNaN(new Date(value).getTime())) {
			return DataColumnType.TIME;
		} else if (DATETIME_PATTERN.test(value) && !isNaN(new Date(value).getTime())) {
			return DataColumnType.DATETIME;
		} else {
			return DataColumnType.TEXT;
		}
	} else {
		return DataColumnType.OBJECT;
	}
};
export const parseObject = (data: any, types: Array<DataColumn>): Array<DataColumn> => {
	return parseData([ data ], types);
};
export const parseArray = (data: Array<any>, types: Array<DataColumn>): Array<DataColumn> => {
	return (data || []).reduce((types, row) => {
		return parseObject(row, types);
	}, types);
};
export const parseData = (data: Array<any>, types: Array<DataColumn> = []): Array<DataColumn> => {
	return data.reduce((columns: Array<DataColumn>, row) => {
		const columnsMap = columns
			.filter(column => column.native)
			.reduce((map, column) => {
				map[column.name] = column;
				return map;
			}, {} as { [key in string]: DataColumn });
		Object.keys(row || {}).forEach(key => {
			const column = columnsMap[key] || {
				name: key,
				native: true
			} as DataColumn;
			switch (column.type) {
				case DataColumnType.OBJECT:
				case DataColumnType.ARRAY:
				case DataColumnType.TEXT:
					break;
				default:
					const type = detectType(row[key]);
					column.type = type;
					if (!columns.includes(column)) {
						columns.push(column);
					}
					break;
			}
			switch (column.type) {
				case DataColumnType.OBJECT:
					(column as ObjectDataColumn).childTypes = parseObject(row[key], (column as ObjectDataColumn).childTypes || []);
					break;
				case DataColumnType.ARRAY:
					(column as ObjectDataColumn).childTypes = parseArray(row[key], (column as ObjectDataColumn).childTypes || []);
					break;
				default:
					// do nothing
					break;
			}
		});
		return columns;
	}, types);
};
