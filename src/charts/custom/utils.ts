import { DataColumnType } from '../../data/types';
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
