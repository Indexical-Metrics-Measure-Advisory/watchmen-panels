import { EventEmitter } from 'events';
import React, { useState } from 'react';

export enum DataSetTableEvent {
	SELECTION_CHANGED = 'selection-changed',
	FIX_COLUMN_CHANGED = 'fix-column-changed'
}

export type SelectionChangeListener = (inFixTable: boolean, rowIndex: number, columnIndex: number) => void;
export type FixColumnChangeListener = (fix: boolean, columnIndex: number) => void;

export interface DataSetTableContext {
	selectionChange: (inFixTable: boolean, rowIndex: number, columnIndex: number) => void;
	addSelectionChangeListener: (listener: SelectionChangeListener) => void;
	removeSelectionChangeListener: (listener: SelectionChangeListener) => void;

	fixColumnChange: (fix: boolean, columnCount: number) => void;
	addFixColumnChangeListener: (listener: FixColumnChangeListener) => void;
	removeFixColumnChangeListener: (listener: FixColumnChangeListener) => void;
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
		removeSelectionChangeListener: (listener: SelectionChangeListener) => emitter.off(DataSetTableEvent.SELECTION_CHANGED, listener),

		fixColumnChange: (fix: boolean, columnCount: number) => emitter.emit(DataSetTableEvent.FIX_COLUMN_CHANGED, fix, columnCount),
		addFixColumnChangeListener: (listener: FixColumnChangeListener) => emitter.on(DataSetTableEvent.FIX_COLUMN_CHANGED, listener),
		removeFixColumnChangeListener: (listener: FixColumnChangeListener) => emitter.off(DataSetTableEvent.FIX_COLUMN_CHANGED, listener)
	}}>{children}</Context.Provider>;
};

export const useDataSetTableContext = () => {
	return React.useContext(Context);
};
