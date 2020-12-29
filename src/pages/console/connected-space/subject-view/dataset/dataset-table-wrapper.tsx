import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { DataPage } from '../../../../../services/admin/types';
import { ConnectedConsoleSpace, ConsoleSpaceSubject } from '../../../../../services/console/types';
import { DataSetTable } from './dataset-table';
import { ColumnDefs, TableSelection } from './types';
import { buildFactorMap, filterColumns } from './utils';

const Wrapper = styled.div.attrs({
	'data-widget': 'console-subject-view-dataset-table-wrapper'
})`
	display: flex;
	position: absolute;
	top: 40px;
	left: 0;
	width: 100%;
	height: calc(100% - 40px);
`;
const RowSelection = styled.div.attrs<{ index: number, scroll: number }>(({ index, scroll }) => {
	return {
		'data-widget': 'console-subject-view-dataset-table-row-selection',
		style: {
			display: index === -1 ? 'none' : 'block',
			top: 32 + index * 24 - 1,
			width: `calc(100% - ${scroll}px)`
		}
	};
})<{ index: number, scroll: number }>`
	position: absolute;
	left: 0;
	height: 25px;
	border: var(--border);
	border-color: var(--console-favorite-color);
	background-color: var(--console-favorite-color);
	opacity: 0.1;
	pointer-events: none;
	transition: top 300ms ease-in-out;
	z-index: 10;
`;
const ColumnSelection = styled.div
	.attrs<{ index: number, left: number, width: number, scroll: number }>(({ index, left, width, scroll }) => {
		return {
			'data-widget': 'console-subject-view-dataset-table-column-selection',
			style: {
				display: index !== -1 ? 'block' : 'none',
				left,
				width: width + 1,
				height: `calc(100% + 1px - ${scroll}px)`
			}
		};
	})<{ index: number, left: number, width: number, scroll: number }>`
	position: absolute;
	top: -1px;
	border: var(--border);
	border-color: var(--console-favorite-color);
	background-color: var(--console-favorite-color);
	opacity: 0.05;
	pointer-events: none;
	transition: left 300ms ease-in-out;
	z-index: 10;
`;

export const DataSetTableWrapper = (props: {
	space: ConnectedConsoleSpace;
	subject: ConsoleSpaceSubject;
	data: DataPage<Array<any>>;
}) => {
	const { space, subject, data } = props;

	const wrapperRef = useRef<HTMLDivElement>(null);
	const fixedTableRef = useRef<HTMLDivElement>(null);
	const tableRef = useRef<HTMLDivElement>(null);
	const [ rowNoColumnWidth ] = useState(40);
	const [ selection, setSelection ] = useState<TableSelection>({
		row: -1,
		column: -1,
		columnLeft: 0,
		columnWidth: 0,
		inFixTable: false,
		verticalScroll: 0,
		horizontalScroll: 0
	});
	const [ columnDefs ] = useState<ColumnDefs>(() => {
		return {
			fixed: [],
			data: filterColumns({ columns: subject.dataset?.columns || [], factorMap: buildFactorMap(space.topics) })
		};
	});
	// link scroll between fixed table and data table
	useEffect(() => {
		if (!tableRef.current || !fixedTableRef.current) {
			return;
		}
		const table = tableRef.current;
		const fixedTable = fixedTableRef.current;
		const arrangeFixedTableStyle = () => {
			const scrollBarHeight = table.offsetHeight - table.clientHeight;
			fixedTable.style.height = `calc(100% - ${scrollBarHeight}px)`;
			fixedTable.style.boxShadow = `0 1px 0 0 var(--border-color)`;
		};
		const onTableScroll = () => {
			arrangeFixedTableStyle();
			fixedTable.scrollTop = tableRef.current!.scrollTop;
		};
		setTimeout(arrangeFixedTableStyle, 100);
		table.addEventListener('scroll', onTableScroll);
		return () => {
			table.removeEventListener('scroll', onTableScroll);
		};
	});

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
	const select = (inFixTable: boolean) => (rowIndex: number, columnIndex: number) => {
		if (!tableRef.current) {
			return;
		}

		const table = tableRef.current;
		const scroll = {
			verticalScroll: table.offsetHeight - table.clientHeight,
			horizontalScroll: table.offsetWidth - table.clientWidth
		};

		const columnSelectionVisible = columnIndex !== -1;
		if (columnSelectionVisible) {
			const selectColumnDef = inFixTable ? columnDefs.fixed[columnIndex] : columnDefs.data[columnIndex];
			const selectColumnWidth = selectColumnDef?.width || 0;
			const selectColumnLeft = (inFixTable ? columnDefs.fixed : columnDefs.data).reduce((left, columnDef, index) => {
				if (index < columnIndex) {
					left += columnDef.width;
				}
				return left;
			}, 0);
			console.log(selectColumnLeft, selectColumnWidth);
			setSelection({
				row: rowIndex,
				column: columnIndex,
				columnLeft: inFixTable ? selectColumnLeft : (columnDefs.fixed.reduce((left, column) => left + column.width, selectColumnLeft + rowNoColumnWidth)),
				columnWidth: selectColumnWidth,
				inFixTable,
				...scroll
			});
		} else {
			setSelection({
				row: rowIndex,
				column: -1,
				columnLeft: 0,
				columnWidth: 0,
				inFixTable,
				...scroll
			});
		}
	};

	return <Wrapper ref={wrapperRef}>
		<DataSetTable displayColumns={columnDefs.fixed}
		              showRowNo={true} rowNoColumnWidth={rowNoColumnWidth}
		              data={data.data}
		              select={select(true)}
		              ref={fixedTableRef}/>
		<DataSetTable displayColumns={columnDefs.data}
		              showRowNo={false} rowNoColumnWidth={rowNoColumnWidth}
		              data={data.data}
		              select={select(false)}
		              ref={tableRef}/>
		<RowSelection index={selection.row} scroll={selection.verticalScroll}/>
		<ColumnSelection index={selection.column}
		                 left={selection.columnLeft - 1} width={selection.columnWidth}
		                 scroll={selection.horizontalScroll}/>
	</Wrapper>;
};