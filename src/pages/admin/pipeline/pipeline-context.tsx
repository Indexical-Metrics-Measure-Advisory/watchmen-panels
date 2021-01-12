import { EventEmitter } from 'events';
import React, { useEffect, useState } from 'react';
import { PipelineFlow } from '../../../services/admin/pipeline-types';
import { listTopicsForPipeline } from '../../../services/admin/topic';
import { QueriedTopicForPipeline } from '../../../services/admin/types';
import { ArrangedPipeline } from './types';

export enum PipelineEvent {
	TOPICS_CHANGED = 'topics-changed',

	FLOW_CHANGED = 'flow-changed',

	MENU_VISIBLE = 'menu-visible',
	CANVAS_VISIBLE = 'canvas-visible',
	TOPIC_SELECTION_CHANGED = 'topic-selection-changed',
	PIPELINE_SELECTION_CHANGED = 'pipeline-selection-changed',

	COLLAPSE_ALL_TOPICS = 'collapse-all-topics'
}

export type TopicsChangeListener = () => void;
export type FlowChangeListener = (topic: QueriedTopicForPipeline, flow: PipelineFlow) => void;
export type MenuVisibilityListener = (visible: boolean) => void;
export type CanvasVisibilityListener = (visible: boolean) => void;
export type TopicSelectionChangeListener = (topic?: QueriedTopicForPipeline) => void;
export type PipelineSelectionChangeListener = (pipeline?: ArrangedPipeline) => void;
export type CollapseAllTopicsListener = () => void;

export interface PipelineContextStore {
	topics: Array<QueriedTopicForPipeline>;

	flow?: PipelineFlow;
	topic?: QueriedTopicForPipeline;

	menuVisible: boolean;
	canvasVisible: boolean;
	topicsLoadCompleted: boolean;

	selectedTopic?: QueriedTopicForPipeline;
	selectedPipeline?: ArrangedPipeline;
}

export interface PipelineContextUsable {
	addTopicsChangedListener: (listener: TopicsChangeListener) => void;
	removeTopicsChangedListener: (listener: TopicsChangeListener) => void;

	changeFlow: (topic: QueriedTopicForPipeline, pipeline: PipelineFlow) => void;
	addFlowChangedListener: (listener: FlowChangeListener) => void;
	removeFlowChangedListener: (listener: FlowChangeListener) => void;

	changeMenuVisible: (visible: boolean) => void;
	addMenuVisibilityListener: (listener: MenuVisibilityListener) => void;
	removeMenuVisibilityListener: (listener: MenuVisibilityListener) => void;

	changeCanvasVisible: (visible: boolean) => void;
	addCanvasVisibilityListener: (listener: CanvasVisibilityListener) => void;
	removeCanvasVisibilityListener: (listener: CanvasVisibilityListener) => void;

	changeSelectedTopic: (topic?: QueriedTopicForPipeline) => void;
	addTopicSelectionChangedListener: (listener: TopicSelectionChangeListener) => void;
	removeTopicSelectionChangedListener: (listener: TopicSelectionChangeListener) => void;

	changeSelectedPipeline: (pipeline?: ArrangedPipeline) => void;
	addPipelineSelectionChangedListener: (listener: PipelineSelectionChangeListener) => void;
	removePipelineSelectionChangedListener: (listener: PipelineSelectionChangeListener) => void;

	collapseAllTopics: () => void;
	addCollapseAllTopicsListener: (listener: CollapseAllTopicsListener) => void;
	removeCollapseAllTopicsListener: (listener: CollapseAllTopicsListener) => void;
}

export interface PipelineContext extends PipelineContextUsable {
	store: PipelineContextStore;
}

const Context = React.createContext<PipelineContext>({} as PipelineContext);
Context.displayName = 'PipelineContext';

