import React from 'react';
import styled from 'styled-components';
import {
	ConsoleSpaceSubjectDataSetFilterExpression,
	ConsoleTopicFactorType,
	FilterExpressionOperator as ExpressionOperator
} from '../../../../../services/console/types';
import Dropdown, { DropdownOption } from '../../../../component/dropdown';
import { useSubjectContext } from '../context';

const ExpressionFactor = styled.div`
	background-color: var(--console-subject-topic-bg-color);
	min-width: 0;
	flex-grow: 0;
	flex-basis: 0;
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

export const FilterExpressionFactor = (props: {
	filter: ConsoleSpaceSubjectDataSetFilterExpression;
	onFactorChanged: () => void;
	visible: boolean;
	grow: boolean;
}) => {
	const { filter, onFactorChanged, visible, grow } = props;

	const { defs: { factors: factorOptions } } = useSubjectContext();

	const { topicId, factorId } = filter;
	const factorDropdownOptions = factorOptions[`${topicId}`] || [];

	const onFilterFactorChanged = async (option: DropdownOption) => {
		filter.factorId = option.value as string;
		const { type } = (option as any).factor;
		if (type === ConsoleTopicFactorType.BOOLEAN) {
			filter.operator = ExpressionOperator.EQUALS;
			filter.value = 'true';
		} else if (type === ConsoleTopicFactorType.DATETIME) {
			filter.operator = ExpressionOperator.EQUALS;
			delete filter.value;
		} else if (type === ConsoleTopicFactorType.ENUM) {
			filter.operator = ExpressionOperator.EQUALS;
			delete filter.value;
		} else {
			delete filter.operator;
			delete filter.value;
		}
		onFactorChanged();
	};

	return <ExpressionFactor data-visible={visible} data-grow={grow}>
		<Dropdown options={factorDropdownOptions} value={factorId} onChange={onFilterFactorChanged}/>
	</ExpressionFactor>;
};