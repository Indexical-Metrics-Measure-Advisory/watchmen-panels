import React, { RefObject, useEffect, useRef, useState } from 'react';
import { useForceUpdate } from '../../../../../common/utils';
import { DataPage } from '../../../../../services/admin/types';
import { ConnectedConsoleSpace, ConsoleSpaceSubject } from '../../../../../services/console/types';
import { DataSetTable } from './dataset-table';
import {
	DataSetResizeShade,
	DRAG_DEVIATION,
	FILLER_MIN_WIDTH,
	HEADER_HEIGHT,
	MAX_COLUMN_WIDTH,
	MIN_COLUMN_WIDTH,
	RESIZE_DEVIATION,
	ROW_HEIGHT,
	Wrapper
} from './dataset-table-components';
import { useDataSetTableContext } from './dataset-table-context';
import { DataSetTableDragColumn } from './dataset-table-drag-column';
import { DataSetTableSelection } from './dataset-table-selection';
import { ColumnDefs, ColumnSortBy, FactorColumnDef, SelectionRef } from './types';
import { buildFactorMap, filterColumns } from './utils';

enum Behavior {
	NONE = 'none',
	PICK_COLUMN = 'pick-column',
	CAN_RESIZE = 'can-resize',
	RESIZING = 'resizing',
	READY_TO_DRAG = 'ready-to-drag',
	DRAGGING = 'dragging'
}

interface PickedColumn {
	column: FactorColumnDef;
	// offset-x between mouse down point to wrapper left
	offsetX: number;
	originalWidth: number;
}

interface PickColumnOptions {
	wrapperLeft: number;
	table: HTMLDivElement;
	mouseClientX: number;
	columnDefs: ColumnDefs
	isFixTable: boolean;
	rowNoColumnWidth: number;
}

const findDataTable = (element: HTMLElement): HTMLDivElement | null => {
	const widgetType = element.getAttribute('data-widget');
	if (widgetType !== 'console-subject-view-dataset-table') {
		return element.closest('div[data-widget="console-subject-view-dataset-table"]') as HTMLDivElement;
	}
	return element as HTMLDivElement;
};

const computeTableColumnsRightPositions = (displayColumns: Array<FactorColumnDef>) => {
	const widths = displayColumns.map(column => column.width);
	for (let index = 1, count = widths.length; index < count; index++) {
		widths[index] += widths[index - 1];
	}
	return widths;
};

const computeAndSetCursor = (options: {
	table: HTMLDivElement;
	mouseClientX: number;
	mouseClientY: number;
	isFixTable: boolean;
	rowNoColumnWidth: number;
	displayColumns: Array<FactorColumnDef>;
	fixColumns: Array<FactorColumnDef>;
	changeBehavior: (state: Behavior) => void;
}) => {
	const {
		table, mouseClientX, mouseClientY,
		isFixTable, rowNoColumnWidth,
		displayColumns, fixColumns,
		changeBehavior
	} = options;

	const { top: containerTop, left: containerLeft } = table.getBoundingClientRect();
	if (mouseClientY - containerTop > HEADER_HEIGHT) {
		// not in header
		changeBehavior(Behavior.NONE);
		return;
	}
	const left = mouseClientX - containerLeft;
	if (isFixTable && left <= rowNoColumnWidth) {
		// in row number column
		changeBehavior(Behavior.NONE);
		return;
	}

	// compute every resize point
	const widths = computeTableColumnsRightPositions(displayColumns);

	if (!isFixTable && left > widths[widths.length - 1] + RESIZE_DEVIATION - table.scrollLeft) {
		// in filler column
		changeBehavior(Behavior.NONE);
		return;
	}

	const offsetLeft = isFixTable ? left - rowNoColumnWidth : left;
	let canResize;
	if (isFixTable) {
		canResize = widths.some(width => Math.abs(width - offsetLeft) <= RESIZE_DEVIATION);
	} else {
		// resize self, or last fix column
		canResize = (fixColumns.length !== 0 && offsetLeft <= RESIZE_DEVIATION)
			|| widths.some(width => Math.abs(width - offsetLeft - table.scrollLeft) <= RESIZE_DEVIATION);
	}
	changeBehavior(canResize ? Behavior.CAN_RESIZE : Behavior.PICK_COLUMN);
};

