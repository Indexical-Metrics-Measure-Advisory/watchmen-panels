import React, { useEffect, useReducer, useState } from 'react';
import styled from 'styled-components';
import { v4 } from 'uuid';
import {
	Pipeline,
	PipelineFlow,
	UnitAction,
	WriteTopic,
	WriteTopicActionType
} from '../../../services/admin/pipeline-types';
import { QueriedTopicForPipeline } from '../../../services/admin/types';
import { usePipelineContext } from './pipeline-context';

const Body = styled.div.attrs({
	'data-widget': 'console-pipeline-body'
})`
	display: flex;
	position: relative;
`;
const Ordering = styled.div`
	display: flex;
	position: absolute;
	width: 100%;
	height: 100%;
	align-items: center;
	justify-content: center;
	font-family: var(--console-title-font-family);
	font-size: 3em;
	opacity: 0;
	pointer-events: none;
	transition: opacity 300ms ease-in-out;
	&[data-visible=true] {
		opacity: 0.3;
		pointer-events: auto;
	}
`;

interface WellKnownPipeline extends Pipeline {
	targetTopicIds: Array<string>;
	origin: Pipeline;
}

interface ArrangedPipelines {
	starts: Map<string, Array<WellKnownPipeline>>;
	ends: Map<string, Array<WellKnownPipeline>>;
}

const isWriteTopicAction = (action: UnitAction): action is WriteTopic => {
	return !!action.type && Object.values(WriteTopicActionType).includes(action.type);
};
const getOrCreateFromMap = <T extends any>(key: string, map: Map<string, Array<T>>) => {
	let array = map.get(key);
	if (!array) {
		array = [];
		map.set(key, array);
	}
	return array;
};
const arrangeFlow = (flow: PipelineFlow): ArrangedPipelines => {
	// key is topic, value is pipeline array which triggered by this topic
	const sourceMap = new Map<string, Array<WellKnownPipeline>>();
	const targetMap = new Map<string, Array<WellKnownPipeline>>();
	flow.consume.forEach(pipeline => {
		const { topicId, stages } = pipeline;

		// compute targets of given pipeline's
		const targetTopicIds = stages.map(({ units }) => {
			return units.map(({ do: actions }) => {
				return actions.map(action => {
					if (isWriteTopicAction(action)) {
						// pipeline writes data to topic
						return action.topicId;
					}
					return null;
				}).flat().filter(x => x);
			}).flat();
		}).flat() as Array<string>;

		const wellKnown: WellKnownPipeline = {
			...pipeline,
			targetTopicIds: [ ...new Set<string>(targetTopicIds) ],
			origin: pipeline
		};

		// take care of source from
		const startsFrom = getOrCreateFromMap(topicId, sourceMap);
		if (startsFrom.findIndex(pipeline => wellKnown.origin === pipeline.origin) === -1) {
			startsFrom.push(wellKnown);
		}
		// take care of target to
		wellKnown.targetTopicIds.forEach(targetTopicId => {
			const endsTo = getOrCreateFromMap(targetTopicId, targetMap);
			if (endsTo.findIndex(pipeline => wellKnown.origin === pipeline.origin) === -1) {
				endsTo.push(wellKnown);
			}
		});
	});
	return { starts: sourceMap, ends: targetMap };
};

const Pipelines = (props: {
	topic?: QueriedTopicForPipeline;
	topics: Map<string, QueriedTopicForPipeline>;
	arranged: ArrangedPipelines;
	visible: boolean;
}) => {
	const { topic, topics, arranged: { starts, ends }, visible } = props;

	if (!visible) {
		return null;
	}

	const nodes: Array<JSX.Element> = [];

	// compute pipelines from root to given topic
	let targetTopicId = topic?.topicId;
	while (targetTopicId) {
		const pipelines = ends.get(targetTopicId);
		if (!pipelines || pipelines.length === 0) {
			// reach start
			break;
		}

		const pipeline = pipelines[0];
		const { topicId: sourceTopicId } = pipeline;
		const topic = topics.get(pipeline.topicId) || { topicId: sourceTopicId, name: sourceTopicId };
		const node = <div key={v4()}>
			<div>{topic.name}</div>
			<span>{pipelines.length - 1}</span>
		</div>;
		nodes.unshift(node);
		// move backward, target is me
		targetTopicId = sourceTopicId;
	}

	return <div>
		{nodes}
	</div>;
};

export const PipelineBody = () => {
	const {
		store: { topics, topic, flow },
		addFlowChangedListener,
		removeFlowChangedListener
	} = usePipelineContext();
	const [ ordered, setOrdered ] = useState(false);
	const [ arranged, setArranged ] = useState<ArrangedPipelines>({ starts: new Map(), ends: new Map() });
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);
	useEffect(() => {
		addFlowChangedListener(forceUpdate);
		return () => removeFlowChangedListener(forceUpdate);
	});
	useEffect(() => {
		if (flow && topic) {
			setArranged(arrangeFlow(flow));
			setOrdered(true);
		}
	}, [ topic, topics, flow ]);

	const topicMap = topics.reduce((map, topic) => map.set(topic.topicId, topic),
		new Map<string, QueriedTopicForPipeline>());

	return <Body>
		<Pipelines topic={topic} topics={topicMap} arranged={arranged} visible={ordered}/>
		<Ordering data-visible={flow != null && !ordered}>Arrange pipelines...</Ordering>
	</Body>;
};