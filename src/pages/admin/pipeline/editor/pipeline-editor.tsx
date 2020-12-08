import React, { useReducer } from 'react';
import styled from 'styled-components';
import { v4 } from 'uuid';
import { QueriedTopicForPipeline } from '../../../../services/admin/types';
import { WellKnownPipeline } from '../types';
import { AutoSwitchInput } from './components/auto-switch-input';
import { StageEditor } from './pipeline-stage';
import { PipelineTrigger } from './pipeline-trigger';

const Container = styled.div`
	display: flex;
	flex-direction: column;
	margin-top: calc(var(--margin) / 4);
	border: var(--border);
	border-color: var(--pipeline-border-color);
	border-radius: var(--border-radius);
	overflow: hidden;
`;
const Title = styled.div`
	display: flex;
	align-items: center;
	font-family: var(--console-title-font-family);
	height: 32px;
	line-height: 32px;
	background-color: var(--pipeline-bg-color);
	padding: 0 calc(var(--margin) / 2) 0 calc(var(--margin) / 4);
	> div:first-child {
		flex-grow: 1;
		margin-right: calc(var(--margin) / 4);
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

export const PipelineEditor = (props: {
	outbound: boolean;
	inDiagram: boolean;
	topic: QueriedTopicForPipeline;
	pipeline: WellKnownPipeline;
}) => {
	const { outbound, inDiagram, pipeline } = props;

	const [ , forceUpdate ] = useReducer(x => x + 1, 0);

	const onNameChange = (value: string) => {
		// TODO pipeline name changed, to notify or save?
		pipeline.name = value;
		forceUpdate();
	};

	return <Container>
		<Title>
			<AutoSwitchInput onChange={onNameChange}
			                 prefixLabel={`# ${outbound ? 'Outbound' : 'Inbound'}`} value={pipeline.name}
			                 placeholder='Untitled Pipeline'
			                 styles={{ backgroundColor: 'transparent' }}/>
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
