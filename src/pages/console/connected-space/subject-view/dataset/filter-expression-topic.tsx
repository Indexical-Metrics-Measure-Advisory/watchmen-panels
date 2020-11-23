import React from 'react';
import styled from 'styled-components';
import { ConsoleSpaceSubjectDataSetFilterExpression } from '../../../../../services/console/types';
import Dropdown, { DropdownOption } from '../../../../component/dropdown';
import { useSubjectContext } from '../context';

const ExpressionTopic = styled.div`
	background-color: var(--console-subject-topic-bg-color);
	min-width: 150px;
	flex-grow: 0;
	flex-basis: 0;
	border-top-left-radius: var(--border-radius);
	border-bottom-left-radius: var(--border-radius);
	transition: all 300ms ease-in-out;
	&[data-grow=true] {
		flex-grow: 1;
	}
	> div,
	> div[data-widget=dropdown]:focus {
		font-size: 0.8em;
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}
`;

export const FilterExpressionTopic = (props: {
	filter: ConsoleSpaceSubjectDataSetFilterExpression;
	onTopicChanged: () => void;
	grow: boolean;
}) => {
	const { filter, onTopicChanged, grow } = props;
	const { defs: { topics: topicOptions } } = useSubjectContext();

	const onFilterTopicChanged = async ({ value }: DropdownOption) => {
		const originTopicId = filter.topicId;
		filter.topicId = value as string;
		// eslint-disable-next-line
		if (originTopicId != filter.topicId) {
			delete filter.factorId;
			delete filter.operator;
			onTopicChanged();
		}
	};

	return <ExpressionTopic data-grow={grow}>
		<Dropdown options={topicOptions} value={filter.topicId} onChange={onFilterTopicChanged}
		          please='Topic?'/>
	</ExpressionTopic>;
};