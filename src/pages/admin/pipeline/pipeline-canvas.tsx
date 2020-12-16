import React, { useEffect } from 'react';
import styled from 'styled-components';
import { v4 } from 'uuid';
import { useForceUpdate } from '../../../common/utils';
import { QueriedTopicForPipeline } from '../../../services/admin/types';
import { PipelineCanvasTopic } from './pipeline-canvas-topic';
import { usePipelineContext } from './pipeline-context';
import { PipelinesTopicNode } from './types';

const PipelinesCanvasContainer = styled.div.attrs({
	'data-widget': 'pipeline-canvas'
})`
	display: grid;
	position: relative;
	padding: var(--margin);
	border-right: var(--border);
	grid-template-columns: 1fr;
	grid-row-gap: calc(var(--margin) * 1.5);
	align-content: start;
	overflow-x: hidden;
	overflow-y: auto;
	min-width: 365px;
	max-width: 365px;
	opacity: 1;
	left: 0;
	transition: left 300ms ease-in-out, opacity 300ms ease-in-out;
	&[data-visible=false] {
		position: absolute;
		left: -365px;
		opacity: 0;
	}
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

	const {
		store: { canvasVisible },
		addCanvasVisibilityListener,
		removeCanvasVisibilityListener
	} = usePipelineContext();
	const forceUpdate = useForceUpdate();
	useEffect(() => {
		addCanvasVisibilityListener(forceUpdate);
		return () => removeCanvasVisibilityListener(forceUpdate);
	});

	if (!visible || !topic) {
		return null;
	}

	return <PipelinesCanvasContainer data-visible={canvasVisible}>
		{nodes.map(node => {
			return <PipelineCanvasTopic {...node} key={v4()}/>;
		})}
	</PipelinesCanvasContainer>;
};