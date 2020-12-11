import React, { useEffect, useReducer } from 'react';
import styled from 'styled-components';
import { QueriedTopicForPipeline } from '../../../../services/admin/types';
import { usePipelineContext } from '../pipeline-context';
import { PipelinesTopicNode } from '../types';
import { PipelineEditor } from './pipeline-editor';

const EditorContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: auto 1fr;
	position: relative;
	flex-grow: 1;
	height: 100%;
	padding: calc(var(--margin) / 2);
	overflow-y: scroll;
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
const EditorTitle = styled.div`
	display: flex;
	position: relative;
	align-items: flex-end;
	font-family: var(--console-title-font-family);
	margin-top: calc(var(--margin) / -2);
	height: 40px;
	overflow: hidden;
	border-bottom: var(--border);
	> div:first-child {
		flex-grow: 1;
		font-size: 1.4em;
	}
	> div:nth-child(2),
	> div:nth-child(3) {
		font-size: 0.8em;
		height: 1.8em;
		line-height: 1.8em;
		> span {
			border-radius: 1em;
			padding: 0 calc(var(--margin) / 3);
			color: var(--invert-color);
			background-color: var(--console-primary-color);
		}
	}
	> div:nth-child(3) {
		margin-left: calc(var(--margin) / 3);
	}
`;
const EditorBody = styled.div`
	flex-grow: 1;
	margin-bottom: var(--margin);
`;

export const Editor = (props: {
	topic?: QueriedTopicForPipeline;
	nodes: Array<PipelinesTopicNode>;
}) => {
	const { topic, nodes } = props;

	const {
		store: { selectedPipeline },
		changeSelectedPipeline, addPipelineSelectionChangedListener, removePipelineSelectionChangedListener
	} = usePipelineContext();
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);
	useEffect(() => {
		addPipelineSelectionChangedListener(forceUpdate);
		return () => removePipelineSelectionChangedListener(forceUpdate);
	});

	if (!topic) {
		return null;
	}

	const node = nodes.find(node => node.topic === topic)!;
	const inboundCount = node.toMe?.length || 0;
	const outboundCount = node.fromMe?.length || 0;

	const selectNextPipeline = () => {
		if (node.toNext) {
			changeSelectedPipeline(node.toNext);
			return node.toNext;
		}
	};
	let pipeline = selectedPipeline;
	if (pipeline) {
		// check the given selected pipeline is belongs to current topic or not
		if (!node.toMe?.includes(pipeline) && !node.fromMe?.includes(pipeline) && node.toNext !== pipeline) {
			pipeline = selectNextPipeline();
		}
	} else {
		pipeline = selectNextPipeline();
	}

	return <EditorContainer>
		<EditorTitle data-topic-type={topic.type}>
			<div>{topic.name}</div>
			<div data-topic-type={topic.type}>Inbound <span>{inboundCount}</span></div>
			<div data-topic-type={topic.type}>Outbound <span>{outboundCount}</span></div>
		</EditorTitle>
		<EditorBody>
			{pipeline ?
				<PipelineEditor outbound={true} inDiagram={true} topic={topic}
				                pipeline={pipeline}/> : null}
		</EditorBody>
	</EditorContainer>;
};