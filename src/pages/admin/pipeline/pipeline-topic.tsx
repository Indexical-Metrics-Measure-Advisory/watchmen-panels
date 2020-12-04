import React from 'react';
import styled from 'styled-components';
import { QueriedTopicForPipeline } from '../../../services/admin/types';
import { WellKnownPipeline } from './types';

const Topic = styled.div`
	display: flex;
	position: relative;
	border-width: 2px;
	border-color: var(--border-color);
	border-style: solid;
	border-radius: var(--border-radius);
	min-height: 48px;
	min-width: 200px;
	align-items: center;
	justify-content: center;
	font-family: var(--console-title-font-family);
	&[data-current=true] {
		border-color: var(--console-primary-color);
	}
`;

export const PipelineTopic = (props: {
	topic: QueriedTopicForPipeline;
	toMe?: Array<WellKnownPipeline>;
	fromMe?: Array<WellKnownPipeline>;
	previous?: QueriedTopicForPipeline;
	next?: QueriedTopicForPipeline;
	current?: boolean;
}) => {
	const { topic, toMe = [], fromMe = [], previous, next, current = false } = props;

	return <Topic data-current={current}>
		<div>{topic.name}</div>
	</Topic>;
};