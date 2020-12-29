import React, { Fragment, RefObject, useEffect, useRef, useState } from 'react';
import { DataPage } from '../../../../../services/admin/types';
import { ColumnSelection, HEADER_HEIGHT, ROW_HEIGHT, RowSelection } from './dataset-table-components';
import { useDataSetTableContext } from './dataset-table-context';
import { ColumnDefs, TableSelection } from './types';

const computeRowSelectionPosition = (options: {
	rowIndex: number;
	scrollTop: number;
	clientHeight: number
}) => {
	const { rowIndex } = options;
	if (rowIndex === -1) {
		return { rowTop: 0, rowHeight: 0 };
	}

	const { scrollTop, clientHeight } = options;

	const top = 32 - 1;
	let rowTop = rowIndex === -1 ? 0 : top + 24 * rowIndex - scrollTop;
	let rowHeight = ROW_HEIGHT;
	if (rowTop + rowHeight <= top || rowTop > clientHeight) {
		return { rowTop: 0, rowHeight: 0 };
	}
	if (rowTop < top) {
		rowHeight -= top - rowTop;
		rowHeight = Math.max(0, rowHeight);
		rowTop = top;
	}
	if (rowTop + rowHeight > clientHeight) {
		rowHeight = clientHeight - rowTop;
	}
	return { rowTop, rowHeight };
};

const computeColumnSelectionPosition = (options: {
	inFixTable: boolean;
	columnIndex: number;
	scrollLeft: number;
	dataTableClientWidth: number;
	verticalScroll: boolean;
	data: DataPage<Array<any>>;
	columnDefs: ColumnDefs;
	rowNoColumnWidth: number;
}) => {
	const { columnIndex } = options;
	if (columnIndex === -1) {
		return { columnLeft: 0, columnWidth: 0, columnHeight: 0 };
	}

	const {
		inFixTable,
		scrollLeft,
		dataTableClientWidth,
		verticalScroll,
		data,
		columnDefs,
		rowNoColumnWidth
	} = options;

	const selectColumnDef = inFixTable ? columnDefs.fixed[columnIndex] : columnDefs.data[columnIndex];
	const selectColumnWidth = selectColumnDef?.width || 0;
	// compute left in my table, total width of previous columns
	const selectColumnLeft = (inFixTable ? columnDefs.fixed : columnDefs.data).reduce((left, columnDef, index) => {
		if (index < columnIndex) {
			left += columnDef.width;
		}
		return left;
	}, 0);

	let columnWidth = selectColumnWidth;
	let columnLeft;
	const fixTableWidth = columnDefs.fixed.reduce((left, column) => left + column.width, rowNoColumnWidth);
	const totalWidth = fixTableWidth + dataTableClientWidth;
	if (inFixTable) {
		columnLeft = selectColumnLeft + rowNoColumnWidth;
	} else {
		columnLeft = fixTableWidth + selectColumnLeft - scrollLeft;
		if (columnLeft + columnWidth <= fixTableWidth || columnLeft >= totalWidth) {
			// column is hide in fix table
			// or column is beyond total width
			return { columnLeft: 0, columnWidth: 0, columnHeight: 0 };
		}
		if (columnLeft < fixTableWidth) {
			columnWidth -= fixTableWidth - columnLeft;
			columnWidth = Math.max(0, columnWidth);
			columnLeft = fixTableWidth;
		}
	}
	if (columnWidth + columnLeft > totalWidth) {
		columnWidth = totalWidth - columnLeft;
	}
	return {
		columnLeft,
		columnWidth,
		columnHeight: verticalScroll ? 0 : data.data.length * ROW_HEIGHT + HEADER_HEIGHT
	};
};

const buildDefaultSelection = () => ({
	row: -1,
	rowTop: 0,
	rowHeight: 0,
	column: -1,
	columnLeft: 0,
	columnWidth: 0,
	columnHeight: 0,
	inFixTable: false,
	verticalScroll: 0,
	horizontalScroll: 0
});

