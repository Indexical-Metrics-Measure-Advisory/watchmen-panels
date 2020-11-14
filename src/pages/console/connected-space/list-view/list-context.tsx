import { EventEmitter } from 'events';
import React, { useState } from 'react';
import { ViewType } from './types';

export enum ListEvent {
	VIEW_TYPE_CHANGED = 'view-type-changed'
}

export type ViewTypeChangedListener = (type: ViewType) => void;

export interface ListContext {
	viewTypeChanged: (type: ViewType) => void;
	addViewTypeChangedListener: (listener: ViewTypeChangedListener) => void;
	removeViewTypeChangedListener: (listener: ViewTypeChangedListener) => void;
}

const Context = React.createContext<ListContext>({} as ListContext);
Context.displayName = 'SpaceListContext';

export const ListContextProvider = (props: {
	children?: ((props: any) => React.ReactNode) | React.ReactNode;
}) => {
	const { children } = props;

	const [ emitter ] = useState(new EventEmitter());
	const [ context ] = useState<ListContext>({
		viewTypeChanged: (type: ViewType) => emitter.emit(ListEvent.VIEW_TYPE_CHANGED, type),
		addViewTypeChangedListener: (listener: ViewTypeChangedListener) => emitter.on(ListEvent.VIEW_TYPE_CHANGED, listener),
		removeViewTypeChangedListener: (listener: ViewTypeChangedListener) => emitter.off(ListEvent.VIEW_TYPE_CHANGED, listener)
	});

	return <Context.Provider value={context}>{children}</Context.Provider>;
};

export const useListView = () => {
	return React.useContext(Context);
};
