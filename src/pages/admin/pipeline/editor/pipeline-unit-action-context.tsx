import { EventEmitter } from 'events';
import React, { useState } from 'react';

export enum PipelineUnitActionEvent {
	TOPIC_CHANGED = 'topic-changed',
	FACTOR_CHANGED = 'factor-changed',
	FILTER_ADDED = 'filter-added',
	FILTER_REMOVED = 'filter-removed'
}

export type PropertyChangeListener = () => void;

export interface PipelineUnitActionContextUsable {
	firePropertyChange: (event: PipelineUnitActionEvent) => void;
	addPropertyChangeListener: (event: PipelineUnitActionEvent, listener: PropertyChangeListener) => void;
	removePropertyChangeListener: (event: PipelineUnitActionEvent, listener: PropertyChangeListener) => void;
}

export interface PipelineUnitActionContext extends PipelineUnitActionContextUsable {
}

const Context = React.createContext<PipelineUnitActionContext>({} as PipelineUnitActionContext);
Context.displayName = 'PipelineUnitActionContext';

export const PipelineUnitActionContextProvider = (props: {
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
		addPropertyChangeListener: (event: PipelineUnitActionEvent, listener) => emitter.on(event, listener),
		removePropertyChangeListener: (event: PipelineUnitActionEvent, listener) => emitter.off(event, listener)
	}}>{children}</Context.Provider>;
};

export const usePipelineUnitActionContext = () => {
	return React.useContext(Context);
};
