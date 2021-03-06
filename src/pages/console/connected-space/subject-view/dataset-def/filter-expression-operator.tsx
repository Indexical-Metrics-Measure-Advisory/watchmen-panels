import React from 'react';
import styled from 'styled-components';
import {
	ConsoleSpaceSubjectDataSetFilterExpression,
	ConsoleTopicFactorType,
	FilterExpressionOperator as ExpressionOperator
} from '../../../../../services/console/types';
import Dropdown, { DropdownOption } from '../../../../component/dropdown';
import { useSubjectContext } from '../context';
import { needExactDateTime, notExactDateTimeOperators } from './utils';

const operatorOptions: Array<{ value: ExpressionOperator, label: string }> = [
	{ value: ExpressionOperator.EQUALS, label: 'Is' },
	{ value: ExpressionOperator.NOT_EQUALS, label: 'Is not' },
	{ value: ExpressionOperator.LESS, label: 'Less than' },
	{ value: ExpressionOperator.LESS_EQUALS, label: 'Less than or equal to' },
	{ value: ExpressionOperator.MORE, label: 'Greater than' },
	{ value: ExpressionOperator.MORE_EQUALS, label: 'Greater than or equal to' },
	{ value: ExpressionOperator.IN, label: 'In set' },
	{ value: ExpressionOperator.NOT_IN, label: 'Not in set' },
	{ value: ExpressionOperator.TILL_NOW, label: 'Till now' },
	{ value: ExpressionOperator.YEAR_OF, label: 'Year of' },
	{ value: ExpressionOperator.HALF_YEAR_OF, label: 'Half year of' },
	{ value: ExpressionOperator.QUARTER_OF, label: 'Quarter of' },
	{ value: ExpressionOperator.MONTH_OF, label: 'Month of' },
	{ value: ExpressionOperator.WEEK_OF_YEAR, label: 'Week of year' },
	{ value: ExpressionOperator.WEEK_OF_MONTH, label: 'Week of month' },
	{ value: ExpressionOperator.WEEKDAYS, label: 'Weekday' }
];

const Operator = styled.div`
	flex-grow: 0;
	flex-basis: 0;
	display: flex;
	overflow-x: hidden;
	transition: all 300ms ease-in-out;
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
	} else if (type === ConsoleTopicFactorType.DATETIME) {
		operatorDropdownOptions = operatorDropdownOptions
			.filter(opt => ![ ExpressionOperator.IN, ExpressionOperator.NOT_IN ].includes(opt.value))
			.map(({ value, label }) => {
				switch (value) {
					case ExpressionOperator.LESS:
						label = 'Earlier than';
						break;
					case ExpressionOperator.LESS_EQUALS:
						label = 'Earlier than or is';
						break;
					case ExpressionOperator.MORE:
						label = 'Later than';
						break;
					case ExpressionOperator.MORE_EQUALS:
						label = 'Later than or is';
						break;
					default:
				}
				return { value, label };
			});
	} else if (type === ConsoleTopicFactorType.ENUM) {
		operatorDropdownOptions = operatorDropdownOptions.filter(opt => [ ExpressionOperator.EQUALS, ExpressionOperator.NOT_EQUALS ].includes(opt.value));
	} else {
		operatorDropdownOptions = operatorDropdownOptions.filter(opt => !notExactDateTimeOperators.includes(opt.value));
	}

	const onFilterOperatorChanged = async ({ value }: DropdownOption) => {
		const originalOperator = filter.operator;
		filter.operator = value as ExpressionOperator;
		if (type === ConsoleTopicFactorType.DATETIME
			&& !!originalOperator && originalOperator !== filter.operator
			&& (!needExactDateTime(originalOperator) || !needExactDateTime(filter.operator))) {
			delete filter.value;
		}
		onOperatorChanged();
	};

	return <Operator data-visible={visible} data-grow={grow}>
		<Dropdown options={operatorDropdownOptions} value={filter.operator} onChange={onFilterOperatorChanged}/>
	</Operator>;
};