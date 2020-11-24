import {
	ConsoleSpaceSubjectDataSetFilter,
	ConsoleSpaceSubjectDataSetFilterExpression,
	ConsoleSpaceSubjectDataSetFilterJoint,
	FilterExpressionOperator
} from '../../../../../services/console/types';

export const isJointFilter = (filter: ConsoleSpaceSubjectDataSetFilter): filter is ConsoleSpaceSubjectDataSetFilterJoint => !!(filter as any).jointType;
export const isExpressionFilter = (filter: ConsoleSpaceSubjectDataSetFilter): filter is ConsoleSpaceSubjectDataSetFilterExpression => !(filter as any).jointType;

export const notExactDateTimeOperators = [
	FilterExpressionOperator.YEAR_OF, FilterExpressionOperator.HALF_YEAR_OF,
	FilterExpressionOperator.QUARTER_OF, FilterExpressionOperator.MONTH_OF,
	FilterExpressionOperator.WEEK_OF_YEAR, FilterExpressionOperator.WEEK_OF_MONTH,
	FilterExpressionOperator.WEEKDAYS, FilterExpressionOperator.TILL_NOW
];
export const needExactDateTime = (operator?: FilterExpressionOperator): boolean => {
	return !!operator && !notExactDateTimeOperators.includes(operator);
};
