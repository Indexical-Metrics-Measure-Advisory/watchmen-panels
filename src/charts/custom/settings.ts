import { ChartMap } from './defs';
import { ChartSettings } from './types';

export const isSettingsValid = (settings: ChartSettings): { valid: boolean, advises: Array<string> } => {
	if (!settings.key) {
		return { valid: true, advises: [] };
	}

	const def = ChartMap[settings.key];
	if (!def) {
		return { valid: false, advises: [ `Chart definition of ${settings.key} is not found, cannot render it.` ] };
	}

	const validators = Array.isArray(def.settingsValidators) ? def.settingsValidators : [ def.settingsValidators ];
	const advises = validators.map(validate => validate(settings)).flat();
	return {
		valid: advises.length === 0,
		advises
	};
};