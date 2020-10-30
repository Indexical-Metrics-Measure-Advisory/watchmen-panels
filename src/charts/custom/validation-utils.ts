import { ChartSettings, ChartSettingsDimension, ChartSettingsIndicator, ChartSettingsValidator } from './types';

export const isCountSatisfied = (options: {
	items: Array<any>,
	inspect: (item: any) => boolean;
	validate: (count: number) => Array<string>;
}) => {
	const { items, inspect, validate } = options;

	if (!items) {
		return validate(0);
	}
	const advises = validate(items.length);
	if (advises.length !== 0) {
		return advises;
	}

	return validate(items.filter(inspect).length);
};

export const buildDimensionsCountAtLeastValidator = (min: number): ChartSettingsValidator => (settings: ChartSettings): Array<string> => {
	return isCountSatisfied({
		items: settings.dimensions,
		inspect: (dimension: ChartSettingsDimension) => !!dimension.column,
		validate: (count: number) => count < min ? [ `At least ${min} dimension(s) required.` ] : []
	});
};
export const buildDimensionsCountAtMostValidator = (max: number): ChartSettingsValidator => (settings: ChartSettings): Array<string> => {
	return isCountSatisfied({
		items: settings.dimensions,
		inspect: (dimension: ChartSettingsDimension) => !!dimension.column,
		validate: (count: number) => count > max ? [ `At most ${max} dimension(s) required.` ] : []
	});
};

export const buildIndicatorsCountAtLeastValidator = (min: number): ChartSettingsValidator => (settings: ChartSettings): Array<string> => {
	return isCountSatisfied({
		items: settings.indicators,
		inspect: (indicator: ChartSettingsIndicator) => !!indicator.column,
		validate: (count: number) => count < min ? [ `At least ${min} indicator(s) required.` ] : []
	});
};
export const buildIndicatorsCountAtMostValidator = (max: number): ChartSettingsValidator => (settings: ChartSettings): Array<string> => {
	return isCountSatisfied({
		items: settings.indicators,
		inspect: (indicator: ChartSettingsIndicator) => !!indicator.column,
		validate: (count: number) => count > max ? [ `At most ${max} indicator(s) required.` ] : []
	});
};