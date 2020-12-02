import React from 'react';
import styled from 'styled-components';
import { PipelineDiagram } from './pipeline-diagram';
import { PipelineStageEditor } from './pipeline-stage-editor';

const Body = styled.div.attrs({
	'data-widget': 'console-pipeline-body'
})`
	display: flex;
`;

export const PipelineBody = () => {
	return <Body>
		<PipelineDiagram/>
		<PipelineStageEditor/>
	</Body>;
};