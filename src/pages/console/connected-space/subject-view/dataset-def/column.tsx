import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';
import { useForceUpdate } from '../../../../../common/utils';
import { ColumnExpressionOperator, ConsoleSpaceSubjectDataSetColumn } from '../../../../../services/console/types';
import { LinkButton } from '../../../../component/console/link-button';
import Dropdown, { DropdownOption } from '../../../../component/dropdown';
import Input from '../../../../component/input';
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
		> div:nth-child(2),
		> div:nth-child(2) > div[data-widget=dropdown] {
			flex-grow: 0;
			width: 0;
			border: 0;
			padding: 0;
		}
	}
	&[data-show-factor=true] {
		> div:nth-child(2) {
			flex-grow: 1;
		}
	}
	&[data-show-secondary-topic=false] {
		> div:nth-child(4),
		> div:nth-child(4) > div[data-widget=dropdown],
		> div:nth-child(5),
		> div:nth-child(5) > div[data-widget=dropdown] {
			flex-grow: 0;
			width: 0;
			border: 0;
			padding: 0;
		}
	}
	&[data-show-secondary-topic=true] {
		> div:nth-child(4) {
			flex-grow: 1;
		}
	}
	&[data-show-secondary-factor=false] {
		> div:nth-child(5),
		> div:nth-child(5) > div[data-widget=dropdown] {
			flex-grow: 0;
			width: 0;
			border: 0;
			padding: 0;
		}
	}
	&[data-show-secondary-factor=true] {
		> div:nth-child(5) {
			flex-grow: 1;
		}
	}
	> div[data-widget=dropdown] {
		font-size: 0.8em;
		flex-grow: 0;
		border-radius: 0;
		border-left-color: transparent;
		margin-left: -1px;
		max-width: 100px;
	}
	> input {
		border-radius: 0;
		border-left-color: transparent;
		margin-left: -1px;
		font-size: 0.8em;
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
	const onAliasChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
		column.alias = event.target.value;
		forceUpdate();
	};
	const onColumnRemoveClicked = () => removeColumn(column);

	const showFactor = !!column.topicId;

	const showSecondTopic = !!column.operator && column.operator !== ColumnExpressionOperator.NONE;
	const showSecondFactor = showSecondTopic && !!column.secondaryTopicId;

	return <ColumnRowContainer data-show-factor={showFactor}
	                           data-show-secondary-topic={showSecondTopic}
	                           data-show-secondary-factor={showSecondFactor}>
		<ColumnTopic column={column} propNames={[ 'topicId', 'factorId' ]}
		             onTopicChanged={forceUpdate}/>
		<ColumnFactor column={column} propNames={[ 'topicId', 'factorId' ]}
		              onFactorChanged={forceUpdate}/>
		<Dropdown value={column.operator || ColumnExpressionOperator.NONE} options={ExpressionOperators}
		          onChange={onOperatorChanged}/>
		<ColumnTopic column={column} propNames={[ 'secondaryTopicId', 'secondaryFactorId' ]}
		             onTopicChanged={forceUpdate}/>
		<ColumnFactor column={column} propNames={[ 'secondaryTopicId', 'secondaryFactorId' ]}
		              onFactorChanged={forceUpdate}/>
		<Input placeholder='Alias'
		       value={column.alias || ''} onChange={onAliasChanged}/>
		<LinkButton onClick={onColumnRemoveClicked} ignoreHorizontalPadding={true}
		            tooltip={'Remove Column'} center={true}>
			<FontAwesomeIcon icon={faTimes}/>
		</LinkButton>
	</ColumnRowContainer>;
};
