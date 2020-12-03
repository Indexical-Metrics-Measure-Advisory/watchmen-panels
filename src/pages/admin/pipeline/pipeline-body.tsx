import React, { useEffect, useReducer } from 'react';
import styled from 'styled-components';
import { usePipelineContext } from './pipeline-context';

const Body = styled.div.attrs({
	'data-widget': 'console-pipeline-body'
})`
	display: flex;
`;

export const PipelineBody = () => {
	const {
		store: { topics, topic, pipeline },
		addPipelineFlowChangedListener,
		removePipelineFlowChangedListener
	} = usePipelineContext();
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);
	useEffect(() => {
		addPipelineFlowChangedListener(forceUpdate);
		return () => removePipelineFlowChangedListener(forceUpdate);
	});

	return <Body>
	</Body>;
};