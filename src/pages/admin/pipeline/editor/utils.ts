import { v4 } from 'uuid';
import {
	ConditionOperator,
	DatePartArithmetic,
	NoArithmetic,
	NumericArithmetic,
	SimpleFuncArithmetic,
	SystemActionType,
	UnitActionAlarmSeverity,
	UnitActionType
} from '../../../../services/admin/pipeline-types';
import { ArrangedProcessUnit, ArrangedStage, ArrangedUnitAction } from '../types';

export const unitActionTypeAsDisplay = (type: UnitActionType): string => {
	return type.split('-').map(word => {
		if ([ 'or', 'and', 'to', 'from' ].includes(word)) {
			return word;
		} else {
			return word.substr(0, 1).toUpperCase() + word.substr(1);
		}
	}).join(' ');
};

export const createStage = (): ArrangedStage => {
	return {
		uuid: v4(),
		name: '',
		units: [ createAlarmUnit() ]
	};
};

export const createAlarmUnit = (): ArrangedProcessUnit => {
	return {
		uuid: v4(),
		do: [ createAlarmAction() ]
	};
};

export const createAlarmAction = (): ArrangedUnitAction => {
	return {
		uuid: v4(),
		type: SystemActionType.ALARM,
		severity: UnitActionAlarmSeverity.MEDIUM
	} as ArrangedUnitAction;
};

const OperatorLabels: { [key in ConditionOperator]: string } = {
	[ConditionOperator.EQUALS]: '=',
	[ConditionOperator.NOT_EQUALS]: '≠',
	[ConditionOperator.LESS]: '<',
	[ConditionOperator.LESS_EQUALS]: '≤',
	[ConditionOperator.MORE]: '>',
	[ConditionOperator.MORE_EQUALS]: '≥',
	[ConditionOperator.IN]: 'In',
	[ConditionOperator.NOT_IN]: 'Not In'
};
export const asDisplayOperator = (operator: ConditionOperator): string => OperatorLabels[operator];
const ArithmeticLabels: { [key in SimpleFuncArithmetic]: string } = {
	[NoArithmetic.NO_FUNC]: '',
	[DatePartArithmetic.YEAR_OF]: 'Year',
	[DatePartArithmetic.MONTH_OF]: 'Month',
	[DatePartArithmetic.WEEK_OF]: 'WeekOfYear',
	[DatePartArithmetic.WEEKDAY]: 'Weekday',
	[NumericArithmetic.PERCENTAGE]: 'Percentage',
	[NumericArithmetic.ABSOLUTE_VALUE]: 'Abs',
	[NumericArithmetic.LOGARITHM]: 'Log'
};
export const asDisplayArithmetic = (arithmetic: SimpleFuncArithmetic): string => ArithmeticLabels[arithmetic];
