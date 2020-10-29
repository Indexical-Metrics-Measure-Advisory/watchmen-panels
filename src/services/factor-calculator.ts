import dayjs, { OpUnitType, QUnitType } from 'dayjs';
import { CalculatedDataColumn, DataColumnType, DataTopic } from '../data/types';

export const workdays = (start: string, end: string) => {
	const endDate = dayjs(end);
	const endWeekday = endDate.day();
	const startDate = dayjs(start);
	const startWeekday = startDate.day();

	let diffDays = endDate.diff(startDate, 'day') + 1;
	if (endWeekday >= startWeekday && diffDays <= 7) {
		// same week
		return endWeekday - startWeekday - (startWeekday === 0 ? 1 : 0) + (endWeekday === 6 ? 1 : 0);
	} else if (endWeekday >= startWeekday) {
		return Math.floor(diffDays / 7) * 5 + ((endWeekday === 6 ? 5 : endWeekday) - startWeekday);
	} else {
		return Math.floor(diffDays / 7) * 5 + (6 - (startWeekday === 0 ? 1 : startWeekday)) + endWeekday;
	}
};

export const days = (start: string, end: string) => {
	const endDate = dayjs(end);
	const startDate = dayjs(start);
	return endDate.diff(startDate, 'day') + 1;
};

export const dateDiff = (start: string, end: string, unit?: QUnitType | OpUnitType, float?: boolean) => {
	const endDate = dayjs(end);
	const startDate = dayjs(start);
	return endDate.diff(startDate, unit, float);
};

(() => {
	const expressionStyle = 'background-color:chocolate;padding:2px 16px;line-height:14px;font-size:12px;border-radius:9px;color:#fff';
	const parameterLeadStyle = 'color:chocolate;font-weight:bold';

	console.groupCollapsed('%cSupported expression syntax on calculating factor directly on watchmen frontend.',
		'background-color:chocolate;padding:2px 16px;line-height:18px;font-size:14px;border-radius:11px;color:#fff');

	console.info('Property name must be wrapped by double braces.');
	console.info('For example: %c{{StartDate}}%c, %cStartDate%c is property name of topic.',
		expressionStyle, '', expressionStyle, '');

	console.groupCollapsed('Workdays duration:');
	console.info('Workdays between two dates: %cworkdays({{StartDate}}, {{EndDate}})', expressionStyle);
	console.groupEnd();

	console.groupCollapsed('Days duration:');
	console.info('Days between two dates: %cdays({{StartDate}}, {{EndDate}})', expressionStyle);
	console.groupEnd();

	console.groupCollapsed('Time duration:');
	console.info('Time duration between two dates: %cdateDiff({{StartDate}}, {{EndDate}}), \'unit\', float)', expressionStyle);
	console.group('%cOptional parameter [unit]:', parameterLeadStyle);
	console.info('Options: y | year | Q | quarter | M | month | w | week | d | day | h | hour | m | minute | s | second | ms | millisecond.');
	console.info('Single quote is required in expression when parameter is given explicitly.');
	console.groupEnd();
	console.group('%cOptional parameter [float]:', parameterLeadStyle);
	console.info('Options: true | false.');
	console.groupEnd();
	console.groupEnd();

	console.groupEnd();
})();

const VARIABLE_PATTERN = /{{(((?![{}]).)+)}}/m;
/**
 * will change or create target property in given item
 */
export const calculate = (options: {
	target: any,
	propName: string,
	expression: string,
	topic: DataTopic
}): void => {
	const { target, propName, expression, topic } = options;

	if (!expression || expression.trim().length === 0) {
		// no expression defined
		return;
	}

	let result = expression;
	let match: RegExpExecArray | null = VARIABLE_PATTERN.exec(result);
	while (match) {
		const matchedWord = match[0];
		const matchedPropName = match[1];
		const startIndex = match.index;
		let value = target[matchedPropName];

		const column = topic.columns.find(c => c.name === matchedPropName);
		switch (true) {
			case value == null:
				value = 'null';
				break;
			case !column || [ DataColumnType.ARRAY, DataColumnType.OBJECT, DataColumnType.UNKNOWN ].includes(column.type):
				// type invisible
				value = `'${value.replace(/'/g, '\\\'')}'`;
				break;
			case column!.type === DataColumnType.BOOLEAN:
				switch (true) {
					case [ 'TRUE', 'T', 'YES', 'Y' ].includes(value.toUpperCase()):
						value = 'true';
						break;
					case [ 'FALSE', 'F', 'NO', 'N' ].includes(value.toUpperCase()):
					default:
						value = 'false';
						break;
				}
				break;
			case column!.type === DataColumnType.NUMERIC:
				// keep value as literal
				const v = parseFloat(value);
				if (isNaN(v)) {
					value = 'null';
				} else {
					value = `${value}`;
				}
				break;
			case [ DataColumnType.DATE, DataColumnType.TIME, DataColumnType.DATETIME ].includes(column!.type):
				value = value.trim();
				if (value.length === 0) {
					value = 'null';
				} else {
					value = `'${value}'`;
				}
				break;
			case column!.type === DataColumnType.TEXT:
			default:
				value = `'${value.replace(/'/g, '\\\'')}'`;
				break;
		}
		result = `${result.substring(0, startIndex)}${value}${result.substring(startIndex + matchedWord.length)}`;

		// next round
		match = VARIABLE_PATTERN.exec(result);
	}

	try {
		// TODO use eval() here, should be replaced with execution on AST
		// console.info(`Evaluate expression[origin=${expression}, replaced=${result}].`);
		// eslint-disable-next-line
		target[propName] = eval(result);
	} catch (e) {
		// console.error(`Error occurred on evaluate expression[origin=${expression}, replaced=${result}].`);
		// console.error(e);
	}
};

export const isExpressionIncorrect = (topic: DataTopic, column: CalculatedDataColumn) => {
	const expression = (column.expression || '').trim();
	if (!expression) {
		// no expression
		return true;
	}

	const variables = expression.match(/{{(((?![{}]).)+)}}/g) || [];
	if (variables.length === 0) {
		// no variables
		return true;
	}

	const allColumnNames = topic.columns.map(c => c.name);
	// there is no loop refer, no incorrect refer
	return -1 !== variables.findIndex(variable => {
		const x = variable.replace('{{', '').replace('}}', '');
		if (x === column.name) {
			// use myself, loop
			return true;
		} else if (!allColumnNames.includes(x)) {
			// cannot match any column
			return true;
		}
		return false;
	});
};

export const calculateColumn = (topic: DataTopic, column: CalculatedDataColumn): void => {
	if (column.name || column.expression) {
		(topic.data || []).forEach(item => calculate({
			target: item,
			propName: column.name,
			expression: column.expression,
			topic
		}));
	}
};