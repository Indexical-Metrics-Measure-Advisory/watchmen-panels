import React from 'react';
import styled from 'styled-components';
import { v4 } from 'uuid';
import { QueriedTopicForPipeline } from '../../../../services/admin/types';
import { WellKnownPipeline } from '../types';
import { StageEditor } from './pipeline-stage';
import { PipelineTrigger } from './pipeline-trigger';

const Container = styled.div`
	display: flex;
	flex-direction: column;
	margin-top: calc(var(--margin) / 4);
	border: var(--border);
	border-color: var(--pipeline-border-color);
	border-radius: calc(var(--border-radius) * 3);
	overflow: hidden;
`;
const Title = styled.div`
	display: flex;
	align-items: center;
	font-family: var(--console-title-font-family);
	height: 32px;
	line-height: 32px;
	background-color: var(--pipeline-bg-color);
	padding: 0 calc(var(--margin) / 2);
	> div:first-child {
		flex-grow: 1;
	}
	> div:nth-child(2) {
		font-size: 0.8em;
		line-height: 2em;
		opacity: 0.7;
		background-color: var(--console-primary-color);
		color: var(--invert-color);
		padding: 0 calc(var(--margin) / 4);
		border-radius: 1em;
	}
`;
const Body = styled.div`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	padding-bottom: calc(var(--margin) / 4);
`;

export const PipelinePanel = (props: {
	outbound: boolean;
	inDiagram: boolean;
	index: number;
	topic: QueriedTopicForPipeline;
	pipeline: WellKnownPipeline;
}) => {
	const { outbound, inDiagram, index, pipeline } = props;

	return <Container>
		<Title>
			<div>Pipeline #{index} ({outbound ? 'Outbound' : 'Inbound'})</div>
			{inDiagram ? <div>In Diagram</div> : null}
		</Title>
		<Body>
			<PipelineTrigger pipeline={pipeline}/>
			{pipeline.stages.map((stage, index) => {
				return <StageEditor stage={stage} index={index + 1} key={v4()}/>;
			})}
		</Body>
	</Container>;
};
