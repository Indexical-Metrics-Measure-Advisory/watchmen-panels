import { EventEmitter } from 'events';
import React, { useState } from 'react';
import { QueriedFactorForPipeline, QueriedTopicForPipeline } from '../../../services/admin/types';
import { Direction } from './types';

export enum PipelineEvent {
	TOPIC_CHANGED = 'topic-changed',
	FACTOR_CHANGED = 'factor-changed',
	DIRECTION_CHANGED = 'direction-changed'
}

export type TopicChangeListener = (topic: QueriedTopicForPipeline) => void;

export interface PipelineContextStore {
	topic?: QueriedTopicForPipeline;
	factor?: QueriedFactorForPipeline;
	direction?: Direction;
}

export interface PipelineContextUsable {
	changeTopic: (topic: QueriedTopicForPipeline) => void;
	addTopicChangedListener: (listener: TopicChangeListener) => void;
	removeTopicChangedListener: (listener: TopicChangeListener) => void;
	changeFactor: (factor: QueriedFactorForPipeline) => void;
	changeDirection: (direction: Direction) => void;
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
	const changeDirection = (direction: Direction) => {
		store.direction = direction;
		emitter.emit(PipelineEvent.DIRECTION_CHANGED, direction);
	};

	return <Context.Provider value={{
		store,

		changeTopic, addTopicChangedListener, removeTopicChangedListener,
		changeFactor, changeDirection
	}}>{children}</Context.Provider>;
};

export const usePipelineContext = () => {
	return React.useContext(Context);
};
