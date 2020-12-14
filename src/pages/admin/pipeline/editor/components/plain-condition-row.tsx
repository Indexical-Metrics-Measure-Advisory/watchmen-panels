import React from 'react';
import { useForceUpdate } from '../../../../../common/utils';
import { ConditionOperator, PlainCondition } from '../../../../../services/admin/pipeline-types';
import { DropdownOption } from '../../../../component/dropdown';

const OperatorOptions = [
	{ value: ConditionOperator.EQUALS, label: 'Equals' },
	{ value: ConditionOperator.NOT_EQUALS, label: 'Not Equals' },
	{ value: ConditionOperator.LESS, label: 'Less Than' },
	{ value: ConditionOperator.LESS_EQUALS, label: 'Less Than or Equals' },
	{ value: ConditionOperator.MORE, label: 'Greater Than' },
	{ value: ConditionOperator.MORE_EQUALS, label: 'Greater Than or Equals' },
	{ value: ConditionOperator.IN, label: 'In' },
	{ value: ConditionOperator.NOT_IN, label: 'Not In' }
];
export const PlainConditionRow = (props: { condition: PlainCondition }) => {
	const { condition } = props;

	const forceUpdate = useForceUpdate();

	const onOperatorChanged = (condition: PlainCondition) => async (option: DropdownOption) => {
		condition.operator = option.value as ConditionOperator;
		forceUpdate();
	};

	return <div data-widget='plain-condition'>
	</div>;
};

