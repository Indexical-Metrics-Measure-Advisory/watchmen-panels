import React from 'react';
import styled from 'styled-components';
import {
	ConsoleSpaceSubjectDataSetColumn,
	ConsoleSpaceSubjectDataSetJoin
} from '../../../../../services/console/types';
import Dropdown, { DropdownOption } from '../../../../component/dropdown';
import { useSubjectContext } from '../context';

const ColumnTopicContainer = styled.div`
	background-color: var(--console-subject-topic-bg-color);
	flex-grow: 1;
	flex-basis: 0;
	overflow: hidden;
	//max-width: calc(50% - 16px);
	&:first-child {
		border-top-left-radius: var(--border-radius);
		border-bottom-left-radius: var(--border-radius);
	}
	&:not(:first-child) > div[data-widget=dropdown] {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		margin-left: -1px;
		width: calc(100% + 1px);
	}
	> div,
	> div[data-widget=dropdown]:focus {
		font-size: 0.8em;
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}
`;

export const ColumnTopic = (props: {
	column: ConsoleSpaceSubjectDataSetColumn | ConsoleSpaceSubjectDataSetJoin;
	onTopicChanged: () => void;
	propNames: [ 'topicId', 'factorId' ] | [ 'secondaryTopicId', 'secondaryFactorId' ];
}) => {
	const { column, onTopicChanged, propNames: [ topicPropName, factorPropName ] } = props;

	const { defs: { topics: topicOptions } } = useSubjectContext();

	const onColumnTopicChanged = async ({ value }: DropdownOption) => {
		const originTopicId = column[topicPropName];
		column[topicPropName] = value as string;
		// eslint-disable-next-line
		if (originTopicId != column[topicPropName]) {
			delete column[factorPropName];
			onTopicChanged();
		}
	};

	return <ColumnTopicContainer>
		<Dropdown options={topicOptions} please='Topic?'
		          value={column[topicPropName]} onChange={onColumnTopicChanged}/>
	</ColumnTopicContainer>;
};