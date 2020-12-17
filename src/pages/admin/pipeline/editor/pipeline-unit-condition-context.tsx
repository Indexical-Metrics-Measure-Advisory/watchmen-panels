import { EventEmitter } from 'events';
import React, { useState } from 'react';

export enum PipelineUnitConditionEvent {
	// TOPIC_CHANGED = 'topic-changed',
	// FACTOR_CHANGED = 'factor-changed',
	FILTER_ADDED = 'filter-added',
	FILTER_REMOVED = 'filter-removed',
	FILTER_CHANGED = 'filter-changed',
	FILTER_INDENT = 'filter-indent',
	FILTER_OUTDENT = 'filter-outdent'
}

export type PropertyChangeListener = () => void;

export interface PipelineUnitConditionContextUsable {
	firePropertyChange: (event: PipelineUnitConditionEvent) => void;
	addPropertyChangeListener: (event: PipelineUnitConditionEvent, listener: PropertyChangeListener) => void;
	removePropertyChangeListener: (event: PipelineUnitConditionEvent, listener: PropertyChangeListener) => void;
}

export interface PipelineUnitConditionContext extends PipelineUnitConditionContextUsable {
}

const Context = React.createContext<PipelineUnitConditionContext>({} as PipelineUnitConditionContext);
Context.displayName = 'PipelineUnitConditionContext';

export const PipelineUnitConditionContextProvider = (props: {
	children?: ((props: any) => React.ReactNode) | React.ReactNode;
}) => {
	const { children } = props;

	const [ emitter ] = useState<EventEmitter>(() => {
		const emitter = new EventEmitter();
		emitter.setMaxListeners(1000);
		return emitter;
	});

	return <Context.Provider value={{
		firePropertyChange: (event) => emitter.emit(event),
		addPropertyChangeListener: (event, listener) => emitter.on(event, listener),
		removePropertyChangeListener: (event, listener) => emitter.off(event, listener)
	}}>{children}</Context.Provider>;
};

export const usePipelineUnitConditionContext = () => {
	return React.useContext(Context);
};
