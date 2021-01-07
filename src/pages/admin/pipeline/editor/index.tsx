import { faCheck, faWaveSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { v4 } from 'uuid';
import { useCollapseFixedThing, useForceUpdate } from '../../../../common/utils';
import { Pipeline, PipelineTriggerType } from '../../../../services/admin/pipeline-types';
import { QueriedTopicForPipeline } from '../../../../services/admin/types';
import { PrimaryObjectButton } from '../../../component/object-button';
import { usePipelineContext } from '../pipeline-context';
import { ArrangedPipeline, PipelinesTopicNode } from '../types';
import { PipelineEditor } from './pipeline-editor';
import { createStage } from './utils';

interface DropdownState {
	visible: boolean;
	top: number;
	right: number
}

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
	> button {
		height: 22px;
		margin-left: calc(var(--margin) / 4);
		margin-bottom: 4px;
	}
`;
const PipelineSwitcher = styled.div`
	display: flex;
	position: relative;
	align-items: center;
	font-size: 0.8em;
	height: 22px;
	border-radius: 11px;
	color: var(--invert-color);
	background-color: var(--console-primary-color);
	padding: 0 calc(var(--margin) / 2);
	margin-left: calc(var(--margin) / 4);
	margin-bottom: 4px;
	cursor: pointer;
	transition: all 300ms ease-in-out;
	&:hover {
		box-shadow: var(--console-primary-hover-shadow);
	}
	&:before {
		content: '';
		display: block;
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 1px;
		background-color: var(--invert-color);
		opacity: 0;
		transition: all 300ms ease-in-out;
	}
	&[data-can-expand=false] {
		cursor: default;
		&:hover {
			box-shadow: none;
		}
	}
	&[data-expanded=true] {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
		&:before {
			opacity: 0.5;
		}
	}
	> span {
		position: relative;
	}
	> span:first-child {
		margin-right: calc(var(--margin) / 3);
	}
	> span:nth-child(2) {
		padding-left: calc(var(--margin) / 3);
		&:before {
			content: '';
			display: block;
			position: absolute;
			top: 20%;
			left: 0;
			width: 1px;
			height: 60%;
			background-color: var(--invert-color);
			opacity: 0.5;
		}
	}
`;
const Dropdown = styled.div.attrs<DropdownState>(({ visible, top, right }) => {
	return {
		style: {
			opacity: visible ? 1 : 0,
			pointerEvents: visible ? 'auto' : 'none',
			top,
			right
		}
	};
})<DropdownState>`
	display: flex;
	flex-direction: column;
	position: fixed;
	overflow-x: hidden;
	color: var(--invert-color);
	transition: opacity 300ms ease-in-out;
	border-radius: var(--border-radius);
	border-top-right-radius: 0;
	min-width: 120px;
	box-shadow: var(--console-primary-hover-shadow);
	z-index: 1;
	> div {
		display: flex;
		align-items: center;
		height: 28px;
		padding: 0 calc(var(--margin) / 2);
		background-color: var(--console-primary-color);
		&[data-current=true] {
			cursor: default;
		}
		&:hover {
			filter: brightness(140%);
		}
		> svg {
			margin-right: calc(var(--margin) / 4);
		}
		> span:first-child {
			margin-left: calc(var(--margin) / 4 + 14px * 0.8);
		}
	}
`;
const EditorBody = styled.div`
	flex-grow: 1;
	margin-bottom: var(--margin);
`;

const PipelineButton = (props: {
	label: 'Inbound' | 'Outbound',
	count: number;
	pipelines?: Array<ArrangedPipeline>;
	pipeline: ArrangedPipeline;
}) => {
	const { label, count, pipelines, pipeline: selectedPipeline } = props;

	const { changeSelectedPipeline } = usePipelineContext();
	const containerRef = useRef<HTMLDivElement>(null);
	const [ expanded, setExpanded ] = useState({ visible: false, right: 0, top: 0 });
	useCollapseFixedThing(containerRef, () => setExpanded({ ...expanded, visible: false }));

	const onExpandClicked = (event: React.MouseEvent<HTMLSpanElement>) => {
		event.preventDefault();
		event.stopPropagation();
		if (count === 0) {
			return;
		}
		const rect = containerRef.current!.getBoundingClientRect();
		setExpanded({
			visible: true,
			top: rect.top + rect.height,
			right: window.innerWidth - rect.left - rect.width
		});
	};
	const onMenuClicked = (pipeline: ArrangedPipeline) => (event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		if (pipeline === selectedPipeline) {
			return;
		}
		setExpanded({ ...expanded, visible: false });
		changeSelectedPipeline(pipeline);
	};

	return <PipelineSwitcher onClick={onExpandClicked}
	                         data-can-expand={count !== 0}
	                         data-expanded={expanded.visible}
	                         ref={containerRef}>
		<span>{label}</span>
		<span>{count}</span>
		<Dropdown {...expanded}>
			{pipelines?.map((pipeline, index) => {
				return <div key={v4()} data-current={pipeline === selectedPipeline}
				            onClick={onMenuClicked(pipeline)}>
					{selectedPipeline === pipeline ? <FontAwesomeIcon icon={faCheck}/> : null}
					<span>{pipeline.name || `Untitled Pipeline #${index + 1}`}</span>
				</div>;
			})}
		</Dropdown>
	</PipelineSwitcher>;
};

