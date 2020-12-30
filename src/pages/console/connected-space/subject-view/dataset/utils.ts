import { ConsoleSpaceSubjectDataSetColumn, ConsoleTopic } from '../../../../../services/console/types';
import { DEFAULT_COLUMN_WIDTH } from './dataset-table-components';
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
		return { topic, factor, fixed: false, width: DEFAULT_COLUMN_WIDTH, index: columnIndex };
	}).filter(x => x) as Array<FactorColumnDef>;
};

export const buildFactorMap = (topics: Array<ConsoleTopic>): FactorMap => {
	return topics.reduce((map, topic) => {
		topic.factors.forEach(factor => {
			map.set(factor.factorId, { topic, factor });
		});
		return map;
	}, new Map());
};
