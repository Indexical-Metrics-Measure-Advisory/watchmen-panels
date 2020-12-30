import React, { RefObject, useEffect, useRef, useState } from 'react';
import { useForceUpdate } from '../../../../../common/utils';
import { DataPage } from '../../../../../services/admin/types';
import { ConnectedConsoleSpace, ConsoleSpaceSubject } from '../../../../../services/console/types';
import { DataSetTable } from './dataset-table';
import { DataSetResizeShade, HEADER_HEIGHT, Wrapper } from './dataset-table-components';
import { useDataSetTableContext } from './dataset-table-context';
import { DataSetTableSelection } from './dataset-table-selection';
import { ColumnDefs, ColumnSortBy, FactorColumnDef } from './types';
import { buildFactorMap, filterColumns } from './utils';

enum Behavior {
	NONE = 'none',
	PICK_COLUMN = 'pick-column',
	CAN_RESIZE = 'can-resize',
	RESIZING = 'resizing',
	DRAGGING = 'dragging'
}

interface PickedColumn {
	column: FactorColumnDef;
	offsetX: number;
	originalWidth: number;
}

const RESIZE_DEVIATION = 3;
const MIN_COLUMN_WIDTH = 100;
const MAX_COLUMN_WIDTH = 500;

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

const findPickedColumn = (options: {
	wrapperLeft: number;
	table: HTMLDivElement;
	mouseClientX: number;
	columnDefs: ColumnDefs
	isFixTable: boolean;
	rowNoColumnWidth: number;
}): PickedColumn => {
	const { wrapperLeft, table, mouseClientX, columnDefs, isFixTable, rowNoColumnWidth } = options;

	if (!isFixTable && mouseClientX - table.getBoundingClientRect().left <= RESIZE_DEVIATION) {
		// to resize the last column of fix table
		return {
			column: columnDefs.fixed[columnDefs.fixed.length - 1],
			offsetX: mouseClientX - wrapperLeft,
			originalWidth: columnDefs.fixed[columnDefs.fixed.length - 1].width
		};
	}

	const tableColumnDefs = isFixTable ? columnDefs.fixed : columnDefs.data;
	const widths = computeTableColumnsRightPositions(tableColumnDefs);
	let offsetLeft: number;
	if (isFixTable) {
		offsetLeft = mouseClientX - table.getBoundingClientRect().left - rowNoColumnWidth;
	} else {
		offsetLeft = mouseClientX - table.getBoundingClientRect().left + table.scrollLeft;
	}
	const index = widths.findIndex(width => Math.abs(width - offsetLeft) <= RESIZE_DEVIATION);
	return {
		column: tableColumnDefs[index],
		offsetX: mouseClientX - wrapperLeft,
		originalWidth: tableColumnDefs[index].width
	};
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
		fixColumnChange, repaintSelection,
		addColumnWidthCompressHandler, removeColumnWidthCompressHandler
	} = useDataSetTableContext();
	const wrapperRef = useRef<HTMLDivElement>(null);
	const fixTableRef = useRef<HTMLDivElement>(null);
	const dataTableRef = useRef<HTMLDivElement>(null);
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
	const onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
		switch (behavior) {
			case Behavior.RESIZING:
				if (!pickedColumn) {
					return;
				}
				const { clientX: mouseClientX } = event;
				const { left: wrapperLeft } = wrapperRef.current!.getBoundingClientRect();
				const movementX = mouseClientX - wrapperLeft - pickedColumn.offsetX;
				pickedColumn.column.width = Math.min(Math.max(MIN_COLUMN_WIDTH, pickedColumn.originalWidth + movementX), MAX_COLUMN_WIDTH);

				const isFixTable = columnDefs.fixed.includes(pickedColumn.column);
				const table = isFixTable ? fixTableRef.current! : dataTableRef.current!;
				const columns = isFixTable ? columnDefs.fixed : columnDefs.data;
				const header = table.querySelector('div[data-widget="console-subject-view-dataset-table-header"]')! as HTMLDivElement;
				const body = table.querySelector('div[data-widget="console-subject-view-dataset-table-body"]')! as HTMLDivElement;
				const gridTemplateColumns = header.style.gridTemplateColumns.split(' ');
				gridTemplateColumns[columns.indexOf(pickedColumn.column) + (isFixTable ? 1 : 0)] = `${pickedColumn.column.width}px`;
				const newGridTemplateColumns = gridTemplateColumns.join(' ');
				header.style.gridTemplateColumns = newGridTemplateColumns;
				body.style.gridTemplateColumns = newGridTemplateColumns;
				if (isFixTable) {
					// left of data table doesn't change when resize column in fix table
					const dataTable = dataTableRef.current!;
					const left = gridTemplateColumns.map(width => parseInt(width)).reduce((total, width) => total + width, 0);
					dataTable.style.left = `${left}px`;
					dataTable.style.position = 'absolute';
					dataTable.style.width = `calc(100% - ${left}px)`;
				}
				repaintSelection();
				arrangeFixedTableStyle();
				break;
			default:
				manageCursor({
					table: findDataTable(event.target as HTMLElement),
					mouseClientX: event.clientX,
					mouseClientY: event.clientY,
					avoidResize: false
				});
		}
	};
	const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
		switch (behavior) {
			case Behavior.CAN_RESIZE:
				// start to resize column
				const table = findDataTable(event.target as HTMLElement)!;
				setPickedColumn(findPickedColumn({
					wrapperLeft: wrapperRef.current!.getBoundingClientRect().left,
					table,
					mouseClientX: event.clientX,
					columnDefs,
					isFixTable: table === fixTableRef.current,
					rowNoColumnWidth
				}));
				setBehavior(Behavior.RESIZING);
				break;
			case Behavior.PICK_COLUMN:
				// start to drag column
				setBehavior(Behavior.DRAGGING);
				break;
		}
	};
	const onMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
		switch (behavior) {
			case Behavior.RESIZING:
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
				break;
			case Behavior.DRAGGING:
				setBehavior(Behavior.NONE);
				break;
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
		              onColumnFixChange={onColumnFixChange}
		              onColumnSort={onColumnSort}
		              ref={fixTableRef}/>
		<DataSetTable displayColumns={columnDefs.data}
		              isFixTable={false} rowNoColumnWidth={rowNoColumnWidth}
		              data={data}
		              onColumnFixChange={onColumnFixChange}
		              onColumnSort={onColumnSort}
		              ref={dataTableRef}/>
		<DataSetTableSelection data={data} columnDefs={columnDefs}
		                       rowNoColumnWidth={rowNoColumnWidth}
		                       dataTableRef={dataTableRef}/>
		<DataSetResizeShade data-visible={behavior === Behavior.RESIZING}/>
	</Wrapper>;
};