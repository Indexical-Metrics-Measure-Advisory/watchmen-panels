import dayjs, { OpUnitType, QUnitType } from 'dayjs';
import QuarterOfYear from 'dayjs/plugin/quarterOfYear';
import WeekOfYear from 'dayjs/plugin/weekOfYear';
import { CalculatedDataColumn, DataColumnType, DataTopic } from '../data/types';

dayjs.extend(WeekOfYear);
dayjs.extend(QuarterOfYear);

const bold = 'font-weight:bold';
const normal = 'font-weight:normal';

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
workdays.doc = (styles: { expression: string }) => {
	console.info('%cWorkdays duration: %cworkdays({{StartDate}}, {{EndDate}})', bold, styles.expression);
};
export const days = (start: string, end: string) => dayjs(end).diff(dayjs(start), 'day') + 1;
days.doc = (styles: { expression: string }) => {
	console.info('%cDays duration: %cdays({{StartDate}}, {{EndDate}})', bold, styles.expression);
};
export const dateDiff = (start: string, end: string, unit?: QUnitType | OpUnitType, float?: boolean) => {
	const endDate = dayjs(end);
	const startDate = dayjs(start);
	return endDate.diff(startDate, unit, float);
};
dateDiff.doc = (styles: { expression: string, parameterLead: string }) => {
	console.groupCollapsed('Time duration: %cdateDiff({{StartDate}}, {{EndDate}}), \'unit\', float)', [ normal, styles.expression ].join(';'));
	console.group('%cOptional Parameter [unit]:', styles.parameterLead);
	console.info('Options: y | year | Q | quarter | M | month | w | week | d | day | h | hour | m | minute | s | second | ms | millisecond. Default in millisecond.');
	console.info('Single quote is required in expression when parameter is given explicitly.');
	console.groupEnd();
	console.group('%cOptional Parameter [float]:', styles.parameterLead);
	console.info('Options: true | false. Default in false.');
	console.groupEnd();
	console.groupEnd();
};

export const year = (date: string) => dayjs(date).year();
export const month = (date: string) => dayjs(date).month() + 1;
export const quarter = (date: string) => dayjs(date).quarter();
export const week = (date: string) => dayjs(date).week();
export const day = (date: string) => dayjs(date).date();
export const weekday = (date: string) => dayjs(date).day();
export const hour = (date: string) => dayjs(date).hour();
export const minute = (date: string) => dayjs(date).minute();
export const second = (date: string) => dayjs(date).second();

(() => {
	const expression = 'background-color:chocolate;padding:2px 16px;line-height:14px;font-size:12px;border-radius:9px;color:#fff';
	const parameterLead = 'color:chocolate;font-weight:bold';

	console.groupCollapsed('%cSupported expression syntax on calculating factor directly on watchmen frontend.',
		'background-color:chocolate;padding:2px 16px;line-height:18px;font-size:14px;border-radius:11px;color:#fff');

	/* eslint-disable */
	// property declaration in expression
	{
		console.groupCollapsed('Property Declaration in Expression');
		console.info('Property name must be wrapped by double braces.');
		console.info('For example: %c{{StartDate}}%c, %cStartDate%c is property name of topic.', expression, '', expression, '');
		console.groupEnd();
	}
	// date & time functions
	{
		console.groupCollapsed('Date & Time Functions');
		[ workdays, days, dateDiff ].forEach(func => func.doc({ expression, parameterLead }));
		const docOfDatePart = (funcName: string, styles: { expression: string }) => {
			console.info(`%c${funcName}: %c${funcName}({{Date}})`, `text-transform:capitalize;${bold}`, styles.expression);
		};
		[
			year, month, quarter, week, day, weekday, hour, minute, second
		].forEach(func => docOfDatePart(func.name, { expression }));
		console.groupEnd();
	}
	/* eslint-disable */

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