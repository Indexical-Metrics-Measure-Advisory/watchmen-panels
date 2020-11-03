import { DataColumnType, DataSet } from '../../../data/types';
import { ChartAxisType, ChartSettingsDimension } from '../types';

export const detectDimensionCategory = (dimension: ChartSettingsDimension): ChartAxisType => {
	switch (dimension.column?.type) {
		case DataColumnType.NUMERIC:
			return ChartAxisType.VALUE;
		case DataColumnType.DATE:
		case DataColumnType.DATETIME:
		case DataColumnType.TIME:
			return ChartAxisType.TIME;
		case DataColumnType.BOOLEAN:
		case DataColumnType.TEXT:
		case DataColumnType.UNKNOWN:
		default:
			return ChartAxisType.CATEGORY;
	}
};
export const isDimensionValid = (dimension: ChartSettingsDimension): boolean => !!dimension.column;
export const asDimensionData = (dimension: ChartSettingsDimension, data: DataSet) => {
	const { topicName, column: { name: propName } = { name: '' } } = dimension;
	const topic = data[topicName!];
	return [ ...new Set((topic.data || []).map(item => item[propName])) ];
};
export const getDimensionValue = (row: any, dimension: ChartSettingsDimension) => {
	const { column: { name: propName } = { name: '' } } = dimension;
	const category = detectDimensionCategory(dimension);
	switch (category) {
		case ChartAxisType.CATEGORY:
			return row[propName] == null ? null : `${row[propName]}`;
		case ChartAxisType.VALUE:
			const value = row[propName];
			if (value == null) {
				return value;
			} else if (typeof value === 'number') {
				return value;
			}
			const parsed = parseFloat(value);
			return isNaN(parsed) ? null : parsed;
		default:
			return row[propName];
	}
};
export const getDimensionLabel = (dimension: ChartSettingsDimension) => {
	return dimension.label || dimension.column?.label || dimension.column?.name;
};
