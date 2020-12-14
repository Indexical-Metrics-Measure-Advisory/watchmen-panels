import React from 'react';
import styled from 'styled-components';
import { useForceUpdate } from '../../../../../common/utils';
import { ConditionOperator, PlainCondition } from '../../../../../services/admin/pipeline-types';
import { DropdownOption } from '../../../../component/dropdown';

const Container = styled.div.attrs({
	'data-widget': 'plain-condition'
})`
	display: flex;
	position: relative;
	height: 32px;
	min-height: 32px;
	&:before,
	&:after {
		content: '';
		display: block;
		position: absolute;
		background-color: var(--border-color);
	}
	&:before {
		top: 16px;
		left: calc(var(--margin) / -2);
		width: calc(var(--margin) / 2 - 4px);
		height: 1px;
	}
	&:after {
		top: 0;
		left: calc(var(--margin) / -2);
		width: 1px;
		height: 16px;
	}
	&:not(:last-child):after {
		height: 32px;
	}
`;

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

	return <Container>
	</Container>;
};

