import { EventEmitter } from 'events';
import React, { useState } from 'react';

export enum DataSetTableEvent {
	SELECTION_CHANGED = 'selection-changed',
	REPAINT_SELECTION = 'repaint-selection',
	FIX_COLUMN_CHANGED = 'fix-column-changed',
	COMPRESS_COLUMN_WIDTH = 'compress-column-width',
	DRAG_COLUMN_VISIBLE_CHANGED = 'drag-column-visible-changed',
	REPLY_DRAG_COLUMN_VISIBLE = 'reply-drag-column-visible',
	DETERMINE_DRAG_COLUMN_VISIBLE = 'determine-drag-column-visible',
	DRAG_COLUMN_STATE_CHANGED = 'drag-column-state-changed',
}

export interface DragColumnState {
	left: number;
	height: number;
	startRowIndex: number;
	endRowIndex: number;
	firstRowOffsetY: number;
	movementX: number;
}

export type SelectionChangeListener = (inFixTable: boolean, rowIndex: number, columnIndex: number) => void;
export type RepaintSelectionHandler = () => void;
export type FixColumnChangeListener = (fix: boolean, columnIndex: number) => void;
export type ColumnWidthCompressHandler = () => void;
export type DragColumnVisibleChangeListener = (visible: boolean) => void;
export type DragColumnChangeStateListener = (state: Partial<DragColumnState>) => void;
export type DragColumnVisibleDeterminationHandler = (reply: (visible: boolean) => void) => void;

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

	dragColumnVisibleChange: (visible: boolean) => void;
	addDragColumnVisibleChangeListener: (listener: DragColumnVisibleChangeListener) => void;
	removeDragColumnVisibleChangeListener: (listener: DragColumnVisibleChangeListener) => void;
	determineDragColumnVisible: () => Promise<boolean>;
	addDragColumnVisibleDeterminationHandler: (listener: DragColumnVisibleDeterminationHandler) => void;
	removeDragColumnVisibleDeterminationHandler: (listener: DragColumnVisibleDeterminationHandler) => void;

	dragColumnStateChange: (state: Partial<DragColumnState>) => void;
	addDragColumnStateChangeListener: (listener: DragColumnChangeStateListener) => void;
	removeDragColumnStateChangeListener: (listener: DragColumnChangeStateListener) => void;
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

		repaintSelection: () => emitter.emit(DataSetTableEvent.REPAINT_SELECTION),
		addRepaintSelectionHandler: (handler: RepaintSelectionHandler) => emitter.on(DataSetTableEvent.REPAINT_SELECTION, handler),
		removeRepaintSelectionHandler: (handler: RepaintSelectionHandler) => emitter.off(DataSetTableEvent.REPAINT_SELECTION, handler),

		fixColumnChange: (fix: boolean, columnCount: number) => emitter.emit(DataSetTableEvent.FIX_COLUMN_CHANGED, fix, columnCount),
		addFixColumnChangeListener: (listener: FixColumnChangeListener) => emitter.on(DataSetTableEvent.FIX_COLUMN_CHANGED, listener),
		removeFixColumnChangeListener: (listener: FixColumnChangeListener) => emitter.off(DataSetTableEvent.FIX_COLUMN_CHANGED, listener),

		compressColumnWidth: () => emitter.emit(DataSetTableEvent.COMPRESS_COLUMN_WIDTH),
		addColumnWidthCompressHandler: (handler: ColumnWidthCompressHandler) => emitter.on(DataSetTableEvent.COMPRESS_COLUMN_WIDTH, handler),
		removeColumnWidthCompressHandler: (handler: ColumnWidthCompressHandler) => emitter.off(DataSetTableEvent.COMPRESS_COLUMN_WIDTH, handler),

		dragColumnVisibleChange: (visible: boolean) => emitter.emit(DataSetTableEvent.DRAG_COLUMN_VISIBLE_CHANGED, visible),
		addDragColumnVisibleChangeListener: (listener: DragColumnVisibleChangeListener) => emitter.on(DataSetTableEvent.DRAG_COLUMN_VISIBLE_CHANGED, listener),
		removeDragColumnVisibleChangeListener: (listener: DragColumnVisibleChangeListener) => emitter.off(DataSetTableEvent.DRAG_COLUMN_VISIBLE_CHANGED, listener),

		determineDragColumnVisible: (): Promise<boolean> => {
			return new Promise(resolve => {
				emitter.once(DataSetTableEvent.REPLY_DRAG_COLUMN_VISIBLE, (visible: boolean) => resolve(visible));
				emitter.emit(DataSetTableEvent.DETERMINE_DRAG_COLUMN_VISIBLE, (visible: boolean) => emitter.emit(DataSetTableEvent.REPLY_DRAG_COLUMN_VISIBLE, visible));
			});
		},
		addDragColumnVisibleDeterminationHandler: (handler: DragColumnVisibleDeterminationHandler) => emitter.on(DataSetTableEvent.DETERMINE_DRAG_COLUMN_VISIBLE, handler),
		removeDragColumnVisibleDeterminationHandler: (handler: DragColumnVisibleDeterminationHandler) => emitter.off(DataSetTableEvent.DETERMINE_DRAG_COLUMN_VISIBLE, handler),

		dragColumnStateChange: (state: Partial<DragColumnState>) => emitter.emit(DataSetTableEvent.DRAG_COLUMN_STATE_CHANGED, state),
		addDragColumnStateChangeListener: (listener: DragColumnChangeStateListener) => emitter.on(DataSetTableEvent.DRAG_COLUMN_STATE_CHANGED, listener),
		removeDragColumnStateChangeListener: (listener: DragColumnChangeStateListener) => emitter.off(DataSetTableEvent.DRAG_COLUMN_STATE_CHANGED, listener)
	}}>{children}</Context.Provider>;
};

export const useDataSetTableContext = () => {
	return React.useContext(Context);
};
