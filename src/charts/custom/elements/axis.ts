import { DataSet } from '../../../data/types';
import { ChartAxisType, ChartSettingsDimension } from '../types';
import { asDimensionData, detectDimensionCategory, getDimensionLabel, getDimensionValue } from './dimension';

/**
 * build axis definition with given data set and dimension.
 */
export const buildSingleAxis = (options: { data: DataSet, dimension: ChartSettingsDimension }) => {
	const { data, dimension } = options;
	const type = detectDimensionCategory(dimension);
	return {
		type,
		name: getDimensionLabel(dimension),
		data: type === ChartAxisType.CATEGORY ? (asDimensionData(dimension, data) || []).map(x => `${x}`) : undefined
	};
};

/**
 * build axis definition. return only one axis anyway. use descartes to combine all dimensions.
 */
export const buildAxis = (options: { data: DataSet, dimensions: Array<ChartSettingsDimension> }) => {
	const { data, dimensions } = options;
	if (dimensions.length === 1) {
		return buildSingleAxis({ data, dimension: dimensions[0] });
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

/**
 * get axis value, compound values from dimensions
 */
export const getAxisValue = (options: { data: DataSet, row: any, dimensions: Array<ChartSettingsDimension> }) => {
	//TODO assume all dimension can be found in given row data now
	// in real world, they might be found via relationships and other topics
	const { row, dimensions } = options;
	return dimensions.map(d => getDimensionValue(row, d)).join(', ');
};