const findPickedColumn = (options: PickColumnOptions & { matchColumnIndex: (widths: Array<number>, offsetLeft: number) => number }): PickedColumn => {
	const { wrapperLeft, table, mouseClientX, columnDefs, isFixTable, rowNoColumnWidth, matchColumnIndex } = options;

	const tableColumnDefs = isFixTable ? columnDefs.fixed : columnDefs.data;
	let offsetLeft: number;
	if (isFixTable) {
		offsetLeft = mouseClientX - table.getBoundingClientRect().left - rowNoColumnWidth;
	} else {
		offsetLeft = mouseClientX - table.getBoundingClientRect().left + table.scrollLeft;
	}
	const widths = computeTableColumnsRightPositions(tableColumnDefs);
	const index = matchColumnIndex(widths, offsetLeft);
	return {
		column: tableColumnDefs[index],
		offsetX: mouseClientX - wrapperLeft,
		originalWidth: tableColumnDefs[index].width
	};
};

const findPickedColumnForResize = (options: PickColumnOptions): PickedColumn => {
	const { wrapperLeft, table, mouseClientX, columnDefs, isFixTable } = options;

	if (!isFixTable && mouseClientX - table.getBoundingClientRect().left <= RESIZE_DEVIATION) {
		// to resize the last column of fix table
		return {
			column: columnDefs.fixed[columnDefs.fixed.length - 1],
			offsetX: mouseClientX - wrapperLeft,
			originalWidth: columnDefs.fixed[columnDefs.fixed.length - 1].width
		};
	}
	const matchColumnIndex = (widths: Array<number>, offsetLeft: number) => {
		return widths.findIndex(width => Math.abs(width - offsetLeft) <= RESIZE_DEVIATION);
	};
	return findPickedColumn({ ...options, matchColumnIndex });
};

const findPickedColumnForDrag = (options: PickColumnOptions): PickedColumn => {
	const matchColumnIndex = (widths: Array<number>, offsetLeft: number) => {
		return widths.findIndex((width, index) => {
			return width > offsetLeft && (index === 0 || widths[index - 1] < offsetLeft);
		});
	};
	return findPickedColumn({ ...options, matchColumnIndex });
};

const useDecorateFixStyle = (options: {
	fixTableRef: RefObject<HTMLDivElement>;
	dataTableRef: RefObject<HTMLDivElement>;
}) => {
	const { fixTableRef, dataTableRef } = options;

	const arrangeFixedTableStyle = () => {
		if (!dataTableRef.current || !fixTableRef.current) {
			return;
		}
		const dataTable = dataTableRef.current;
		const fixTable = fixTableRef.current;
		const scrollBarHeight = dataTable.offsetHeight - dataTable.clientHeight;
		fixTable.style.height = `calc(100% - ${scrollBarHeight}px)`;
		fixTable.style.boxShadow = `0 1px 0 0 var(--border-color)`;
	};

	// link scroll between fixed table and data table
	useEffect(() => {
		if (!dataTableRef.current || !fixTableRef.current) {
			return;
		}
		const dataTable = dataTableRef.current;
		const fixTable = fixTableRef.current;
		const onDataTableScroll = () => {
			arrangeFixedTableStyle();
			fixTable.scrollTop = dataTable.scrollTop;
		};
		setTimeout(arrangeFixedTableStyle, 100);
		dataTable.addEventListener('scroll', onDataTableScroll);
		// synchronize scroll top to data table
		const onFixTableScroll = () => dataTable.scrollTop = fixTable.scrollTop;
		fixTable.addEventListener('scroll', onFixTableScroll);
		return () => {
			dataTable.removeEventListener('scroll', onDataTableScroll);
			fixTable.removeEventListener('scroll', onFixTableScroll);
		};
	});

	return arrangeFixedTableStyle;
};