export const PipelineContextProvider = (props: {
	children?: ((props: any) => React.ReactNode) | React.ReactNode;
}) => {
	const { children } = props;

	const [ emitter ] = useState<EventEmitter>(() => {
		const emitter = new EventEmitter();
		emitter.setMaxListeners(1000);
		return emitter;
	});
	const [ store ] = useState<PipelineContextStore>({
		topics: [],
		menuVisible: true,
		canvasVisible: true,
		topicsLoadCompleted: false
	});

	useEffect(() => {
		(async () => {
			let pageNumber = 1;
			while (true) {
				const { data, completed } = await listTopicsForPipeline(pageNumber);
				store.topics = [ ...store.topics, ...data ]
					.sort((a, b) => {
						return a.name.toUpperCase().localeCompare(b.name.toUpperCase());
					});
				store.topicsLoadCompleted = completed;
				emitter.emit(PipelineEvent.TOPICS_CHANGED);
				if (completed) {
					break;
				}
				pageNumber++;
			}
		})();
	}, [ store, emitter ]);

	return <Context.Provider value={{
		store,

		addTopicsChangedListener: (listener: TopicsChangeListener) => emitter.on(PipelineEvent.TOPICS_CHANGED, listener),
		removeTopicsChangedListener: (listener: TopicsChangeListener) => emitter.off(PipelineEvent.TOPICS_CHANGED, listener),

		changeFlow: (topic: QueriedTopicForPipeline, flow: PipelineFlow) => {
			emitter.emit(PipelineEvent.FLOW_CHANGED, store.topic = topic, store.flow = flow);
		},
		addFlowChangedListener: (listener: FlowChangeListener) => emitter.on(PipelineEvent.FLOW_CHANGED, listener),
		removeFlowChangedListener: (listener: FlowChangeListener) => emitter.off(PipelineEvent.FLOW_CHANGED, listener),

		changeMenuVisible: (visible: boolean) => emitter.emit(PipelineEvent.MENU_VISIBLE, store.menuVisible = visible),
		addMenuVisibilityListener: (listener: MenuVisibilityListener) => emitter.on(PipelineEvent.MENU_VISIBLE, listener),
		removeMenuVisibilityListener: (listener: MenuVisibilityListener) => emitter.off(PipelineEvent.MENU_VISIBLE, listener),

		changeCanvasVisible: (visible: boolean) => emitter.emit(PipelineEvent.CANVAS_VISIBLE, store.canvasVisible = visible),
		addCanvasVisibilityListener: (listener: CanvasVisibilityListener) => emitter.on(PipelineEvent.CANVAS_VISIBLE, listener),
		removeCanvasVisibilityListener: (listener: CanvasVisibilityListener) => emitter.off(PipelineEvent.CANVAS_VISIBLE, listener),

		changeSelectedTopic: (topic?: QueriedTopicForPipeline) => {
			store.selectedTopic = topic;
			delete store.selectedPipeline;
			emitter.emit(PipelineEvent.TOPIC_SELECTION_CHANGED, topic);
		},
		addTopicSelectionChangedListener: (listener: TopicSelectionChangeListener) => emitter.on(PipelineEvent.TOPIC_SELECTION_CHANGED, listener),
		removeTopicSelectionChangedListener: (listener: TopicSelectionChangeListener) => emitter.off(PipelineEvent.TOPIC_SELECTION_CHANGED, listener),

		changeSelectedPipeline: (pipeline?: ArrangedPipeline) => {
			store.selectedPipeline = pipeline;
			emitter.emit(PipelineEvent.PIPELINE_SELECTION_CHANGED, pipeline);
		},
		addPipelineSelectionChangedListener: (listener: PipelineSelectionChangeListener) => emitter.on(PipelineEvent.PIPELINE_SELECTION_CHANGED, listener),
		removePipelineSelectionChangedListener: (listener: PipelineSelectionChangeListener) => emitter.off(PipelineEvent.PIPELINE_SELECTION_CHANGED, listener),

		collapseAllTopics: () => emitter.emit(PipelineEvent.COLLAPSE_ALL_TOPICS),
		addCollapseAllTopicsListener: (listener: CollapseAllTopicsListener) => emitter.on(PipelineEvent.COLLAPSE_ALL_TOPICS, listener),
		removeCollapseAllTopicsListener: (listener: CollapseAllTopicsListener) => emitter.off(PipelineEvent.COLLAPSE_ALL_TOPICS, listener)
	}}>{children}</Context.Provider>;
};

export const usePipelineContext = () => {
	return React.useContext(Context);
};
