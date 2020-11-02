import dayjs, { OpUnitType, QUnitType } from 'dayjs';
import QuarterOfYear from 'dayjs/plugin/quarterOfYear';
import WeekOfYear from 'dayjs/plugin/weekOfYear';
import { CalculatedDataColumn, DataColumnType, DataTopic } from '../data/types';
import { detectDataType } from '../data/utils';
import { expressionStyle, fontWeightBold, fontWeightNormal, parameterLeadStyle } from './styles';

dayjs.extend(WeekOfYear);
dayjs.extend(QuarterOfYear);

const {
	workdays, days, dateDiff,
	year, month, quarter, week, day, weekday, hour, minute, second,
	printDocs: printDateTimeDocs
} = (() => {
	const workdays = (start: string, end: string) => {
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
		console.info('%cWorkdays duration: %cworkdays({{StartDate}}, {{EndDate}})', fontWeightBold, styles.expression);
	};
	const days = (start: string, end: string) => dayjs(end).diff(dayjs(start), 'day') + 1;
	days.doc = (styles: { expression: string }) => {
		console.info('%cDays duration: %cdays({{StartDate}}, {{EndDate}})', fontWeightBold, styles.expression);
	};
	const dateDiff = (start: string, end: string, unit?: QUnitType | OpUnitType, float?: boolean) => {
		const endDate = dayjs(end);
		const startDate = dayjs(start);
		return endDate.diff(startDate, unit, float);
	};
	dateDiff.doc = (styles: { expression: string, parameterLead: string }) => {
		console.groupCollapsed('Time duration: %cdateDiff({{StartDate}}, {{EndDate}}), \'unit\', float)', [ fontWeightNormal, styles.expression ].join(';'));
		console.group('%cOptional Parameter [unit]:', styles.parameterLead);
		console.info('Options: y | year | Q | quarter | M | month | w | week | d | day | h | hour | m | minute | s | second | ms | millisecond. Default in millisecond.');
		console.info('Single quote is required in expression when parameter is given explicitly.');
		console.groupEnd();
		console.group('%cOptional Parameter [float]:', styles.parameterLead);
		console.info('Options: true | false. Default in false.');
		console.groupEnd();
		console.groupEnd();
	};

	const year = (date: string) => dayjs(date).year();
	const month = (date: string) => dayjs(date).month() + 1;
	const quarter = (date: string) => dayjs(date).quarter();
	const week = (date: string) => dayjs(date).week();
	const day = (date: string) => dayjs(date).date();
	const weekday = (date: string) => dayjs(date).day();
	const hour = (date: string) => dayjs(date).hour();
	const minute = (date: string) => dayjs(date).minute();
	const second = (date: string) => dayjs(date).second();

	const printDocs = () => {
		console.groupCollapsed('Date & Time Functions');
		[ workdays, days, dateDiff ].forEach(func => func.doc({
			expression: expressionStyle,
			parameterLead: parameterLeadStyle
		}));
		const docOfDatePart = (funcName: string, styles: { expression: string }) => {
			console.info(`%c${funcName}: %c${funcName}({{Date}})`, `text-transform:capitalize;${fontWeightBold}`, styles.expression);
		};
		[
			year, month, quarter, week, day, weekday, hour, minute, second
		].forEach(func => docOfDatePart(func.name, { expression: expressionStyle }));
		console.groupEnd();
	};

	return {
		workdays, days, dateDiff,
		year, month, quarter, week, day, weekday, hour, minute, second,
		printDocs
	};
})();
// avoid "declared but not use" compile warning
[
	workdays, days, dateDiff,
	year, month, quarter, week, day, weekday, hour, minute, second
].forEach(x => x);

(() => {
	console.groupCollapsed('%cSupported expression syntax on calculating factor directly on watchmen frontend.',
		'background-color:chocolate;padding:2px 16px;line-height:18px;font-size:14px;border-radius:11px;color:#fff');

	/* eslint-disable */
	// property declaration in expression
	{
		console.groupCollapsed('Property Declaration in Expression');
		console.info('Property name must be wrapped by double braces.');
		console.info('For example: %c{{StartDate}}%c, %cStartDate%c is property name of topic.', expressionStyle, '', expressionStyle, '');
		console.groupEnd();
	}
	// result type declaration in expression
	{
		console.groupCollapsed('Result Type Declaration in Expression');
		console.info('Result type can be appointed explicitly in expression, otherwise it is detected by engine itself, may cause misunderstanding in some cases.');
		console.info('For example: %cnumeric:month({{StartDate}})%c, then expression result is a number.', expressionStyle, '');
		console.info('Supported types: %cnumeric%c, %cboolean%c, %ctext%c, %cdate%c, %ctime%c, %cdatetime%c.', expressionStyle, '', expressionStyle, '', expressionStyle, '', expressionStyle, '', expressionStyle, '', expressionStyle, '');
		console.groupEnd();
	}
	// date & time functions
	printDateTimeDocs();
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
		let value = eval(result);
		// console.log(value);
		if (value != null && ![ 'string', 'boolean', 'number' ].includes(typeof value)) {
			// let it be undefined
			value = void 0;
		}
		// eslint-disable-next-line
		target[propName] = value;
	} catch (e) {
		console.error(`Error occurred on evaluate expression[origin=${expression}, replaced=${result}].`);
		console.error(e);
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

const detectColumnTypeByExpression = (column: CalculatedDataColumn): boolean => {
	let { expression } = column;
	return [
		DataColumnType.TEXT, DataColumnType.BOOLEAN, DataColumnType.NUMERIC,
		DataColumnType.DATE, DataColumnType.TIME, DataColumnType.DATETIME
	].map(x => ({ type: x, prefix: `${x}:` })).some(({ type, prefix }) => {
		if (expression.startsWith(prefix)) {
			expression = expression.substring(prefix.length);
			column.type = type;
			return true;
		}
		return false;
	});
};
export const calculateColumn = (topic: DataTopic, column: CalculatedDataColumn): void => {
	const { name, expression } = column;
	if (name || expression) {
		const detected = detectColumnTypeByExpression(column);
		(topic.data || []).forEach(item => {
			calculate({
				target: item,
				propName: name,
				expression: expression,
				topic
			});
		});
		if (!detected) {
			const types = (topic.data || []).map(item => detectDataType(item[name]));
			const distinctTypes = Array.from(new Set(types));
			if (distinctTypes.includes(DataColumnType.TEXT)) {
				// any value is detected as text
				column.type = DataColumnType.TEXT;
			} else {
				// otherwise all types should be same
				column.type = distinctTypes[0];
			}
		}
	}
};