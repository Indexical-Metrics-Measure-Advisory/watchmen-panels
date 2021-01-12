import { EventEmitter } from 'events';
import React, { useState } from 'react';
import { PipelineUnitActionEvent, usePipelineUnitActionContext } from './pipeline-unit-action-context';

export enum PipelineUnitActionMappingEvent {
	FROM_CHANGED = 'from-changed',
	TO_CHANGED = 'to-changed'
}

export type PropertyChangeListener = () => void;

export interface PipelineUnitActionMappingContextUsable {
	firePropertyChange: (event: PipelineUnitActionMappingEvent) => void;
	addPropertyChangeListener: (event: PipelineUnitActionMappingEvent, listener: PropertyChangeListener) => void;
	removePropertyChangeListener: (event: PipelineUnitActionMappingEvent, listener: PropertyChangeListener) => void;
}

export interface PipelineUnitActionMappingContext extends PipelineUnitActionMappingContextUsable {
}

const Context = React.createContext<PipelineUnitActionMappingContext>({} as PipelineUnitActionMappingContext);
Context.displayName = 'PipelineUnitActionMappingContext';

export const PipelineUnitActionMappingContextProvider = (props: {
	children?: ((props: any) => React.ReactNode) | React.ReactNode;
}) => {
	const { children } = props;

	const { firePropertyChange } = usePipelineUnitActionContext();
	const [ emitter ] = useState<EventEmitter>(() => {
		const emitter = new EventEmitter();
		emitter.setMaxListeners(1000);
		return emitter;
	});

	return <Context.Provider value={{
		firePropertyChange: (event) => {
			emitter.emit(event);
			firePropertyChange(PipelineUnitActionEvent.MAPPING_CHANGED);
		},
		addPropertyChangeListener: (event, listener) => emitter.on(event, listener),
		removePropertyChangeListener: (event, listener) => emitter.off(event, listener)
	}}>{children}</Context.Provider>;
};

export const usePipelineUnitActionMappingContext = () => {
	return React.useContext(Context);
};
