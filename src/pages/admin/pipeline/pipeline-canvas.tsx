import React from 'react';
import styled from 'styled-components';
import { v4 } from 'uuid';
import { QueriedTopicForPipeline } from '../../../services/admin/types';
import { PipelineTopic } from './pipeline-topic';
import { PipelinesTopicNode } from './types';

const PipelinesCanvasContainer = styled.div`
	display: grid;
	position: relative;
	padding: var(--margin);
	border-right: var(--border);
	grid-template-columns: 1fr;
	grid-row-gap: calc(var(--margin) * 1.5);
	align-content: start;
	overflow-x: hidden;
	overflow-y: auto;
	&::-webkit-scrollbar {
		background-color: transparent;
		width: 4px;
	}
	&::-webkit-scrollbar-track {
		background-color: transparent;
		border-radius: 2px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: var(--console-favorite-color);
		border-radius: 2px;
	}
`;

export const PipelineCanvas = (props: {
	topic?: QueriedTopicForPipeline;
	nodes: Array<PipelinesTopicNode>;
	visible: boolean;
}) => {
	const { topic, nodes, visible } = props;

	if (!visible || !topic) {
		return null;
	}

	return <PipelinesCanvasContainer>
		{nodes.map(node => {
			return <PipelineTopic {...node} key={v4()}/>;
		})}
	</PipelinesCanvasContainer>;
};