import React from 'react';
import styled from 'styled-components';
import { QueriedTopicForPipeline, TopicType } from '../../../services/admin/types';
import { ArrangedPipelines, WellKnownPipeline } from './types';

const PipelinesCanvasContainer = styled.div`
	display: block;
	position: relative;
	padding: calc(var(--margin) / 2) var(--margin);
	border-right: var(--border);
`;

const computePipelines = (options: {
	target: QueriedTopicForPipeline;
	arranged: ArrangedPipelines;
	allTopics: Map<string, QueriedTopicForPipeline>;
	getPipelines: (topicId: string) => Array<WellKnownPipeline> | undefined;
}) => {
	const { target: { topicId }, arranged: { starts, ends }, allTopics, getPipelines } = options;

	const nodes = [];
	let targetTopicId = topicId;
	while (targetTopicId) {
		const pipelines = getPipelines(targetTopicId);
		if (!pipelines || pipelines.length === 0) {
			// reaches start, no pipeline to me
			break;
		}

		const votedPipeline = pipelines[0];
		const { topicId } = votedPipeline;
		// create a wrapper topic only if topic is not loaded yet
		const topic = allTopics.get(votedPipeline.topicId) || {
			topicId,
			code: topicId,
			name: topicId,
			type: TopicType.NOT_DEFINED,
			factors: []
		};
		const node = { topic, fromMe: starts.get(topicId), toMe: ends.get(topicId) };
		nodes.push(node);
		// move backward, target is me
		targetTopicId = topicId;
	}
	return nodes;
};
const computePipelinesTo = (target: QueriedTopicForPipeline, arranged: ArrangedPipelines, topics: Map<string, QueriedTopicForPipeline>) => {
	return computePipelines({
		target,
		arranged,
		allTopics: topics,
		getPipelines: topicId => arranged.ends.get(topicId)
	});
};
const computePipelinesFrom = (target: QueriedTopicForPipeline, arranged: ArrangedPipelines, topics: Map<string, QueriedTopicForPipeline>) => {
	return computePipelines({
		target,
		arranged,
		allTopics: topics,
		getPipelines: topicId => arranged.starts.get(topicId)
	});
};

export const PipelineCanvas = (props: {
	topic?: QueriedTopicForPipeline;
	topics: Map<string, QueriedTopicForPipeline>;
	arranged: ArrangedPipelines;
	visible: boolean;
}) => {
	const { topic, topics, arranged, visible } = props;
	const { starts, ends } = arranged;

	if (!visible || !topic) {
		return null;
	}

	// compute pipelines from root to given topic
	const toCurrent = computePipelinesTo(topic, arranged, topics).reverse();
	// current topic
	const current = { topic, fromMe: starts.get(topic.topicId), toMe: ends.get(topic.topicId), current: true };
	// compute pipelines from given topic to end
	const fromCurrent = computePipelinesFrom(topic, arranged, topics);

	console.log([ ...toCurrent, current, ...fromCurrent ]);

	return <PipelinesCanvasContainer>
		{/*{[ ...toCurrent, current ]}*/}
	</PipelinesCanvasContainer>;
};