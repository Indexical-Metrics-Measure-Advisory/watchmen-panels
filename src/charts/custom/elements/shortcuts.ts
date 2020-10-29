import { ChartSettingsDimension, ChartSettingsIndicator } from '../types';
import { isDimensionValid } from './dimension';
import { isIndicatorValid } from './indicator';

export const getValidDimensionsAndIndicators = (
	dimensions: Array<ChartSettingsDimension>,
	indicators: Array<ChartSettingsIndicator>
) => {
	return [ dimensions.filter(isDimensionValid), indicators.filter(isIndicatorValid) ];
};
