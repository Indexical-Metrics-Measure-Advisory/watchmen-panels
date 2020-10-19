import { GuideDataColumn, GuideDataColumnType, GuideDataObjectColumn } from '../guide-context';

const BOOLEAN_TEXTS = [ 'TRUE', 'T', 'FALSE', 'F', 'YES', 'Y', 'NO', 'N' ];
const NUMBER_PATTERN = /^(-?\d+)(\.\d+)?$/;
const DATE_PATTERN = /^(\d{2}|\d{4})([-/])(\d{1,2})([-/])(\d{1,2})$/;
const TIME_PATTERN = /^(\d{1,2}):(\d{1,2})$/;
const DATETIME_PATTERN = /^(\d{2}|\d{4})([-/])(\d{1,2})([-/])(\d{1,2})(\d{1,2}):(\d{1,2})$/;

const detectType = (value: any): GuideDataColumnType => {
	if (!value) {
		return GuideDataColumnType.UNKNOWN;
	} else if (typeof value === 'number') {
		return GuideDataColumnType.NUMERIC;
	} else if (typeof value === 'boolean') {
		return GuideDataColumnType.BOOLEAN;
	} else if (Array.isArray(value)) {
		return GuideDataColumnType.ARRAY;
	} else if (typeof value === 'string') {
		if (BOOLEAN_TEXTS.includes(value.toUpperCase())) {
			return GuideDataColumnType.BOOLEAN;
		} else if (NUMBER_PATTERN.test(value)) {
			return GuideDataColumnType.NUMERIC;
		} else if (DATE_PATTERN.test(value) && !isNaN(new Date(value).getTime())) {
			return GuideDataColumnType.DATE;
		} else if (TIME_PATTERN.test(value) && !isNaN(new Date(value).getTime())) {
			return GuideDataColumnType.TIME;
		} else if (DATETIME_PATTERN.test(value) && !isNaN(new Date(value).getTime())) {
			return GuideDataColumnType.DATETIME;
		} else {
			return GuideDataColumnType.TEXT;
		}
	} else {
		return GuideDataColumnType.OBJECT;
	}
};
export const parseObject = (data: any, types: Array<GuideDataColumn>, parentKey: string): Array<GuideDataColumn> => {
	return parseData([ data ], types, parentKey);
};
export const parseArray = (data: Array<any>, types: Array<GuideDataColumn>, parentKey: string): Array<GuideDataColumn> => {
	return (data || []).reduce((types, row) => {
		return parseObject(row, types, parentKey);
	}, types);
};
export const parseData = (data: Array<any>, types: Array<GuideDataColumn> = [], parentKey: string = ''): Array<GuideDataColumn> => {
	return data.reduce((columns: Array<GuideDataColumn>, row) => {
		const columnsMap = columns
			.filter(column => column.native)
			.reduce((map, column) => {
				map[column.name] = column;
				return map;
			}, {} as { [key in string]: GuideDataColumn });
		Object.keys(row || {}).forEach(key => {
			const column = columnsMap[key] || {
				name: parentKey ? `${parentKey}.${key}` : key,
				native: true
			} as GuideDataColumn;
			switch (column.type) {
				case GuideDataColumnType.OBJECT:
				case GuideDataColumnType.ARRAY:
				case GuideDataColumnType.TEXT:
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
				case GuideDataColumnType.OBJECT:
					(column as GuideDataObjectColumn).childTypes = parseObject(row[key], (column as GuideDataObjectColumn).childTypes || [], key);
					break;
				case GuideDataColumnType.ARRAY:
					(column as GuideDataObjectColumn).childTypes = parseArray(row[key], (column as GuideDataObjectColumn).childTypes || [], key);
					break;
				default:
					// do nothing
					break;
			}
		});
		return columns;
	}, types);
};
