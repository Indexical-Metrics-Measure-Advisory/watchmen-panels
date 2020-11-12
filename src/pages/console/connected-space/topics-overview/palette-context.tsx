import { EventEmitter } from 'events';
import React, { useState } from 'react';
import { ConnectedConsoleSpace, ConsoleTopic } from '../../../../services/console/types';

export enum PaletteEvent {
	TOPIC_INIT_PAINTED = 'topic-painted',
	TOPIC_ALL_PAINTED = 'topic-all-painted'
}

type Listener = () => void;
export type TopicPaintedListener = (topic: ConsoleTopic) => void;
export type TopicAllPaintedListener = () => void;

export interface PaletteContext {
	on: ((event: PaletteEvent.TOPIC_INIT_PAINTED, listener: TopicPaintedListener) => void)
		| ((event: PaletteEvent.TOPIC_ALL_PAINTED, listener: TopicAllPaintedListener) => void);
	emit: ((event: PaletteEvent.TOPIC_INIT_PAINTED, topic: ConsoleTopic) => void)
		| ((event: PaletteEvent.TOPIC_ALL_PAINTED) => void);
	off: ((event: PaletteEvent.TOPIC_INIT_PAINTED, listener: TopicPaintedListener) => void)
		| ((event: PaletteEvent.TOPIC_ALL_PAINTED, listener: TopicAllPaintedListener) => void);
}

const Context = React.createContext<PaletteContext>({} as PaletteContext);
Context.displayName = 'PaletteContext';

export const PaletteContextProvider = (props: {
	space: ConnectedConsoleSpace;
	children?: ((props: any) => React.ReactNode) | React.ReactNode;
}) => {
	const { space, children } = props;

	const [ emitter ] = useState(new EventEmitter());
	const [ context ] = useState<PaletteContext>({
		on: (event: PaletteEvent, listener: Listener) => emitter.on(event, listener),
		off: (event: PaletteEvent, listener: Listener) => emitter.off(event, listener),
		emit: (event: PaletteEvent, ...args: Array<any>) => emitter.emit(event, args)
	});

	return <Context.Provider value={context}>{children}</Context.Provider>;
};

export const usePalette = () => {
	return React.useContext(Context);
};
