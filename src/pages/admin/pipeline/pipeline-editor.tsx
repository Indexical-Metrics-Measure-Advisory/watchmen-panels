import React, { useEffect, useReducer } from 'react';
import styled from 'styled-components';
import { Editor } from './editor';
import { usePipelineContext } from './pipeline-context';
import { PipelinesTopicNode } from './types';

const Container = styled.div`
	display: block;
	position: relative;
	flex-grow: 1;
	height: 100%;
`;
const NoTopicSelected = styled.div`
	display: flex;
	position: absolute;
	width: 100%;
	height: 100%;
	align-items: center;
	justify-content: center;
	font-family: var(--console-title-font-family);
	font-size: 3em;
	opacity: 0;
	pointer-events: none;
	transition: opacity 300ms ease-in-out;
	&[data-visible=true] {
		opacity: 0.2;
		pointer-events: auto;
	}
`;

export const PipelineEditor = (props: {
	nodes: Array<PipelinesTopicNode>;
	visible: boolean;
}) => {
	const { nodes, visible } = props;

	const {
		store: { selectedTopic },
		addTopicSelectionChangedListener, removeTopicSelectionChangedListener
	} = usePipelineContext();
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);
	useEffect(() => {
		addTopicSelectionChangedListener(forceUpdate);
		return () => removeTopicSelectionChangedListener(forceUpdate);
	});

	if (!visible) {
		return null;
	}

	return <Container>
		<Editor topic={selectedTopic} nodes={nodes}/>
		<NoTopicSelected data-visible={selectedTopic == null}>Pick a topic please.</NoTopicSelected>
	</Container>;
};