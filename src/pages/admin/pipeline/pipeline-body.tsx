import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { v4 } from 'uuid';
import {
	PipelineFlow,
	UnitAction,
	UnitActionWriteTopic,
	WriteTopicActionType
} from '../../../services/admin/pipeline-types';
import { QueriedTopicForPipeline } from '../../../services/admin/types';
import { PipelineCanvas } from './pipeline-canvas';
import { usePipelineContext } from './pipeline-context';
import { PipelineEditor } from './pipeline-editor';
import { buildPipelines } from './pipelines-builder';
import { ArrangedPipeline, ArrangedPipelines } from './types';

const Body = styled.div.attrs({
	'data-widget': 'console-pipeline-body'
})`
	display: flex;
	position: relative;
	align-self: stretch;
	overflow: hidden;
`;
const WaitData = styled.div`
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

const isWriteTopicAction = (action: UnitAction): action is UnitActionWriteTopic => {
	// @ts-ignore
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
	const sourceMap = new Map<string, Array<ArrangedPipeline>>();
	const targetMap = new Map<string, Array<ArrangedPipeline>>();
	[ flow.consume, flow.produce ].forEach(pipelines => pipelines.forEach(pipeline => {
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

		const arrangedPipeline: ArrangedPipeline = {
			...pipeline,
			stages: pipeline.stages.map(stage => {
				return {
					uuid: v4(),
					...stage,
					units: stage.units.map(unit => {
						return {
							uuid: v4(),
							...unit,
							do: unit.do.map(action => {
								return {
									uuid: v4(),
									...action
								};
							})
						};
					})
				};
			}),
			targetTopicIds: [ ...new Set<string>(targetTopicIds) ],
			origin: pipeline,
			uuid: v4()
		};

		// take care of source from
		const startsFrom = getOrCreateFromMap(topicId, sourceMap);
		if (startsFrom.findIndex(pipeline => arrangedPipeline.origin === pipeline.origin) === -1) {
			startsFrom.push(arrangedPipeline);
		}
		// take care of target to
		arrangedPipeline.targetTopicIds.forEach(targetTopicId => {
			const endsTo = getOrCreateFromMap(targetTopicId, targetMap);
			if (endsTo.findIndex(pipeline => arrangedPipeline.origin === pipeline.origin) === -1) {
				endsTo.push(arrangedPipeline);
			}
		});
	}));
	return { starts: sourceMap, ends: targetMap };
};

export const PipelineBody = () => {
	const {
		store: { topics, topic, flow, selectedTopic },
		changeSelectedTopic,
		addFlowChangedListener, removeFlowChangedListener
	} = usePipelineContext();
	const [ ordered, setOrdered ] = useState(false);
	const [ arranged, setArranged ] = useState<ArrangedPipelines>({ starts: new Map(), ends: new Map() });
	useEffect(() => {
		const onFlowChanged = () => {
			// clear selected topic, arranged pipelines
			// set ordered to false to trigger repaint
			changeSelectedTopic();
			setArranged({ starts: new Map(), ends: new Map() });
			setOrdered(false);
		};
		addFlowChangedListener(onFlowChanged);
		return () => removeFlowChangedListener(onFlowChanged);
	});
	useEffect(() => {
		if (flow && topic) {
			setArranged(arrangeFlow(flow));
			setOrdered(true);
			// select the given topic when there is no selected
			if (!selectedTopic) {
				changeSelectedTopic(topic);
			}
		}
	}, [ topic, topics, flow, selectedTopic, changeSelectedTopic ]);

	const topicMap = topics.reduce((map, topic) => map.set(topic.topicId, topic),
		new Map<string, QueriedTopicForPipeline>());
	const nodes = buildPipelines({ topic, arranged, topics: topicMap });

	return <Body>
		<PipelineCanvas topic={topic} nodes={nodes} visible={ordered}/>
		<PipelineEditor nodes={nodes} visible={ordered}/>
		<WaitData data-visible={flow == null}>Pick a topic please.</WaitData>
		<WaitData data-visible={flow != null && !ordered}>Arrange pipelines...</WaitData>
	</Body>;
};