import { QueriedTopicForPipeline, TopicType } from '../../../services/admin/types';
import { ArrangedPipeline, ArrangedPipelines, PipelinesTopicNode } from './types';

const computePipelines = (options: {
	target: QueriedTopicForPipeline;
	arranged: ArrangedPipelines;
	allTopics: Map<string, QueriedTopicForPipeline>;
	findPipelines: (topicId: string) => Array<ArrangedPipeline> | undefined;
	getNextTopicId: (pipeline: ArrangedPipeline) => string;
}) => {
	const { target: { topicId }, arranged: { starts, ends }, allTopics, findPipelines, getNextTopicId } = options;

	const nodes = [];
	let targetTopicId = topicId;
	while (targetTopicId) {
		const pipelines = findPipelines(targetTopicId);
		// console.log(targetTopicId, pipelines);
		if (!pipelines || pipelines.length === 0) {
			// reaches start, no pipeline to me
			break;
		}

		const votedPipeline = pipelines[0];
		const topicId = getNextTopicId(votedPipeline);
		// create a wrapper topic only if topic is not loaded yet
		const topic = allTopics.get(topicId) || {
			topicId,
			code: topicId,
			name: topicId,
			type: TopicType.NOT_DEFINED,
			factors: []
		};
		const node = { topic, fromMe: starts.get(topicId), toMe: ends.get(topicId), use: votedPipeline };
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
		findPipelines: topicId => arranged.ends.get(topicId),
		getNextTopicId: pipeline => pipeline.topicId
	});
};
const computePipelinesFrom = (target: QueriedTopicForPipeline, arranged: ArrangedPipelines, topics: Map<string, QueriedTopicForPipeline>) => {
	return computePipelines({
		target,
		arranged,
		allTopics: topics,
		findPipelines: topicId => arranged.starts.get(topicId),
		getNextTopicId: pipeline => pipeline.targetTopicIds[0]
	});
};

export const buildPipelines = (options: {
	topic?: QueriedTopicForPipeline;
	arranged: ArrangedPipelines;
	topics: Map<string, QueriedTopicForPipeline>;
}): Array<PipelinesTopicNode> => {
	const { topic, arranged, topics } = options;
	if (!topic) {
		return [];
	}

	const { starts, ends } = arranged;

	// compute pipelines from root to given topic
	const toCurrent = computePipelinesTo(topic, arranged, topics).reverse();
	// current topic
	const current = { topic, fromMe: starts.get(topic.topicId), toMe: ends.get(topic.topicId), current: true };
	// compute pipelines from given topic to end
	const fromCurrent = computePipelinesFrom(topic, arranged, topics);

	return [
		...toCurrent.map(node => ({ ...node, toNext: node.use })),
		{ ...current, toNext: fromCurrent[0] ? fromCurrent[0].use : (void 0) },
		...fromCurrent.map((node, index, nodes) => ({
			...node,
			toNext: nodes[index + 1] ? nodes[index + 1].use : (void 0)
		}))
	].map((node, index, nodes) => {
		return {
			...node,
			previous: index !== 0 ? nodes[index - 1].topic : (void 0),
			next: index !== nodes.length - 1 ? nodes[index + 1].topic : (void 0)
		};
	});
};
