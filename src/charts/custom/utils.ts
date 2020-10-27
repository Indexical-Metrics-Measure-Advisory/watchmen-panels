import { DataColumnType, DataSet } from '../../data/types';
import { Theme } from '../../theme/types';
import { ChartAxisType, ChartSettingsDimension, ChartSettingsIndicator } from './types';

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

export const detectIndicatorCategory = (indicator: ChartSettingsIndicator): ChartAxisType => {
	switch (indicator.column?.type) {
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

export const buildTitle = (options: { title?: string, theme: Theme }) => {
	const { title, theme } = options;

	if (!title) {
		return;
	}

	return {
		text: title,
		bottom: 32,
		left: '50%',
		textAlign: 'center',
		textStyle: {
			color: theme.fontColor,
			fontSize: theme.fontSize,
			lineHeight: theme.fontSize,
			fontWeight: theme.fontBold
		}
	};
};

export const isDimensionValid = (dimension: ChartSettingsDimension): boolean => !!dimension.column;
export const asDimensionData = (dimension: ChartSettingsDimension, data: DataSet) => {
	const { topicName, column: { name: propName } = { name: '' } } = dimension;
	const topic = data[topicName!];
	return [ ...new Set((topic.data || []).map(item => item[propName])) ];
};
export const getDimensionValue = (row: any, dimension: ChartSettingsDimension) => {
	const { column: { name: propName } = { name: '' } } = dimension;
	return row[propName];
};
export const getDimensionLabel = (dimension: ChartSettingsDimension) => {
	return dimension.label || dimension.column?.label || dimension.column?.name;
};

export const isIndicatorValid = (indicator: ChartSettingsIndicator): boolean => !!indicator.column;
export const asIndicatorData = (indicator: ChartSettingsIndicator, data: DataSet) => {
	const { topicName, column: { name: propName } = { name: '' } } = indicator;
	const topic = data[topicName!];
	return [ ...new Set((topic.data || []).map(item => item[propName])) ];
};
export const getIndicatorLabel = (indicator: ChartSettingsIndicator) => {
	return indicator.label || indicator.column?.label || indicator.column?.name;
};

export const buildSingleXAxis = (options: { data: DataSet, dimension: ChartSettingsDimension }) => {
	const { data, dimension } = options;
	const type = detectDimensionCategory(dimension);
	return {
		type: detectDimensionCategory(dimension),
		name: getDimensionLabel(dimension),
		data: type === ChartAxisType.CATEGORY ? asDimensionData(dimension, data) : undefined
	};
};

/**
 * build x-axis definition. return only one axis anyway. use descartes to combine all dimensions.
 */
export const buildXAxis = (options: { data: DataSet, dimensions: Array<ChartSettingsDimension> }) => {
	const { data, dimensions } = options;
	if (dimensions.length === 1) {
		return buildSingleXAxis({ data, dimension: dimensions[0] });
	}

	const dimensionValues = dimensions.map(d => asDimensionData(d, data));

	return {
		type: ChartAxisType.CATEGORY,
		name: dimensions.map(d => getDimensionLabel(d)).join(', '),
		// descartes
		data: dimensionValues.reduce((radix, values) => {
			if (radix.length === 0) {
				// use me as radix for next loop
				return values.map(v => `${v}`);
			}

			// derive on radix
			return radix.map(r => {
				return values.map(v => `${r}, ${v}`);
			}).flat();
		}, [] as Array<string>)
	};
};

export const getXAxisValue = (options: { data: DataSet, row: any, dimensions: Array<ChartSettingsDimension> }) => {
	//TODO assume all dimension can be found in given row data now
	// in real world, they might be found via relationships and other topics
	const { row, dimensions } = options;
	return dimensions.map(d => getDimensionValue(row, d)).join(', ');
};