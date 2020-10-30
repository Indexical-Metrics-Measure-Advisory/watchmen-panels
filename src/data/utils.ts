import { DataColumnType } from './types';

const BOOLEAN_TEXTS = [ 'TRUE', 'T', 'FALSE', 'F', 'YES', 'Y', 'NO', 'N' ];
const NUMBER_PATTERN = /^(-?\d+)(\.\d+)?$/;
const DATE_PATTERN = /^(\d{2}|\d{4})([-/])(\d{1,2})([-/])(\d{1,2})$/;
const TIME_PATTERN = /^(\d{1,2}):(\d{1,2})$/;
const DATETIME_PATTERN = /^(\d{2}|\d{4})([-/])(\d{1,2})([-/])(\d{1,2})([\sT])(\d{1,2}):(\d{1,2})(:(\d{1,2}))?$/;

export const detectDataType = (value: any): DataColumnType => {
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
