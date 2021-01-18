import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';
import { useForceUpdate } from '../../../../../common/utils';
import { ColumnExpressionOperator, ConsoleSpaceSubjectDataSetColumn } from '../../../../../services/console/types';
import { LinkButton } from '../../../../component/console/link-button';
import Dropdown, { DropdownOption } from '../../../../component/dropdown';
import { ColumnFactor } from './column-factor';
import { ColumnTopic } from './column-topic';

const ColumnRowContainer = styled.div.attrs({
	'data-widget': 'console-subject-view-column-row'
})`
	display: flex;
	padding: 0 calc(var(--margin) / 2);
	margin-top: calc(var(--margin) / 4);
	&:last-child {
		margin-bottom: calc(var(--margin) / 4);
	}
	&[data-show-factor=false] {
		> div[data-widget=dropdown]:nth-child(2),
		> div[data-widget=dropdown]:nth-child(3) {
			width: 0;
			border: 0;
			padding: 0;
		}
	}
	&[data-show-factor=true] {
		> div[data-widget=dropdown]:nth-child(2) {
			flex-grow: 1;
		}
	}
	> div[data-widget=dropdown] {
		font-size: 0.8em;
		flex-grow: 1;
		&:first-child {
			background-color: var(--console-subject-topic-bg-color);
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
			min-width: 150px;
		}
		&:nth-child(2),
		&:nth-child(3) {
			flex-grow: 0;
			border-radius: 0;
			border-left-color: transparent;
			margin-left: -1px;
		}
		&:nth-child(3) {
			max-width: 100px;
		}
	}
	> button {
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

const ExpressionOperators = [
	{ value: ColumnExpressionOperator.NONE, label: 'As is' },
	{ value: ColumnExpressionOperator.ADD, label: 'Add' },
	{ value: ColumnExpressionOperator.SUBTRACT, label: 'Subtract' },
	{ value: ColumnExpressionOperator.MULTIPLY, label: 'Multiply' },
	{ value: ColumnExpressionOperator.DIVIDE, label: 'Divide' },
	{ value: ColumnExpressionOperator.MODULUS, label: 'Modulus' }
];

export const Column = (props: {
	column: ConsoleSpaceSubjectDataSetColumn;
	removeColumn: (column: ConsoleSpaceSubjectDataSetColumn) => void;
}) => {
	const { column, removeColumn } = props;

	const forceUpdate = useForceUpdate();

	const onOperatorChanged = async (option: DropdownOption) => {
		column.operator = option.value as ColumnExpressionOperator;
		forceUpdate();
	};
	const onColumnRemoveClicked = () => removeColumn(column);

	const showFactor = !!column.topicId;

	return <ColumnRowContainer data-show-factor={showFactor}>
		<ColumnTopic column={column} onTopicChanged={forceUpdate}/>
		<ColumnFactor column={column} onFactorChanged={forceUpdate}/>
		<Dropdown value={column.operator || ColumnExpressionOperator.NONE} options={ExpressionOperators}
		          onChange={onOperatorChanged}/>
		<LinkButton onClick={onColumnRemoveClicked} ignoreHorizontalPadding={true}
		            tooltip={'Remove Column'} center={true}>
			<FontAwesomeIcon icon={faTimes}/>
		</LinkButton>
	</ColumnRowContainer>;
};
