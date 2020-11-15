import { EventEmitter } from 'events';
import React, { useReducer, useState } from 'react';
import { ConnectedConsoleSpace, ConsoleSpaceGroup, ConsoleSpaceSubject } from '../../../../services/console/types';
import { ViewType } from './types';

export enum ListViewEvent {
	COLLAPSED_CHANGED = 'collapsed-changed',
	FILTER_TEXT_CHANGED = 'filter-text-changed'
}

export type ToggleCollapsedListener = (collapsed: boolean) => void;
export type FilterTextChangedListener = (text: string) => void;

export interface ListContextStore {
	filter: string;
}

export interface ListContext {
	store: ListContextStore
	viewType: ViewType;
	setViewType: (viewType: ViewType) => void;
	toggleCollapsed: (collapsed: boolean) => void;
	addCollapsedChangedListener: (listener: ToggleCollapsedListener) => void;
	removeCollapsedChangedListener: (listener: ToggleCollapsedListener) => void;
	filterTextChanged: (text: string) => void;
	addFilterTextChangedListener: (listener: FilterTextChangedListener) => void;
	removeFilterTextChangedListener: (listener: FilterTextChangedListener) => void;
	groupDeleted: (options: { space: ConnectedConsoleSpace, group: ConsoleSpaceGroup }) => void;
	subjectDeleted: (options: { space: ConnectedConsoleSpace, group?: ConsoleSpaceGroup, subject: ConsoleSpaceSubject }) => void;
}

const Context = React.createContext<ListContext>({} as ListContext);
Context.displayName = 'SpaceListContext';

export const ListContextProvider = (props: {
	children?: ((props: any) => React.ReactNode) | React.ReactNode;
}) => {
	const { children } = props;

	const [ emitter ] = useState(new EventEmitter());
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);
	const [ store ] = useState<ListContextStore>({ filter: '' });
	const [ viewType, setViewType ] = useState<ViewType>(ViewType.BY_GROUP);
	const [ functions ] = useState({
		toggleCollapsed: (collapsed: boolean) => emitter.emit(ListViewEvent.COLLAPSED_CHANGED, collapsed),
		addCollapsedChangedListener: (listener: ToggleCollapsedListener) => emitter.on(ListViewEvent.COLLAPSED_CHANGED, listener),
		removeCollapsedChangedListener: (listener: ToggleCollapsedListener) => emitter.off(ListViewEvent.COLLAPSED_CHANGED, listener),
		filterTextChanged: (text: string) => {
			const newFilter = (text || '').trim();
			if (store.filter !== newFilter) {
				store.filter = newFilter;
				emitter.emit(ListViewEvent.FILTER_TEXT_CHANGED, newFilter);
			}
		},
		addFilterTextChangedListener: (listener: FilterTextChangedListener) => emitter.on(ListViewEvent.FILTER_TEXT_CHANGED, listener),
		removeFilterTextChangedListener: (listener: FilterTextChangedListener) => emitter.off(ListViewEvent.FILTER_TEXT_CHANGED, listener),
		groupDeleted: (options: { space: ConnectedConsoleSpace, group: ConsoleSpaceGroup }) => forceUpdate(),
		subjectDeleted: (options: { space: ConnectedConsoleSpace, group?: ConsoleSpaceGroup, subject: ConsoleSpaceSubject }) => forceUpdate()
	});

	return <Context.Provider value={{
		store,
		viewType, setViewType,
		...functions
	}}>{children}</Context.Provider>;
};

export const useListView = () => {
	return React.useContext(Context);
};
