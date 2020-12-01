import { EventEmitter } from 'events';
import React, { useState } from 'react';
import { QueriedFactorForPipeline, QueriedTopicForPipeline } from '../../../services/admin/types';

export enum PipelineEvent {
	TOPIC_CHANGED = 'topic-changed',
	FACTOR_CHANGED = 'factor-changed',
}

export type TopicChangeListener = (topic: QueriedTopicForPipeline) => void;
export type FactorChangeListener = (factor: QueriedFactorForPipeline) => void;

export interface PipelineContextStore {
	topic?: QueriedTopicForPipeline;
	factor?: QueriedFactorForPipeline;
}

export interface PipelineContextUsable {
	changeTopic: (topic: QueriedTopicForPipeline) => void;
	addTopicChangedListener: (listener: TopicChangeListener) => void;
	removeTopicChangedListener: (listener: TopicChangeListener) => void;

	changeFactor: (factor: QueriedFactorForPipeline) => void;
	addFactorChangedListener: (listener: FactorChangeListener) => void;
	removeFactorChangedListener: (listener: FactorChangeListener) => void;
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
	const [ store ] = useState<PipelineContextStore>({} as PipelineContextStore);

	const changeTopic = (topic: QueriedTopicForPipeline) => {
		store.topic = topic;
		emitter.emit(PipelineEvent.TOPIC_CHANGED, topic);
	};
	const addTopicChangedListener = (listener: TopicChangeListener) => emitter.on(PipelineEvent.TOPIC_CHANGED, listener);
	const removeTopicChangedListener = (listener: TopicChangeListener) => emitter.off(PipelineEvent.TOPIC_CHANGED, listener);

	const changeFactor = (factor: QueriedFactorForPipeline) => {
		store.factor = factor;
		emitter.emit(PipelineEvent.FACTOR_CHANGED, factor);
	};
	const addFactorChangedListener = (listener: FactorChangeListener) => emitter.on(PipelineEvent.FACTOR_CHANGED, listener);
	const removeFactorChangedListener = (listener: FactorChangeListener) => emitter.off(PipelineEvent.FACTOR_CHANGED, listener);

	return <Context.Provider value={{
		store,

		changeTopic, addTopicChangedListener, removeTopicChangedListener,
		changeFactor, addFactorChangedListener, removeFactorChangedListener
	}}>{children}</Context.Provider>;
};

export const usePipelineContext = () => {
	return React.useContext(Context);
};
