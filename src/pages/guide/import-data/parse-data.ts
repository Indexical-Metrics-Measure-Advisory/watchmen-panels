import { DataColumn, DataColumnType, ObjectDataColumn } from '../../../data/types';
import { detectDataType } from '../../../data/utils';

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
					const type = detectDataType(row[key]);
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
	}, types).map(column => {
		data.forEach(row => {
			const value = row[column.name];
			switch (true) {
				case column.type === DataColumnType.NUMERIC && value != null && typeof value !== 'number':
					const parsed = parseFloat(value);
					row[column.name] = isNaN(parsed) ? null : parsed;
					break;
				case column.type === DataColumnType.BOOLEAN && typeof value !== 'boolean':
					row[column.name] = [ 'TRUE', 'T', 'YES', 'Y' ].includes((`${value}`).toUpperCase());
					break;
			}
		});
		return column;
	});
};
