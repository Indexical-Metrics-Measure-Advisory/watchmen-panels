import { faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useForceUpdate } from '../../../../../common/utils';
import { TopicHolder } from '../../../../../services/admin/pipeline-types';
import { usePipelineContext } from '../../pipeline-context';
import { PipelineUnitActionEvent, usePipelineUnitActionContext } from '../pipeline-unit-action-context';

const Container = styled.div`
	display: flex;
	align-items: center;
	justify-self: start;
	height: 22px;
	border-radius: 11px;
	background-color: var(--pipeline-bg-color);
	cursor: pointer;
	box-shadow: 0 0 0 1px var(--border-color);
	transition: all 300ms ease-in-out;
	&:hover {
		box-shadow: var(--console-primary-hover-shadow);
	}
	> span {
		padding-left: calc(var(--margin) / 2);
	}
	> svg {
		font-size: 0.8em;
		margin: 0 calc(var(--margin) / 3);
	}
`;

export const TopicFilter = (props: { holder: TopicHolder }) => {
	const { holder } = props;

	const { store: { topics } } = usePipelineContext();
	const { addPropertyChangeListener, removePropertyChangeListener } = usePipelineUnitActionContext();
	const forceUpdate = useForceUpdate();
	useEffect(() => {
		addPropertyChangeListener(PipelineUnitActionEvent.TOPIC_CHANGED, forceUpdate);
		return () => removePropertyChangeListener(PipelineUnitActionEvent.TOPIC_CHANGED, forceUpdate);
	});

	// eslint-disable-next-line
	const topic = topics.find(topic => topic.topicId == holder.topicId);

	return <Container>
		<span>{topic ? 'No Filter' : 'Pick Topic First'}</span>
		<FontAwesomeIcon icon={faLink}/>
	</Container>;
};