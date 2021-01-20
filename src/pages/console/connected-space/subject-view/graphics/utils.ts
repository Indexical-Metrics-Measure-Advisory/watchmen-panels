import {
	ColumnExpressionOperator,
	ConsoleSpace,
	ConsoleSpaceSubjectDataSetColumn,
	ConsoleTopic,
	ConsoleTopicFactor
} from '../../../../../services/console/types';
import {DropdownOption} from '../../../../component/dropdown';

export const CHART_MARGIN = 32;
export const CHART_COLUMN_GAP = 32;
export const INIT_TOP = CHART_MARGIN;
export const INIT_LEFT = CHART_MARGIN;
export const INIT_MIN_WIDTH = 400;
export const CHART_HEADER_HEIGHT = 40;
export const CHART_ASPECT_RATIO = 9 / 16;
export const CHART_MIN_HEIGHT = 200 + CHART_HEADER_HEIGHT;
export const CHART_MIN_WIDTH = CHART_MIN_HEIGHT / CHART_ASPECT_RATIO + CHART_HEADER_HEIGHT;

export const generateChartRect = (container: HTMLDivElement) => {
	const {clientWidth} = container;
	const width = Math.max(INIT_MIN_WIDTH, (clientWidth - CHART_MARGIN * 2 - CHART_COLUMN_GAP * 2) / 3);
	const height = width * CHART_ASPECT_RATIO + CHART_HEADER_HEIGHT;
	return {top: INIT_TOP, left: INIT_LEFT, width, height, max: false};
};

export const transformColumnToDropdownValue = (column: ConsoleSpaceSubjectDataSetColumn) => {
	return `${column.topicId || ''}-${column.factorId || ''}-${column.operator || ''}-${column.secondaryTopicId || ''}-${column.secondaryFactorId || ''}`;
};

export const transformColumnsToDropdownOptions = (space: ConsoleSpace, columns: Array<ConsoleSpaceSubjectDataSetColumn>) => {
	return columns.map(column => {
		// eslint-disable-next-line
		const topic = space.topics.find(topic => topic.topicId == column.topicId);
		if (!topic) {
			// topic not found, ignored.
			return null;
		}
		// eslint-disable-next-line
		const factor = topic.factors.find(factor => factor.factorId == column.factorId);
		if (!factor) {
			// factor not found, ignored.
			return null;
		}

		const operator = column.operator;
		let secondaryTopic: ConsoleTopic | { topicId: undefined } | undefined = {topicId: (void 0)};
		let secondaryFactor: ConsoleTopicFactor | { factorId: undefined } | undefined = {factorId: (void 0)};
		if (!!operator && operator !== ColumnExpressionOperator.NONE) {
			// eslint-disable-next-line
			secondaryTopic = space.topics.find(topic => topic.topicId == column.secondaryTopicId);
			if (!secondaryTopic) {
				// has operator, but no secondary topic, ignored.
				return null;
			}
			// eslint-disable-next-line
			secondaryFactor = secondaryTopic.factors.find(factor => factor.factorId == column.secondaryFactorId);
			if (!secondaryFactor) {
				// has operator, but no secondary factor, ignored.
				return null;
			}
		}

		return {
			label: column.alias || factor.label || factor.name,
			value: transformColumnToDropdownValue(column),
			column
		};
	}).filter(x => x != null) as Array<DropdownOption & { column: ConsoleSpaceSubjectDataSetColumn }>;
};
