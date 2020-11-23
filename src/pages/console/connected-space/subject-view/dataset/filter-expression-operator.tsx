import React from 'react';
import styled from 'styled-components';
import {
	ConsoleSpaceSubjectDataSetFilterExpression,
	ConsoleTopicFactorType,
	FilterExpressionOperator as ExpressionOperator
} from '../../../../../services/console/types';
import Dropdown, { DropdownOption } from '../../../../component/dropdown';
import { useSubjectContext } from '../context';

const operatorOptions: Array<{ value: ExpressionOperator, label: string }> = [
	{ value: ExpressionOperator.EQUALS, label: 'Is' },
	{ value: ExpressionOperator.NOT_EQUALS, label: 'Is not' },
	{ value: ExpressionOperator.LESS, label: 'Less than' },
	{ value: ExpressionOperator.LESS_EQUALS, label: 'Less than or equal to' },
	{ value: ExpressionOperator.MORE, label: 'Greater than' },
	{ value: ExpressionOperator.MORE_EQUALS, label: 'Greater than or equal to' },
	{ value: ExpressionOperator.IN, label: 'In set' },
	{ value: ExpressionOperator.NOT_IN, label: 'Not in set' }
];

const Operator = styled.div`
	flex-grow: 0;
	flex-basis: 0;
	display: flex;
	overflow-x: hidden;
	&[data-visible=true] {
		min-width: 150px;
	}
	&[data-grow=true] {
		flex-grow: 1;
	}
	> div,
	> div[data-widget=dropdown]:focus {
		font-size: 0.8em;
		border-radius: 0;
		margin-left: -1px;
		width: calc(100% + 1px);
	}
`;

export const FilterExpressionOperator = (props: {
	filter: ConsoleSpaceSubjectDataSetFilterExpression;
	onOperatorChanged: () => void;
	visible: boolean;
	grow: boolean;
}) => {
	const { filter, onOperatorChanged, visible, grow } = props;
	const { topicId, factorId } = filter;

	const { defs: { factors: factorOptions } } = useSubjectContext();
	const factorDropdownOptions = factorOptions[`${topicId}`] || [];
	// eslint-disable-next-line
	const factor = (factorDropdownOptions.find(f => f.value == factorId) || {}).factor;
	const { type } = factor || {};

	let operatorDropdownOptions = operatorOptions;
	if (type === ConsoleTopicFactorType.BOOLEAN) {
		operatorDropdownOptions = operatorDropdownOptions.filter(opt => [ ExpressionOperator.EQUALS ].includes(opt.value));
		filter.operator = ExpressionOperator.EQUALS;
		filter.value = 'true';
	} else if (type === ConsoleTopicFactorType.DATETIME) {
		operatorDropdownOptions = operatorDropdownOptions.filter(opt =>
			![
				ExpressionOperator.IN, ExpressionOperator.NOT_IN
			].includes(opt.value));
	} else if (type === ConsoleTopicFactorType.ENUM) {
		operatorDropdownOptions = operatorDropdownOptions.filter(opt =>
			[
				ExpressionOperator.EQUALS, ExpressionOperator.NOT_EQUALS
			].includes(opt.value));
	}

	const onFilterOperatorChanged = async ({ value }: DropdownOption) => {
		filter.operator = value as ExpressionOperator;
		onOperatorChanged();
	};

	return <Operator data-visible={visible} data-grow={grow}>
		<Dropdown options={operatorDropdownOptions} value={filter.operator} onChange={onFilterOperatorChanged}/>
	</Operator>;
};