export const DataSetTableWrapper = (props: {
	space: ConnectedConsoleSpace;
	subject: ConsoleSpaceSubject;
	data: DataPage<Array<any>>;
}) => {
	const { space, subject, data } = props;

	const {
		fixColumnChange, repaintSelection, selectionChange,
		dragColumnVisibleChange, dragColumnStateChange, determineDragColumnVisible,
		addColumnWidthCompressHandler, removeColumnWidthCompressHandler
	} = useDataSetTableContext();
	const wrapperRef = useRef<HTMLDivElement>(null);
	const fixTableRef = useRef<HTMLDivElement>(null);
	const dataTableRef = useRef<HTMLDivElement>(null);
	const selectionRef = useRef<SelectionRef>(null);
	const [ rowNoColumnWidth ] = useState(40);
	const [ columnDefs ] = useState<ColumnDefs>(() => {
		return {
			fixed: [],
			data: filterColumns({ columns: subject.dataset?.columns || [], factorMap: buildFactorMap(space.topics) })
		};
	});
	const [ behavior, setBehavior ] = useState<Behavior>(Behavior.NONE);
	const [ pickedColumn, setPickedColumn ] = useState<PickedColumn | null>(null);
	const forceUpdate = useForceUpdate();
	const arrangeFixedTableStyle = useDecorateFixStyle({ fixTableRef, dataTableRef });
	useEffect(() => {
		const onColumnWidthCompress = () => {
			columnDefs.fixed.forEach(c => c.width = MIN_COLUMN_WIDTH);
			columnDefs.data.forEach(c => c.width = MIN_COLUMN_WIDTH);
			forceUpdate();
		};
		addColumnWidthCompressHandler(onColumnWidthCompress);
		return () => removeColumnWidthCompressHandler(onColumnWidthCompress);
	});

	const manageCursor = (options: { table: HTMLDivElement | null, mouseClientX: number, mouseClientY: number, avoidResize: boolean }) => {
		const { table } = options;
		if (!table) {
			// target is wrapper itself, when mouse in left-bottom corner and there is horizontal scroll bar shown
			return;
		}
		const { mouseClientX, mouseClientY, avoidResize } = options;
		computeAndSetCursor({
			table,
			mouseClientX,
			mouseClientY,
			isFixTable: table === fixTableRef.current,
			rowNoColumnWidth,
			displayColumns: table === fixTableRef.current ? columnDefs.fixed : columnDefs.data,
			fixColumns: columnDefs.fixed,
			changeBehavior: avoidResize ? (state: Behavior) => {
				setBehavior(state === Behavior.CAN_RESIZE ? Behavior.PICK_COLUMN : state);
			} : setBehavior
		});
	};

	const resizeColumn = (mouseClientX: number) => {
		if (!pickedColumn) {
			return;
		}
		const { left: wrapperLeft } = wrapperRef.current!.getBoundingClientRect();
		const movementX = mouseClientX - wrapperLeft - pickedColumn.offsetX;
		pickedColumn.column.width = Math.min(Math.max(MIN_COLUMN_WIDTH, pickedColumn.originalWidth + movementX), MAX_COLUMN_WIDTH);

		const isFixTable = columnDefs.fixed.includes(pickedColumn.column);
		const table = isFixTable ? fixTableRef.current! : dataTableRef.current!;
		const columns = isFixTable ? columnDefs.fixed : columnDefs.data;
		const header = table.querySelector('div[data-widget="console-subject-view-dataset-table-header"]')! as HTMLDivElement;
		const body = table.querySelector('div[data-widget="console-subject-view-dataset-table-body"]')! as HTMLDivElement;
		const gridTemplateColumns = header.style.gridTemplateColumns.split(' ');
		// physical column is on (definition column index + 1) * 2, starts from 1;
		// width declaration in grid template columns css also is on (definition column index + 1) * 2, starts from 0, therefore index must plus 1 additional;
		// in fix table, there are row number columns, one for show, one for keep rank with real columns.
		gridTemplateColumns[(columns.indexOf(pickedColumn.column) + (isFixTable ? 1 : 0)) * 2 + 1] = `${pickedColumn.column.width}px`;
		const newGridTemplateColumns = gridTemplateColumns.join(' ');
		header.style.gridTemplateColumns = newGridTemplateColumns;
		body.style.gridTemplateColumns = newGridTemplateColumns;
		if (isFixTable) {
			// left of data table doesn't change when resize column in fix table
			const dataTable = dataTableRef.current!;
			// css includes row number column here
			const left = gridTemplateColumns.map(width => parseInt(width)).reduce((total, width) => total + width, 0);
			dataTable.style.left = `${left}px`;
			dataTable.style.position = 'absolute';
			dataTable.style.width = `calc(100% - ${left}px)`;
		}
		repaintSelection();
		arrangeFixedTableStyle();
	};

	// reset the placeholder columns width to zero,
	// reset the real columns width to original,
	// because don't know the previous status
	const resetGridTemplateColumns = (options: {
		element: HTMLDivElement;
		columns: Array<FactorColumnDef>;
		isFixTable: boolean;
	}) => {
		const { element, columns, isFixTable } = options;

		const gridColumnCount = columns.length * 2;
		const shouldReset = (index: number) => isFixTable ? (index > 1 && index < gridColumnCount + 3) : (index < gridColumnCount + 1);
		const getDefIndex = (index: number) => isFixTable ? ((index - 3) / 2) : ((index - 1) / 2);
		return element.style.gridTemplateColumns.split(' ').map((width, index) => {
			if (shouldReset(index)) {
				// recover all width
				return (index % 2 === 0) ? '0px' : `${columns[getDefIndex(index)].width}px`;
			} else {
				// last minmax column
				return width;
			}
		});
	};
	const repaintWhenDragging = (options: {
		mouseClientX: number;
		sourceTable: HTMLDivElement;
		sourceColumns: Array<FactorColumnDef>;
		targetTable: HTMLDivElement;
		targetColumns: Array<FactorColumnDef>;
		pickedColumn: FactorColumnDef;
	}) => {
		const {
			mouseClientX,
			sourceTable, sourceColumns,
			targetTable, targetColumns,
			pickedColumn
		} = options;

		// handle source table
		const dragColumnIndex = sourceColumns.indexOf(pickedColumn);
		const sourceHeader = sourceTable.querySelector<HTMLDivElement>('div[data-widget="console-subject-view-dataset-table-header"]')!;
		const sourceBody = sourceTable.querySelector<HTMLDivElement>('div[data-widget="console-subject-view-dataset-table-body"]')!;
		const sourceIsFixTable = sourceTable === fixTableRef.current;
		const sourceGridTemplateColumns = resetGridTemplateColumns({
			element: sourceHeader,
			columns: sourceColumns,
			isFixTable: sourceIsFixTable
		});
		if (sourceIsFixTable) {
			sourceGridTemplateColumns[(dragColumnIndex + 1) * 2 + 1] = '0';
		} else {
			sourceGridTemplateColumns[(dragColumnIndex + 1) * 2 - 1] = '0';
		}

		// handle target table
		const targetIsFixTable = targetTable === fixTableRef.current;
		const targetColumnsWidths = computeTableColumnsRightPositions(targetColumns);
		const { left: targetTableLeft } = targetTable.getBoundingClientRect();
		const targetScrollLeft = targetTable.scrollLeft;
		const targetColumnIndex = targetColumnsWidths.findIndex(width => {
			// fix table has row number column
			return width - targetScrollLeft > mouseClientX - targetTableLeft - (targetIsFixTable ? rowNoColumnWidth : 0);
		});
		let targetHeader, targetBody, targetGridTemplateColumns;
		if (sourceTable === targetTable) {
			targetHeader = sourceHeader;
			targetBody = sourceBody;
			targetGridTemplateColumns = sourceGridTemplateColumns;
		} else {
			targetHeader = targetTable.querySelector<HTMLDivElement>('div[data-widget="console-subject-view-dataset-table-header"]')!;
			targetBody = targetTable.querySelector<HTMLDivElement>('div[data-widget="console-subject-view-dataset-table-body"]')!;
			targetGridTemplateColumns = resetGridTemplateColumns({
				element: targetHeader,
				columns: targetColumns,
				isFixTable: targetIsFixTable
			});
		}
		if (targetColumnIndex === -1) {
			// console.group();
			// console.info('target is fix table:', targetIsFixTable);
			// console.info('mouse client x:', mouseClientX, ', target scroll left:', targetScrollLeft);
			// console.info('fix table left:', fixTableRef.current!.getBoundingClientRect().left);
			// console.info('data table left:', dataTableRef.current!.getBoundingClientRect().left);
			// console.info('column widths:', targetColumnsWidths.join(', '));
			// console.groupEnd();
			// 2 scenarios here:
			if (targetIsFixTable) {
				// 1. in fix table, dragging column is from data table, and mouse is at right of all fixed columns.
				// the tricky scenario as below,
				// when a column is from data table, move into fix table, and now it is at tail of last column of fix table (mouse client x in right half of fix table column),
				// physically, the mouse client x is still in fix table (sometimes it is moved to data table, catch by above logic branch, not in this discussion),
				// and in repaint function call, even the last column right position is less than mouse client x,
				// then the target column cannot be found, the undefined error raised in repaint function call.
				// root cause of this scenario is table width must be resized when a dragging column move in and out, a column placeholder is simulated for reminding current situation.
				// for fix this, it will be treated same as dragging column still in fix table, as last column.
				targetGridTemplateColumns[(targetColumns.length + 1) * 2] = `${pickedColumn.width}px`;
			} else {
				// 2. in data table, mouse is at right of all columns.
				targetGridTemplateColumns[targetColumns.length * 2 + 1] = `${pickedColumn.width}px`;
			}
		} else {
			const targetColumnRightX = targetColumnsWidths[targetColumnIndex];
			const targetColumnLeftX = targetColumnRightX - targetColumns[targetColumnIndex].width;
			const targetColumnCenterX = (targetColumnRightX + targetColumnLeftX) / 2;
			if (mouseClientX - targetTableLeft > targetColumnCenterX + targetScrollLeft) {
				// drag column after this
				targetGridTemplateColumns[(targetColumnIndex + 1) * 2 + (targetIsFixTable ? 2 : 0)] = `${pickedColumn.width}px`;
			} else {
				// drag column before this
				targetGridTemplateColumns[(targetColumnIndex + 1) * 2 + (targetIsFixTable ? 2 : 0) - 2] = `${pickedColumn.width}px`;
			}
		}

		// repaint
		const isTableInside = sourceTable === targetTable;
		if (!isTableInside) {
			// ignore once when move column inside
			const newSourceGridTemplateColumns = sourceGridTemplateColumns.join(' ');
			sourceHeader.style.gridTemplateColumns = newSourceGridTemplateColumns;
			sourceBody.style.gridTemplateColumns = newSourceGridTemplateColumns;
		}
		const newTargetGridTemplateColumns = targetGridTemplateColumns.join(' ');
		targetHeader.style.gridTemplateColumns = newTargetGridTemplateColumns;
		targetBody.style.gridTemplateColumns = newTargetGridTemplateColumns;

		// move column from one table to another, should change fix table width and data table left.
		// even move inside table, since column might be move out and move in again, therefore compute width and left is required.
		let fixTableWidth;
		let fixTable;
		let dataTable;
		if (sourceIsFixTable) {
			// source from fix table
			fixTableWidth = sourceGridTemplateColumns.map(width => parseInt(width)).reduce((total, width) => total + width, 0);
			if (isTableInside) {
				// target to fix table
				fixTable = sourceTable;
				// reset data table since processing above is all about fix table
				dataTable = dataTableRef.current!;
				const dataTableHeader = dataTable.querySelector<HTMLDivElement>('div[data-widget="console-subject-view-dataset-table-header"]')!;
				const dataTableBody = dataTable.querySelector<HTMLDivElement>('div[data-widget="console-subject-view-dataset-table-body"]')!;
				const dataTableGridColumns = `0 ${columnDefs.data.map(column => `${column.width}px 0`).join(' ')} minmax(${FILLER_MIN_WIDTH}px, 1fr)`;
				dataTableHeader.style.gridTemplateColumns = dataTableGridColumns;
				dataTableBody.style.gridTemplateColumns = dataTableGridColumns;
			} else {
				// target to data table
				fixTable = sourceTable;
				dataTable = targetTable;
			}
		} else {
			// source from data table
			if (isTableInside) {
				// target to data table
				// reset fix table since processing above is all about data table
				fixTable = fixTableRef.current!;
				const fixTableHeader = fixTable.querySelector<HTMLDivElement>('div[data-widget="console-subject-view-dataset-table-header"]')!;
				const fixTableBody = fixTable.querySelector<HTMLDivElement>('div[data-widget="console-subject-view-dataset-table-body"]')!;
				const fixTableGridColumns = `0 ${rowNoColumnWidth}px 0 ${columnDefs.fixed.map(column => `${column.width}px 0`).join(' ')}`;
				fixTableHeader.style.gridTemplateColumns = fixTableGridColumns;
				fixTableBody.style.gridTemplateColumns = fixTableGridColumns;
				fixTableWidth = columnDefs.fixed.reduce((width, column) => width + column.width, rowNoColumnWidth);
				dataTable = sourceTable;
			} else {
				// target to fix table
				fixTableWidth = targetGridTemplateColumns.map(width => parseInt(width)).reduce((total, width) => total + width, 0);
				fixTable = targetTable;
				dataTable = sourceTable;
			}
		}
		fixTable.style.minWidth = 'unset';
		fixTable.style.width = `${fixTableWidth}px`;
		dataTable.style.left = `${fixTableWidth}px`;
		dataTable.style.position = 'absolute';
		dataTable.style.width = `calc(100% - ${fixTableWidth}px)`;
	};

	const dragColumn = async (mouseClientX: number) => {
		if (!pickedColumn) {
			return;
		}

		const wrapper = wrapperRef.current!;
		const { left: wrapperLeft } = wrapper.getBoundingClientRect();

		const movementX = mouseClientX - wrapperLeft - pickedColumn.offsetX;
		const dragColumnVisible = await determineDragColumnVisible();
		if (!dragColumnVisible && Math.abs(movementX) <= DRAG_DEVIATION) {
			// start dragging when movement reach deviation
			return;
		}

		// table content should be selected since shade is not shown now,
		// force clear selection to avoid confusing
		window.getSelection()?.removeAllRanges();
		dragColumnStateChange({
			left: mouseClientX - wrapperLeft - pickedColumn.column.width / 2,
			movementX
		});
		if (behavior !== Behavior.DRAGGING) {
			// auto select the dragging column, remove the current column selection
			const selection = selectionRef.current!.selection();
			selectionChange(selection.inFixTable, selection.row, -1);
			setBehavior(Behavior.DRAGGING);
		}
		if (!dragColumnVisible) {
			dragColumnVisibleChange(true);
		}

		const dataTable = dataTableRef.current!;
		const fixTable = fixTableRef.current!;
		const dataTableLeft = dataTable.getBoundingClientRect().left;
		let sourceTable, sourceColumns, targetTable, targetColumns;
		if (columnDefs.data.includes(pickedColumn.column)) {
			sourceTable = dataTable;
			sourceColumns = columnDefs.data;
		} else {
			sourceTable = fixTable;
			sourceColumns = columnDefs.fixed;
		}
		if (mouseClientX >= dataTableLeft) {
			targetTable = dataTable;
			targetColumns = columnDefs.data;
		} else {
			targetTable = fixTable;
			targetColumns = columnDefs.fixed;
		}
		// repaint drag column placeholder
		repaintWhenDragging({
			mouseClientX, sourceTable, sourceColumns, targetTable, targetColumns, pickedColumn: pickedColumn.column
		});
	};

	const onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
		if (behavior === Behavior.RESIZING && pickedColumn) {
			resizeColumn(event.clientX);
		} else if ((behavior === Behavior.READY_TO_DRAG || behavior === Behavior.DRAGGING) && pickedColumn) {
			// noinspection JSIgnoredPromiseFromCall
			dragColumn(event.clientX);
		} else {
			// nothing decide yet, just manager cursor to remind user
			manageCursor({
				table: findDataTable(event.target as HTMLElement),
				mouseClientX: event.clientX,
				mouseClientY: event.clientY,
				avoidResize: false
			});
		}
	};
	const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
		if (behavior === Behavior.CAN_RESIZE) {
			// start to resize column
			const table = findDataTable(event.target as HTMLElement)!;
			setPickedColumn(findPickedColumnForResize({
				wrapperLeft: wrapperRef.current!.getBoundingClientRect().left,
				table,
				mouseClientX: event.clientX,
				columnDefs,
				isFixTable: table === fixTableRef.current,
				rowNoColumnWidth
			}));
			setBehavior(Behavior.RESIZING);
		} else if (behavior === Behavior.PICK_COLUMN) {
			// start to resize column
			const table = findDataTable(event.target as HTMLElement)!;
			const isFixTable = table === fixTableRef.current;
			const mouseClientX = event.clientX;
			const wrapperLeft = wrapperRef.current!.getBoundingClientRect().left;
			const pickedColumn = findPickedColumnForDrag({
				wrapperLeft,
				table,
				mouseClientX,
				columnDefs,
				isFixTable,
				rowNoColumnWidth
			});
			setPickedColumn(pickedColumn);
			const { scrollTop } = table;
			const height = Math.min(table.clientHeight, HEADER_HEIGHT + data.data.length * ROW_HEIGHT);

			dragColumnStateChange({
				height,
				startRowIndex: Math.floor(scrollTop / ROW_HEIGHT),
				endRowIndex: Math.ceil((height - HEADER_HEIGHT) / ROW_HEIGHT + 2),
				firstRowOffsetY: scrollTop % ROW_HEIGHT,
				movementX: 0
			});
			setBehavior(Behavior.READY_TO_DRAG);
		}
	};
	const onMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
		if (behavior === Behavior.RESIZING) {
			// recover data table layout
			const dataTable = dataTableRef.current!;
			dataTable.style.left = '';
			dataTable.style.position = '';
			dataTable.style.width = '';
			// always fire mouse up on resize shade, find resize table by state
			const resizeTable = columnDefs.fixed.some(c => c === pickedColumn?.column) ? fixTableRef.current : dataTableRef.current;
			// clear resize data
			setPickedColumn(null);
			// recover cursor
			manageCursor({
				table: resizeTable,
				mouseClientX: event.clientX,
				mouseClientY: event.clientY,
				avoidResize: true
			});
		} else if (behavior === Behavior.DRAGGING || behavior === Behavior.READY_TO_DRAG) {
			setPickedColumn(null);
			dragColumnVisibleChange(false);
			setBehavior(Behavior.NONE);
		}
	};
	const onMouseLeave = () => {
		if (behavior === Behavior.RESIZING) {
			// recover data table layout
			const dataTable = dataTableRef.current!;
			dataTable.style.left = '';
			dataTable.style.position = '';
			dataTable.style.width = '';
			setPickedColumn(null);
			setBehavior(Behavior.NONE);
		} else if (behavior === Behavior.DRAGGING || behavior === Behavior.READY_TO_DRAG) {
			setPickedColumn(null);
			dragColumnVisibleChange(false);
			setBehavior(Behavior.NONE);
		}
	};
	const onColumnFixChange = (column: FactorColumnDef, fix: boolean) => {
		// defs must be synchronized to memory immediately, otherwise selection cannot compute positions correctly
		// according to this, here change the state, and call force update manually.
		if (fix) {
			// move leading columns and me from data columns to fix columns
			const index = columnDefs.data.indexOf(column);
			columnDefs.fixed = [ ...columnDefs.fixed, ...columnDefs.data.splice(0, index + 1) ];
			fixColumnChange(fix, index + 1);
			forceUpdate();
		} else {
			// move me and tailing columns from fix columns to data columns
			const index = columnDefs.fixed.indexOf(column);
			const count = columnDefs.fixed.length - index;
			columnDefs.data = [ ...columnDefs.fixed.splice(index), ...columnDefs.data ];
			fixColumnChange(fix, count);
			forceUpdate();
		}
	};
	const onColumnSort = (column: FactorColumnDef, asc: boolean) => {
		const index = column.index;
		if (asc && column.sort === ColumnSortBy.ASC) {
			return;
		}
		if (!asc && column.sort === ColumnSortBy.DESC) {
			return;
		}

		data.data.sort((r1, r2) => {
			let ret;
			const v1 = r1[index];
			const v2 = r2[index];
			if (v1 == null) {
				ret = -1;
			} else if (v2 == null) {
				ret = 1;
			} else if (typeof v1 === 'number' && typeof v2 === 'number') {
				ret = v1 - v2;
			} else if (typeof v1 === 'boolean' && typeof v2 === 'boolean') {
				ret = !v1 ? -1 : (!v2 ? 1 : 0);
			} else {
				ret = `${v1}`.toUpperCase().localeCompare(`${v2}`.toUpperCase());
			}
			return asc ? ret : ret * -1;
		});
		column.sort = asc ? ColumnSortBy.ASC : ColumnSortBy.DESC;
		columnDefs.fixed.filter(c => c !== column).forEach(c => delete c.sort);
		columnDefs.data.filter(c => c !== column).forEach(c => delete c.sort);
		forceUpdate();
	};

	return <Wrapper data-resize-state={behavior}
	                onMouseMove={onMouseMove} onMouseDown={onMouseDown} onMouseUp={onMouseUp}
	                onMouseLeave={onMouseLeave}
	                ref={wrapperRef}>
		<DataSetTable displayColumns={columnDefs.fixed}
		              isFixTable={true} rowNoColumnWidth={rowNoColumnWidth}
		              data={data}
		              onColumnFixChange={onColumnFixChange} onColumnSort={onColumnSort}
		              dragColumn={behavior === Behavior.DRAGGING ? pickedColumn?.column : (void 0)}
		              ref={fixTableRef}/>
		<DataSetTable displayColumns={columnDefs.data}
		              isFixTable={false} rowNoColumnWidth={rowNoColumnWidth}
		              data={data}
		              onColumnFixChange={onColumnFixChange} onColumnSort={onColumnSort}
		              dragColumn={behavior === Behavior.DRAGGING ? pickedColumn?.column : (void 0)}
		              ref={dataTableRef}/>
		<DataSetTableSelection data={data} columnDefs={columnDefs}
		                       rowNoColumnWidth={rowNoColumnWidth}
		                       dataTableRef={dataTableRef} ref={selectionRef}/>
		<DataSetResizeShade data-visible={behavior === Behavior.RESIZING || behavior === Behavior.DRAGGING}/>
		<DataSetTableDragColumn data={data} column={pickedColumn?.column}/>
	</Wrapper>;
};