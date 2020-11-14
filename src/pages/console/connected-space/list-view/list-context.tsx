import { EventEmitter } from 'events';
import React, { useState } from 'react';
import { ViewType } from './types';

export enum ListViewEvent {
	COLLAPSED_CHANGED = 'collapsed-changed',
	FILTER_TEXT_CHANGED = 'filter-text-changed'
}

export type ToggleCollapsedListener = (collapsed: boolean) => void;
export type FilterTextChangedListener = (text: string) => void;

export interface ListContext {
	viewType: ViewType;
	setViewType: (viewType: ViewType) => void;
	toggleCollapsed: (collapsed: boolean) => void;
	addCollapsedChangedListener: (listener: ToggleCollapsedListener) => void;
	removeCollapsedChangedListener: (listener: ToggleCollapsedListener) => void;
	filterTextChanged: (text: string) => void;
	addFilterTextChangedListener: (listener: FilterTextChangedListener) => void;
	removeFilterTextChangedListener: (listener: FilterTextChangedListener) => void;
}

const Context = React.createContext<ListContext>({} as ListContext);
Context.displayName = 'SpaceListContext';

export const ListContextProvider = (props: {
	children?: ((props: any) => React.ReactNode) | React.ReactNode;
}) => {
	const { children } = props;

	const [ emitter ] = useState(new EventEmitter());
	const [ viewType, setViewType ] = useState<ViewType>(ViewType.BY_GROUP);
	const [ functions ] = useState({
		toggleCollapsed: (collapsed: boolean) => emitter.emit(ListViewEvent.COLLAPSED_CHANGED, collapsed),
		addCollapsedChangedListener: (listener: ToggleCollapsedListener) => emitter.on(ListViewEvent.COLLAPSED_CHANGED, listener),
		removeCollapsedChangedListener: (listener: ToggleCollapsedListener) => emitter.off(ListViewEvent.COLLAPSED_CHANGED, listener),
		filterTextChanged: (text: string) => emitter.emit(ListViewEvent.FILTER_TEXT_CHANGED, text),
		addFilterTextChangedListener: (listener: FilterTextChangedListener) => emitter.on(ListViewEvent.FILTER_TEXT_CHANGED, listener),
		removeFilterTextChangedListener: (listener: FilterTextChangedListener) => emitter.off(ListViewEvent.FILTER_TEXT_CHANGED, listener)
	});

	return <Context.Provider value={{
		viewType, setViewType,
		...functions
	}}>{children}</Context.Provider>;
};

export const useListView = () => {
	return React.useContext(Context);
};
