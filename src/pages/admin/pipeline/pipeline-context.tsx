import { EventEmitter } from 'events';
import React, { useEffect, useState } from 'react';
import { listTopicsForPipeline } from '../../../services/admin/topic';
import { Pipeline, QueriedTopicForPipeline } from '../../../services/admin/types';

export enum PipelineEvent {
	TOPICS_CHANGED = 'topics-changed',

	PIPELINE_CHANGED = 'pipeline-changed',

	MENU_VISIBLE = 'menu-visible'
}

export type TopicsChangeListener = () => void;
export type PipelineChangeListener = (topic: QueriedTopicForPipeline, pipeline: Pipeline) => void;
export type MenuVisibilityListener = (visible: boolean) => void;

export interface PipelineContextStore {
	topics: Array<QueriedTopicForPipeline>;

	pipeline?: Pipeline;
	topic?: QueriedTopicForPipeline;

	menuVisible: boolean;
	topicsLoadCompleted: boolean;
}

export interface PipelineContextUsable {
	addTopicsChangedListener: (listener: TopicsChangeListener) => void;
	removeTopicsChangedListener: (listener: TopicsChangeListener) => void;

	changePipeline: (topic: QueriedTopicForPipeline, pipeline: Pipeline) => void;
	addPipelineChangedListener: (listener: PipelineChangeListener) => void;
	removePipelineChangedListener: (listener: PipelineChangeListener) => void;

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

		changePipeline: (topic: QueriedTopicForPipeline, pipeline: Pipeline) => emitter.emit(PipelineEvent.PIPELINE_CHANGED, store.topic = topic, store.pipeline = pipeline),
		addPipelineChangedListener: (listener: PipelineChangeListener) => emitter.on(PipelineEvent.PIPELINE_CHANGED, listener),
		removePipelineChangedListener: (listener: PipelineChangeListener) => emitter.off(PipelineEvent.PIPELINE_CHANGED, listener),

		changeMenuVisible: (visible: boolean) => emitter.emit(PipelineEvent.MENU_VISIBLE, store.menuVisible = visible),
		addMenuVisibilityListener: (listener: MenuVisibilityListener) => emitter.on(PipelineEvent.MENU_VISIBLE, listener),
		removeMenuVisibilityListener: (listener: MenuVisibilityListener) => emitter.off(PipelineEvent.MENU_VISIBLE, listener)
	}}>{children}</Context.Provider>;
};

export const usePipelineContext = () => {
	return React.useContext(Context);
};
