import { EventEmitter } from 'events';
import React, { useEffect, useState } from 'react';
import { PipelineFlow } from '../../../services/admin/pipeline-types';
import { listTopicsForPipeline } from '../../../services/admin/topic';
import { QueriedTopicForPipeline } from '../../../services/admin/types';

export enum PipelineEvent {
	TOPICS_CHANGED = 'topics-changed',

	FLOW_CHANGED = 'flow-changed',

	MENU_VISIBLE = 'menu-visible'
}

export type TopicsChangeListener = () => void;
export type FlowChangeListener = (topic: QueriedTopicForPipeline, flow: PipelineFlow) => void;
export type MenuVisibilityListener = (visible: boolean) => void;

export interface PipelineContextStore {
	topics: Array<QueriedTopicForPipeline>;

	flow?: PipelineFlow;
	topic?: QueriedTopicForPipeline;

	menuVisible: boolean;
	topicsLoadCompleted: boolean;
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

	const [ emitter ] = useState<EventEmitter>(new EventEmitter());
	const [ store ] = useState<PipelineContextStore>({
		topics: [],
		menuVisible: true,
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
		removeMenuVisibilityListener: (listener: MenuVisibilityListener) => emitter.off(PipelineEvent.MENU_VISIBLE, listener)
	}}>{children}</Context.Provider>;
};

export const usePipelineContext = () => {
	return React.useContext(Context);
};
