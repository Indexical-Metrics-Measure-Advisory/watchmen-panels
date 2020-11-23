import React from 'react';
import styled from 'styled-components';
import { ConsoleSpaceSubjectDataSetColumn } from '../../../../../services/console/types';
import Dropdown, { DropdownOption } from '../../../../component/dropdown';
import { useSubjectContext } from '../context';

const ColumnTopicContainer = styled.div`
	background-color: var(--console-subject-topic-bg-color);
	flex-grow: 1;
	flex-basis: 0;
	max-width: calc(50% - 16px);
	border-top-left-radius: var(--border-radius);
	border-bottom-left-radius: var(--border-radius);
	> div,
	> div[data-widget=dropdown]:focus {
		font-size: 0.8em;
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}
`;

export const ColumnTopic = (props: {
	column: ConsoleSpaceSubjectDataSetColumn;
	onTopicChanged: () => void;
}) => {
	const { column, onTopicChanged } = props;

	const { defs: { topics: topicOptions } } = useSubjectContext();

	const onColumnTopicChanged = async ({ value }: DropdownOption) => {
		const originTopicId = column.topicId;
		column.topicId = value as string;
		// eslint-disable-next-line
		if (originTopicId != column.topicId) {
			delete column.factorId;
			onTopicChanged();
		}
	};

	return <ColumnTopicContainer>
		<Dropdown options={topicOptions} please='Topic?'
		          value={column.topicId} onChange={onColumnTopicChanged}/>
	</ColumnTopicContainer>;
};