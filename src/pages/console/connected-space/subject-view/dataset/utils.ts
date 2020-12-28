import { ConsoleSpaceSubjectDataSetColumn } from '../../../../../services/console/types';
import { FactorColumnDef, FactorMap } from './types';

export const filterColumns = (options: {
	columns: Array<ConsoleSpaceSubjectDataSetColumn>;
	factorMap: FactorMap;
}) => {
	const { columns, factorMap } = options;

	return columns.map((column, columnIndex) => {
		const { factorId } = column;
		if (!factorId) {
			// ignore definition which doesn't include factor
			return null;
		}

		const { topic, factor } = factorMap.get(factorId) || {};
		if (!topic || !factor) {
			// ignore factor which cannot find definition
			return null;
		}

		// initial width is 200 pixels
		return { topic, factor, fixed: false, width: 200, index: columnIndex };
	}).filter(x => x) as Array<FactorColumnDef>;
};