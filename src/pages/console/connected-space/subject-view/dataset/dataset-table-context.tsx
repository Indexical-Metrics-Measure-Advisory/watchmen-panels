import { EventEmitter } from 'events';
import React, { useState } from 'react';

export enum DataSetTableEvent {
	SELECTION_CHANGED = 'selection-changed',
}

export type SelectionChangeListener = (inFixTable: boolean, rowIndex: number, columnIndex: number) => void;

export interface DataSetTableContext {
	selectionChange: (inFixTable: boolean, rowIndex: number, columnIndex: number) => void;
	addSelectionChangeListener: (listener: SelectionChangeListener) => void;
	removeSelectionChangeListener: (listener: SelectionChangeListener) => void;
}

const Context = React.createContext<DataSetTableContext>({} as DataSetTableContext);
Context.displayName = 'DataSetTableContext';

export const DataSetTableContextProvider = (props: {
	children?: ((props: any) => React.ReactNode) | React.ReactNode;
}) => {
	const { children } = props;

	const [ emitter ] = useState(new EventEmitter());

	return <Context.Provider value={{
		selectionChange: (inFixTable: boolean, rowIndex: number, columnIndex: number) => emitter.emit(DataSetTableEvent.SELECTION_CHANGED, inFixTable, rowIndex, columnIndex),
		addSelectionChangeListener: (listener: SelectionChangeListener) => emitter.on(DataSetTableEvent.SELECTION_CHANGED, listener),
		removeSelectionChangeListener: (listener: SelectionChangeListener) => emitter.off(DataSetTableEvent.SELECTION_CHANGED, listener)
	}}>{children}</Context.Provider>;
};

export const useDataSetTableContext = () => {
	return React.useContext(Context);
};
