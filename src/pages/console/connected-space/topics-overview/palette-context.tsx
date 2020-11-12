import { EventEmitter } from 'events';
import React, { useState } from 'react';
import { TopicGraphics, TopicSelectionGraphics } from './types';

export enum PaletteEvent {
	TOPIC_MOVE = 'topic-move',
	TOPIC_SELECTION_CHANGE = 'topic-selection-change'
}

export type TopicMovedListener = (topic: TopicGraphics) => void;
export type TopicSelectionChangedListener = (topicSelection: TopicSelectionGraphics) => void;

export interface PaletteContext {
	topicMoved: (topic: TopicGraphics) => void;
	addTopicMovedListener: (listener: TopicMovedListener) => void;
	removeTopicMovedListener: (listener: TopicMovedListener) => void;
	topicSelectionChanged: (topicSelection: TopicSelectionGraphics) => void;
	addTopicSelectionChangedListener: (listener: TopicSelectionChangedListener) => void;
	removeTopicSelectionChangedListener: (listener: TopicSelectionChangedListener) => void;
}

const Context = React.createContext<PaletteContext>({} as PaletteContext);
Context.displayName = 'PaletteContext';

export const PaletteContextProvider = (props: {
	children?: ((props: any) => React.ReactNode) | React.ReactNode;
}) => {
	const { children } = props;

	const [ emitter ] = useState(new EventEmitter());
	const [ context ] = useState<PaletteContext>({
		topicMoved: (topic: TopicGraphics) => emitter.emit(PaletteEvent.TOPIC_MOVE, topic),
		addTopicMovedListener: (listener: TopicMovedListener) => {
			emitter.on(PaletteEvent.TOPIC_MOVE, listener);
		},
		removeTopicMovedListener: (listener: TopicMovedListener) => {
			emitter.off(PaletteEvent.TOPIC_MOVE, listener);
		},
		topicSelectionChanged: (topicSelection: TopicSelectionGraphics) => emitter.emit(PaletteEvent.TOPIC_SELECTION_CHANGE, topicSelection),
		addTopicSelectionChangedListener: (listener: TopicSelectionChangedListener) => {
			emitter.on(PaletteEvent.TOPIC_SELECTION_CHANGE, listener);
		},
		removeTopicSelectionChangedListener: (listener: TopicSelectionChangedListener) => {
			emitter.off(PaletteEvent.TOPIC_SELECTION_CHANGE, listener);
		}
	});

	return <Context.Provider value={context}>{children}</Context.Provider>;
};

export const usePalette = () => {
	return React.useContext(Context);
};
