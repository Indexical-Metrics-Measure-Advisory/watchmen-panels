import { EventEmitter } from 'events';
import React, { useState } from 'react';
import { GraphicsTopic } from './types';

export enum PaletteEvent {
	TOPIC_MOVE = 'topic-move'
}

export type TopicMovedListener = (topic: GraphicsTopic) => void;

export interface PaletteContext {
	topicMoved: (topic: GraphicsTopic) => void;
	addTopicMovedListener: (listener: TopicMovedListener) => void;
	removeTopicMovedListener: (listener: TopicMovedListener) => void;
}

const Context = React.createContext<PaletteContext>({} as PaletteContext);
Context.displayName = 'PaletteContext';

export const PaletteContextProvider = (props: {
	children?: ((props: any) => React.ReactNode) | React.ReactNode;
}) => {
	const { children } = props;

	const [ emitter ] = useState(new EventEmitter());
	const [ context ] = useState<PaletteContext>({
		topicMoved: (topic: GraphicsTopic) => emitter.emit(PaletteEvent.TOPIC_MOVE, topic),
		addTopicMovedListener: (listener: TopicMovedListener) => {
			emitter.on(PaletteEvent.TOPIC_MOVE, listener);
		},
		removeTopicMovedListener: (listener: TopicMovedListener) => {
			emitter.off(PaletteEvent.TOPIC_MOVE, listener);
		}
	});

	return <Context.Provider value={context}>{children}</Context.Provider>;
};

export const usePalette = () => {
	return React.useContext(Context);
};
