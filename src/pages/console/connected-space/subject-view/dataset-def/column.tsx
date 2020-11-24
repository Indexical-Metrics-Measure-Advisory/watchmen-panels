import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useReducer } from 'react';
import styled from 'styled-components';
import { ConsoleSpaceSubjectDataSetColumn } from '../../../../../services/console/types';
import { LinkButton } from '../../../../component/console/link-button';
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
		> div[data-widget=dropdown]:nth-child(2) {
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
		}
		&:nth-child(2) {
			flex-grow: 0;
			border-radius: 0;
			border-left-color: transparent;
			margin-left: -1px;
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

export const Column = (props: {
	column: ConsoleSpaceSubjectDataSetColumn;
	removeColumn: (column: ConsoleSpaceSubjectDataSetColumn) => void;
}) => {
	const { column, removeColumn } = props;

	const [ , forceUpdate ] = useReducer(x => x + 1, 0);

	const onColumnRemoveClicked = () => removeColumn(column);

	const showFactor = !!column.topicId;

	return <ColumnRowContainer data-show-factor={showFactor}>
		<ColumnTopic column={column} onTopicChanged={forceUpdate}/>
		<ColumnFactor column={column} onFactorChanged={forceUpdate}/>
		<LinkButton onClick={onColumnRemoveClicked} ignoreHorizontalPadding={true}
		            tooltip={'Remove Column'} center={true}>
			<FontAwesomeIcon icon={faTimes}/>
		</LinkButton>
	</ColumnRowContainer>;
};
