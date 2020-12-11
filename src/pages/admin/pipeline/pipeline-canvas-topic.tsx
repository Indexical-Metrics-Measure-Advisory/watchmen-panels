import { faCodeBranch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useReducer } from 'react';
import styled from 'styled-components';
import { QueriedTopicForPipeline, TopicType } from '../../../services/admin/types';
import { usePipelineContext } from './pipeline-context';
import { buildPipelineCanvasTopicStyles } from './styles';
import { ArrangedPipeline } from './types';

const Topic = styled.div.attrs({
	'data-widget': 'pipeline-topic'
})`
	display: flex;
	position: relative;
	border-width: 2px;
	border-color: var(--border-color);
	border-style: solid;
	border-radius: var(--border-radius);
	min-height: 64px;
	width: 300px;
	align-items: center;
	justify-content: center;
	font-family: var(--console-title-font-family);
	padding: 6px calc(var(--margin) / 2);
	cursor: pointer;
	&:last-child {
		margin-bottom: var(--margin);
	}
	${buildPipelineCanvasTopicStyles()}
`;
const Corner = styled.div`
	display: flex;
	position: absolute;
	align-items: center;
	font-weight: var(--font-bold);
	font-size: 0.8em;
	color: var(--invert-color);
	background-color: var(--border-color);
	padding: 0 calc(var(--margin) / 3);
	transform: scale(0.8);
	text-transform: uppercase;
`;
const TopicTypeIcon = styled(Corner).attrs({
	'data-widget': 'pipeline-topic-type'
})`
	top: 0;
	left: 0;
	border-bottom-right-radius: var(--border-radius);
	transform-origin: top left;
	padding-bottom: 2px;
	padding-left: calc(var(--margin) / 3 - 2px);
`;
const MorePipelines = styled(Corner)
	.attrs<{ count: number, direction: 'source' | 'target' }>(
		({ count, direction }) => {
			return {
				'data-widget': `pipeline-topic-more-${direction}-pipelines-count`,
				style: {
					display: count === 0 ? 'none' : 'flex'
				}
			};
		})<{ count: number, direction: 'source' | 'target' }>`
	right: 0;
	min-width: 35%;
	> svg {
		margin-right: calc(var(--margin) / 4);
		margin-top: 1px;
	}
`;
const MoreSourceTopicCount = styled(MorePipelines)`
	top: 0;
	border-bottom-left-radius: var(--border-radius);
	transform-origin: top right;
	padding-bottom: 2px;
	padding-right: calc(var(--margin) / 3 - 2px);
`;
const MoreTargetTopicCount = styled(MorePipelines)`
	bottom: 0;
	border-top-left-radius: var(--border-radius);
	transform-origin: bottom right;
	padding-top: 2px;
	padding-right: calc(var(--margin) / 3 - 2px);
	> svg {
		transform: rotateX(180deg);
	}
`;
const Selection = styled.div`
	display: block;
	position: absolute;
	border-width: 2px;
	border-color: var(--console-favorite-color);
	border-style: dashed;
	border-radius: var(--border-radius);
	top: -12px;
	left: -12px;
	width: calc(100% + 24px);
	height: calc(100% + 24px);
	z-index: -1;
	background-color: transparent;
	opacity: 0;
	pointer-events: none;
	transition: opacity 300ms ease-in-out;
	&[data-visible=true] {
		opacity: 1;
	}
`;
const ToNextTopicLine = styled.div.attrs({
	'data-widget': 'pipeline-topic-next-line'
})`
	display: block;
	position: absolute;
	top: calc(100% + 2px);
	left: calc(50% - 1px);
	width: 2px;
	height: calc(var(--margin) * 1.5);
	background-color: var(--border-color);
	&:before,
	&:after {
		content: '';
		display: block;
		position: absolute;
		left: -5px;
		border-bottom: 0;
		border-top: 6px solid var(--border-color);
		border-left: 6px solid transparent;
		border-right: 6px solid transparent;
	}
	&:before {
		bottom: -1px;
		z-index: -2;
	}
	&:after {
		bottom: 2px;
		border-top-color: var(--bg-color);
		z-index: -1;
	}
`;

const TopicTypeTooltip: { [key in TopicType]: string } = {
	[TopicType.RAW]: 'Raw',
	[TopicType.TIME]: 'Time Aggregate',
	[TopicType.AGGREGATE]: 'Aggregate',
	[TopicType.DISTINCT]: 'Distinct',
	[TopicType.RATIO]: 'Ratio',
	[TopicType.NOT_DEFINED]: 'Not Defined'
};

export const PipelineCanvasTopic = (props: {
	topic: QueriedTopicForPipeline;
	toMe?: Array<ArrangedPipeline>;
	fromMe?: Array<ArrangedPipeline>;
	toNext?: ArrangedPipeline;
	previous?: QueriedTopicForPipeline;
	next?: QueriedTopicForPipeline;
	current?: boolean;
}) => {
	const { topic, toMe = [], fromMe = [], previous, next, current = false } = props;

	const {
		store: { selectedTopic },
		changeSelectedTopic,
		addTopicSelectionChangedListener, removeTopicSelectionChangedListener
	} = usePipelineContext();
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);
	useEffect(() => {
		addTopicSelectionChangedListener(forceUpdate);
		return () => removeTopicSelectionChangedListener(forceUpdate);
	});

	const onTopicClicked = () => {
		if (selectedTopic === topic) {
			return;
		}
		changeSelectedTopic(topic);
	};

	// eslint-disable-next-line
	const moreSourceTopicCount = toMe.filter(pipeline => pipeline.topicId != previous?.topicId).length;
	// eslint-disable-next-line
	const moreTargetTopicCount = [ ...new Set(fromMe.map(pipeline => pipeline.targetTopicIds.filter(targetTopicId => targetTopicId != next?.topicId)).flat()) ].length;

	return <Topic data-current={current} data-topic-type={topic.type || TopicType.NOT_DEFINED} onClick={onTopicClicked}>
		<TopicTypeIcon data-widget-type='corner'>{TopicTypeTooltip[topic.type || TopicType.NOT_DEFINED]}</TopicTypeIcon>
		<MoreSourceTopicCount count={moreSourceTopicCount} direction='source' data-widget-type='corner'>
			<FontAwesomeIcon icon={faCodeBranch}/>
			{moreSourceTopicCount} More In
		</MoreSourceTopicCount>
		<MoreTargetTopicCount count={moreTargetTopicCount} direction='target' data-widget-type='corner'>
			<FontAwesomeIcon icon={faCodeBranch}/>
			{moreTargetTopicCount} More Out
		</MoreTargetTopicCount>
		<Selection data-visible={selectedTopic === topic}/>
		<div>{topic.name}</div>
		{next ? <ToNextTopicLine/> : null}
	</Topic>;
};