const useSelection = (options: {
	data: DataPage<Array<any>>;
	columnDefs: ColumnDefs;
	dataTableRef: RefObject<HTMLDivElement>;
	rowNoColumnWidth: number;
	rowSelectionRef: RefObject<HTMLDivElement>;
	columnSelectionRef: RefObject<HTMLDivElement>;
}) => {
	const {
		data, columnDefs, rowNoColumnWidth,
		dataTableRef, rowSelectionRef, columnSelectionRef
	} = options;

	const [ selection, setSelection ] = useState<TableSelection>(buildDefaultSelection());
	const select = (inFixTable: boolean, rowIndex: number, columnIndex: number) => {
		if (!dataTableRef.current) {
			return;
		}

		const dataTable = dataTableRef.current;
		const { offsetWidth, offsetHeight, clientWidth, clientHeight, scrollTop, scrollLeft } = dataTable;
		const scroll = {
			verticalScroll: offsetWidth - clientWidth,
			horizontalScroll: offsetHeight - clientHeight
		};

		const rowPos = computeRowSelectionPosition({ rowIndex, scrollTop, clientHeight });
		const colPos = computeColumnSelectionPosition({
			inFixTable,
			columnIndex,
			scrollLeft,
			dataTableClientWidth: clientWidth,
			verticalScroll: offsetWidth !== clientWidth,
			data,
			columnDefs,
			rowNoColumnWidth
		});

		setSelection({
			row: rowIndex,
			...rowPos,
			column: columnIndex,
			...colPos,
			inFixTable,
			...scroll
		});
	};

	useEffect(() => {
		if (!dataTableRef.current) {
			return;
		}
		const dataTable = dataTableRef.current;
		// compute and set new positions of row and column selection here.
		// in case of handle scroll, transition is not needed; in the meantime, refresh by state change is not as fast as hoped.
		// therefore, use plain javascript to clear transition css and set positions.
		// and synchronize selection state after a short time (setTimeout on several milliseconds), and remove the transition clearing.
		// selection state synchronization is required, otherwise cannot response click cell/row header/column header correctly.
		const onScroll = () => {
			let {
				inFixTable,
				row: rowIndex,
				column: columnIndex,
				rowTop,
				rowHeight,
				columnLeft,
				columnWidth
			} = selection;
			if (rowIndex !== -1 && rowSelectionRef.current) {
				const { scrollTop, clientHeight } = dataTable;
				const { rowTop: top, rowHeight: height } = computeRowSelectionPosition({
					rowIndex,
					scrollTop,
					clientHeight
				});
				const bar = rowSelectionRef.current;
				bar.style.transition = 'none';
				bar.style.top = `${top}px`;
				bar.style.height = `${height}px`;
				rowTop = top;
				rowHeight = height;
			}
			if (columnIndex !== -1 && columnSelectionRef.current) {
				const { scrollLeft, clientWidth: dataTableClientWidth, offsetHeight, clientHeight } = dataTable;
				const { columnLeft: left, columnWidth: width } = computeColumnSelectionPosition({
					inFixTable,
					columnIndex,
					scrollLeft,
					dataTableClientWidth,
					verticalScroll: offsetHeight !== clientHeight,
					data,
					columnDefs,
					rowNoColumnWidth
				});
				const bar = columnSelectionRef.current;
				bar.style.transition = 'none';
				bar.style.left = `${left}px`;
				bar.style.width = `${width}px`;
				columnLeft = left;
				columnWidth = width;
			}
			if (rowIndex !== -1 || columnIndex !== -1) {
				setTimeout(() => {
					setSelection({ ...selection, rowTop, rowHeight, columnLeft, columnWidth });
					rowSelectionRef.current && (rowSelectionRef.current.style.transition = '');
					columnSelectionRef.current && (columnSelectionRef.current.style.transition = '');
				}, 5);
			}
		};
		dataTable.addEventListener('scroll', onScroll);
		return () => dataTable.removeEventListener('scroll', onScroll);
	});

	return { selection, select };
};

export const DataSetTableSelection = (props: {
	data: DataPage<Array<any>>;
	columnDefs: ColumnDefs;
	dataTableRef: RefObject<HTMLDivElement>;
	rowNoColumnWidth: number;
}) => {
	const {
		data, columnDefs, dataTableRef,
		rowNoColumnWidth
	} = props;

	const { addSelectionChangeListener, removeSelectionChangeListener } = useDataSetTableContext();
	const rowSelectionRef = useRef<HTMLDivElement>(null);
	const columnSelectionRef = useRef<HTMLDivElement>(null);
	const { selection, select } = useSelection({
		data,
		columnDefs,
		rowNoColumnWidth,
		dataTableRef,
		rowSelectionRef,
		columnSelectionRef
	});
	useEffect(() => {
		addSelectionChangeListener(select);
		return () => removeSelectionChangeListener(select);
	});

	return <Fragment>
		<RowSelection index={selection.row}
		              top={selection.rowTop} height={selection.rowHeight}
		              scroll={selection.verticalScroll}
		              ref={rowSelectionRef}/>
		<ColumnSelection index={selection.column}
		                 left={selection.columnLeft} width={selection.columnWidth} height={selection.columnHeight}
		                 scroll={selection.horizontalScroll}
		                 ref={columnSelectionRef}/>
	</Fragment>;
};