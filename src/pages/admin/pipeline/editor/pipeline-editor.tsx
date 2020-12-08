import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import styled from 'styled-components';
import { v4 } from 'uuid';
import { QueriedTopicForPipeline } from '../../../../services/admin/types';
import Input from '../../../component/input';
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
		padding-right: var(--margin);
		> input {
			height: 24px;
			line-height: 24px;
			font-family: var(--console-title-font-family);
			border-top: 0;
			border-left: 0;
			border-right: 0;
			border-color: var(--console-font-color);
			border-radius: 0;
			padding: 0;
			width: 100%;
		}
		> svg {
			margin-left: calc(var(--margin) / 3);
			cursor: pointer;
			transition: all 300ms ease-in-out;
			&:hover {
				color: var(--console-favorite-color);
			}
		}
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
	index: number;
	topic: QueriedTopicForPipeline;
	pipeline: WellKnownPipeline;
}) => {
	const { outbound, inDiagram, index, pipeline } = props;

	const [ editing, setEditing ] = useState(false);

	const onEditClicked = () => setEditing(true);

	const pipelineName = pipeline.name || 'Untitled Pipeline';

	return <Container>
		<Title>
			{editing
				? <div>
					<Input value={pipelineName}/>
				</div>
				: <div>
					<span>#{index} {pipelineName} ({outbound ? 'Outbound' : 'Inbound'})</span>
					<FontAwesomeIcon icon={faEdit} onClick={onEditClicked}/>
				</div>}
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
