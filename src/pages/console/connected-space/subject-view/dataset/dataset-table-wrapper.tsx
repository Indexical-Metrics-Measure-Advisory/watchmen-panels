import React, { RefObject, useEffect, useRef, useState } from 'react';
import { DataPage } from '../../../../../services/admin/types';
import { ConnectedConsoleSpace, ConsoleSpaceSubject } from '../../../../../services/console/types';
import { DataSetTable } from './dataset-table';
import { ColumnSelection, HEADER_HEIGHT, ROW_HEIGHT, RowSelection, Wrapper } from './dataset-table-components';
import { ColumnDefs, TableSelection } from './types';
import { buildFactorMap, filterColumns } from './utils';

const useDecorateFixStyle = (options: {
	fixTableRef: RefObject<HTMLDivElement>;
	dataTableRef: RefObject<HTMLDivElement>;
}) => {
	const { fixTableRef, dataTableRef } = options;

	// link scroll between fixed table and data table
	useEffect(() => {
		if (!dataTableRef.current || !fixTableRef.current) {
			return;
		}
		const dataTable = dataTableRef.current;
		const fixTable = fixTableRef.current;
		const arrangeFixedTableStyle = () => {
			const scrollBarHeight = dataTable.offsetHeight - dataTable.clientHeight;
			fixTable.style.height = `calc(100% - ${scrollBarHeight}px)`;
			fixTable.style.boxShadow = `0 1px 0 0 var(--border-color)`;
		};
		const onScroll = () => {
			arrangeFixedTableStyle();
			fixTable.scrollTop = dataTableRef.current!.scrollTop;
		};
		setTimeout(arrangeFixedTableStyle, 100);
		dataTable.addEventListener('scroll', onScroll);
		return () => {
			dataTable.removeEventListener('scroll', onScroll);
		};
	});
};

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
	clientWidth: number;
	verticalScroll: boolean;
	data: DataPage<Array<any>>;
	columnDefs: ColumnDefs;
	rowNoColumnWidth: number;
}) => {
	const { columnIndex } = options;
	if (columnIndex === -1) {
		return { columnLeft: 0, columnWidth: 0, columnHeight: 0 };
	}

	const { inFixTable, scrollLeft, clientWidth, verticalScroll, data, columnDefs, rowNoColumnWidth } = options;

	const selectColumnDef = inFixTable ? columnDefs.fixed[columnIndex] : columnDefs.data[columnIndex];
	const selectColumnWidth = selectColumnDef?.width || 0;
	const selectColumnLeft = (inFixTable ? columnDefs.fixed : columnDefs.data).reduce((left, columnDef, index) => {
		if (index < columnIndex) {
			left += columnDef.width;
		}
		return left;
	}, inFixTable ? 0 : (0 - scrollLeft));

	let columnWidth = selectColumnWidth;
	let columnLeft;
	if (inFixTable) {
		columnLeft = selectColumnLeft;
	} else {
		const fixTableWidth = columnDefs.fixed.reduce((left, column) => left + column.width, rowNoColumnWidth);
		columnLeft = fixTableWidth + selectColumnLeft;
		if (columnLeft < fixTableWidth) {
			columnWidth -= fixTableWidth - columnLeft;
			columnWidth = Math.max(0, columnWidth);
			columnLeft = fixTableWidth;
		}
	}
	if (columnWidth + columnLeft > clientWidth + rowNoColumnWidth) {
		columnWidth = clientWidth + rowNoColumnWidth - columnLeft;
	}
	return {
		columnLeft,
		columnWidth,
		columnHeight: verticalScroll ? 0 : data.data.length * ROW_HEIGHT + HEADER_HEIGHT
	};
};

const useSelection = (options: {
	data: DataPage<Array<any>>;
	columnDefs: ColumnDefs;
	dataTableRef: RefObject<HTMLDivElement>;
	rowSelectionRef: RefObject<HTMLDivElement>;
	columnSelectionRef: RefObject<HTMLDivElement>;
}) => {
	const { data, columnDefs, dataTableRef, rowSelectionRef, columnSelectionRef } = options;

	const [ rowNoColumnWidth ] = useState(40);
	const [ selection, setSelection ] = useState<TableSelection>({
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
	const select = (inFixTable: boolean) => (rowIndex: number, columnIndex: number) => {
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
			clientWidth,
			verticalScroll: offsetHeight !== clientHeight,
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
				const { scrollLeft, clientWidth, offsetHeight, clientHeight } = dataTable;
				const { columnLeft: left, columnWidth: width } = computeColumnSelectionPosition({
					inFixTable,
					columnIndex,
					scrollLeft,
					clientWidth,
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

	return {
		rowNoColumnWidth,
		selection,
		select
	};
};

export const DataSetTableWrapper = (props: {
	space: ConnectedConsoleSpace;
	subject: ConsoleSpaceSubject;
	data: DataPage<Array<any>>;
}) => {
	const { space, subject, data } = props;

	const fixTableRef = useRef<HTMLDivElement>(null);
	const dataTableRef = useRef<HTMLDivElement>(null);
	const rowSelectionRef = useRef<HTMLDivElement>(null);
	const columnSelectionRef = useRef<HTMLDivElement>(null);
	const [ columnDefs ] = useState<ColumnDefs>(() => {
		return {
			fixed: [],
			data: filterColumns({ columns: subject.dataset?.columns || [], factorMap: buildFactorMap(space.topics) })
		};
	});
	const { rowNoColumnWidth, selection, select } = useSelection({
		data,
		columnDefs,
		dataTableRef,
		rowSelectionRef,
		columnSelectionRef
	});
	useDecorateFixStyle({ fixTableRef, dataTableRef });

	// const pinColumn = (column: FactorColumnDef, pin: boolean) => {
	// 	column.fixed = pin;
	// 	if (pin) {
	// 		// move to fixed
	// 		setColumnDefs({
	// 			fixed: [ ...columnDefs.fixed, column ],
	// 			data: columnDefs.data.filter(c => c !== column)
	// 		});
	// 	} else {
	// 		// remove from fixed
	// 		setColumnDefs({
	// 			fixed: columnDefs.fixed.filter(c => c !== column),
	// 			// to original column index
	// 			data: [ ...columnDefs.data, column ].sort((c1, c2) => c1.index - c2.index)
	// 		});
	// 	}
	// };

	return <Wrapper>
		<DataSetTable displayColumns={columnDefs.fixed}
		              showRowNo={true} rowNoColumnWidth={rowNoColumnWidth}
		              data={data.data}
		              select={select(true)}
		              ref={fixTableRef}/>
		<DataSetTable displayColumns={columnDefs.data}
		              showRowNo={false} rowNoColumnWidth={rowNoColumnWidth}
		              data={data.data}
		              select={select(false)}
		              ref={dataTableRef}/>
		<RowSelection index={selection.row}
		              top={selection.rowTop} height={selection.rowHeight}
		              scroll={selection.verticalScroll}
		              ref={rowSelectionRef}/>
		<ColumnSelection index={selection.column}
		                 left={selection.columnLeft} width={selection.columnWidth} height={selection.columnHeight}
		                 scroll={selection.horizontalScroll}
		                 ref={columnSelectionRef}/>
	</Wrapper>;
};