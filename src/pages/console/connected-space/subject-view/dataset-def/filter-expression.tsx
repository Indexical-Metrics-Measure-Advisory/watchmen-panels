import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useReducer } from 'react';
import styled from 'styled-components';
import { ConsoleSpaceSubjectDataSetFilterExpression } from '../../../../../services/console/types';
import { LinkButton } from '../../../../component/console/link-button';
import { FilterExpressionFactor } from './filter-expression-factor';
import { FilterExpressionOperator } from './filter-expression-operator';
import { FilterExpressionTopic } from './filter-expression-topic';
import { FilterExpressionValue } from './filter-expression-value';

const ExpressionRow = styled.div`
	display: flex;
	position: relative;
	padding: 0 calc(var(--margin) / 2);
	margin-top: calc(var(--margin) / 4);
	> button {
		width: 32px;
		min-width: 32px;
		border: var(--border);
		border-left-color: transparent;
		border-top-right-radius: var(--border-radius);
		border-bottom-right-radius: var(--border-radius);
		margin-left: -1px;
		&:hover:before {
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
		}
	}
`;

export const FilterExpression = (props: {
	filter: ConsoleSpaceSubjectDataSetFilterExpression;
	removeFilter: (filter: ConsoleSpaceSubjectDataSetFilterExpression) => void;
	level: number;
}) => {
	const { filter, removeFilter } = props;

	const [ , forceUpdate ] = useReducer(x => x + 1, 0);

	const onFilterRemoveClicked = () => removeFilter(filter);

	const showFactor = !!filter.topicId;
	const showOperator = !!filter.factorId;
	const showValue = !!filter.operator;

	return <ExpressionRow>
		<FilterExpressionTopic filter={filter} onTopicChanged={forceUpdate} grow={!showFactor}/>
		<FilterExpressionFactor filter={filter} onFactorChanged={forceUpdate}
		                        visible={showFactor} grow={showFactor && !showOperator}/>
		<FilterExpressionOperator filter={filter} onOperatorChanged={forceUpdate}
		                          visible={showOperator} grow={showOperator && !showValue}/>
		<FilterExpressionValue filter={filter} visible={showValue}/>
		<LinkButton onClick={onFilterRemoveClicked} ignoreHorizontalPadding={true}
		            tooltip={'Remove Filter'} center={true}>
			<FontAwesomeIcon icon={faTimes}/>
		</LinkButton>
	</ExpressionRow>;
};