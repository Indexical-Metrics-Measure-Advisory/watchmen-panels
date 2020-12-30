import { EventEmitter } from 'events';
import React, { useState } from 'react';

export enum DataSetTableEvent {
	SELECTION_CHANGED = 'selection-changed',
	SELECTION_REPAINT = 'selection-repaint',
	FIX_COLUMN_CHANGED = 'fix-column-changed',
	COMPRESS_COLUMN_WIDTH = 'compress-column-width'
}

export type SelectionChangeListener = (inFixTable: boolean, rowIndex: number, columnIndex: number) => void;
export type RepaintSelectionHandler = () => void;
export type FixColumnChangeListener = (fix: boolean, columnIndex: number) => void;
export type ColumnWidthCompressHandler = () => void;

export interface DataSetTableContext {
	selectionChange: (inFixTable: boolean, rowIndex: number, columnIndex: number) => void;
	addSelectionChangeListener: (listener: SelectionChangeListener) => void;
	removeSelectionChangeListener: (listener: SelectionChangeListener) => void;

	repaintSelection: () => void;
	addRepaintSelectionHandler: (handler: RepaintSelectionHandler) => void;
	removeRepaintSelectionHandler: (handler: RepaintSelectionHandler) => void;

	fixColumnChange: (fix: boolean, columnCount: number) => void;
	addFixColumnChangeListener: (listener: FixColumnChangeListener) => void;
	removeFixColumnChangeListener: (listener: FixColumnChangeListener) => void;

	compressColumnWidth: () => void;
	addColumnWidthCompressHandler: (handler: ColumnWidthCompressHandler) => void;
	removeColumnWidthCompressHandler: (handler: ColumnWidthCompressHandler) => void;
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

		repaintSelection: () => emitter.emit(DataSetTableEvent.SELECTION_REPAINT),
		addRepaintSelectionHandler: (handler: RepaintSelectionHandler) => emitter.on(DataSetTableEvent.SELECTION_REPAINT, handler),
		removeRepaintSelectionHandler: (handler: RepaintSelectionHandler) => emitter.off(DataSetTableEvent.SELECTION_REPAINT, handler),

		fixColumnChange: (fix: boolean, columnCount: number) => emitter.emit(DataSetTableEvent.FIX_COLUMN_CHANGED, fix, columnCount),
		addFixColumnChangeListener: (listener: FixColumnChangeListener) => emitter.on(DataSetTableEvent.FIX_COLUMN_CHANGED, listener),
		removeFixColumnChangeListener: (listener: FixColumnChangeListener) => emitter.off(DataSetTableEvent.FIX_COLUMN_CHANGED, listener),

		compressColumnWidth: () => emitter.emit(DataSetTableEvent.COMPRESS_COLUMN_WIDTH),
		addColumnWidthCompressHandler: (handler: ColumnWidthCompressHandler) => emitter.on(DataSetTableEvent.COMPRESS_COLUMN_WIDTH, handler),
		removeColumnWidthCompressHandler: (handler: ColumnWidthCompressHandler) => emitter.off(DataSetTableEvent.COMPRESS_COLUMN_WIDTH, handler)
	}}>{children}</Context.Provider>;
};

export const useDataSetTableContext = () => {
	return React.useContext(Context);
};