export const Editor = (props: {
	topic?: QueriedTopicForPipeline;
	nodes: Array<PipelinesTopicNode>;
}) => {
	const { topic, nodes } = props;

	const {
		store: { selectedPipeline },
		changeSelectedPipeline, addPipelineSelectionChangedListener, removePipelineSelectionChangedListener
	} = usePipelineContext();
	const forceUpdate = useForceUpdate();
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
		} else if (node.toMe) {
			changeSelectedPipeline(node.toMe[0]);
			return node.toMe[0];
		} else if (node.fromMe) {
			changeSelectedPipeline(node.fromMe[0]);
			return node.fromMe[0];
		} else {
			return (void 0);
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

	const onCreatePipelineClicked = () => {
		const newPipeline: Pipeline = {
			topicId: topic.topicId,
			type: PipelineTriggerType.INSERT_OR_MERGE,
			stages: [ createStage() ]
		};
		const arrangedPipeline = {
			...newPipeline,
			targetTopicIds: [] as Array<string>,
			origin: newPipeline,
			uuid: v4()
		} as ArrangedPipeline;
		if (!node.fromMe) {
			node.fromMe = [];
		}
		node.fromMe.push(arrangedPipeline);
		if (pipeline) {
			changeSelectedPipeline(arrangedPipeline);
		} else {
			// pipeline = selectNextPipeline();
			forceUpdate();
		}
	};

	// eslint-disable-next-line
	const isOutbound = pipeline?.topicId == topic.topicId;

	return <EditorContainer>
		<EditorTitle data-topic-type={topic.type}>
			<div>{topic.name}</div>
			{pipeline
				? <PipelineButton label='Inbound' count={inboundCount} pipelines={node.toMe} pipeline={pipeline}/>
				: null}
			{pipeline
				? <PipelineButton label='Outbound' count={outboundCount} pipelines={node.fromMe} pipeline={pipeline}/>
				: null}
			<PrimaryObjectButton onClick={onCreatePipelineClicked}>
				<FontAwesomeIcon icon={faWaveSquare}/>
				<span>Create New Outbound Pipeline</span>
			</PrimaryObjectButton>
		</EditorTitle>
		<EditorBody>
			{pipeline ?
				<PipelineEditor outbound={isOutbound} topic={topic}
				                pipeline={pipeline}/> : null}
		</EditorBody>
	</EditorContainer>;
};
