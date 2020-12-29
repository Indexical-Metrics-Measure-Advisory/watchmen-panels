import React, { ForwardedRef, forwardRef, Fragment, useRef } from 'react';
import {
	DataSetTableBody,
	DataSetTableBodyCell,
	DataSetTableContainer,
	DataSetTableHeader,
	DataSetTableHeaderCell
} from './dataset-table-components';
import { useDataSetTableContext } from './dataset-table-context';
import { ColumnDef, FactorColumnDef, SequenceColumnDef } from './types';

const HeaderCell = (props: {
	column: FactorColumnDef;
	last: boolean;
	selectColumn: (event: React.MouseEvent<HTMLDivElement>) => void;
}) => {
	const { column, last, selectColumn } = props;

	const cellRef = useRef<HTMLDivElement>(null);

	return <DataSetTableHeaderCell lastColumn={last}
	                               onClick={selectColumn}
	                               ref={cellRef}>
		<span>{column.factor.label || column.factor.name}</span>
	</DataSetTableHeaderCell>;
};

export const DataSetTable = forwardRef((props: {
	displayColumns: Array<FactorColumnDef>;
	showRowNo: boolean;
	rowNoColumnWidth: number;
	data: Array<Array<any>>;
}, ref: ForwardedRef<HTMLDivElement>) => {
	const { displayColumns, showRowNo, rowNoColumnWidth, data } = props;

	const { selectionChange } = useDataSetTableContext();
	const onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
		// const { clientX, clientY } = event;
	};
	const onSelectionChanged = (rowIndex: number, columnIndex: number) => (event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		selectionChange(showRowNo, rowIndex, columnIndex);
	};

	const allDisplayColumns: Array<ColumnDef> = [ ...displayColumns ];
	if (showRowNo) {
		allDisplayColumns.unshift({ fixed: true, width: rowNoColumnWidth } as SequenceColumnDef);
	}
	const autoFill = !showRowNo;

	return <DataSetTableContainer columns={allDisplayColumns} autoFill={autoFill}
	                              onMouseMove={onMouseMove}
	                              ref={ref}>
		<DataSetTableHeader columns={allDisplayColumns} autoFill={autoFill}>
			{showRowNo
				? <DataSetTableHeaderCell lastColumn={displayColumns.length === 0}
				                          data-rowno={true}>
					<span>#</span>
				</DataSetTableHeaderCell>
				: null}
			{displayColumns.map((column, columnIndex, columns) => {
				const lastColumn = showRowNo && columnIndex === columns.length - 1;
				return <HeaderCell column={column}
				                   last={lastColumn}
				                   selectColumn={onSelectionChanged(-1, columnIndex)}
				                   key={`0-${columnIndex}`}/>;
			})}
			{autoFill ? <DataSetTableHeaderCell lastColumn={false} data-filler={true}/> : null}
		</DataSetTableHeader>
		<DataSetTableBody columns={allDisplayColumns} autoFill={autoFill}>
			{data.map((row, rowIndex, rows) => {
				const lastRow = rows.length - 1 === rowIndex;
				return <Fragment key={`${rowIndex}`}>
					{showRowNo
						? <DataSetTableBodyCell lastRow={lastRow} lastColumn={displayColumns.length === 0}
						                        onClick={onSelectionChanged(rowIndex, -1)}
						                        data-rowno={true}>
							<span>{rowIndex + 1}</span>
						</DataSetTableBodyCell>
						: null}
					{displayColumns.map((def, columnIndex, columns) => {
						const lastColumn = showRowNo && columnIndex === columns.length - 1;
						return <DataSetTableBodyCell lastRow={lastRow} lastColumn={lastColumn}
						                             onClick={onSelectionChanged(rowIndex, columnIndex)}
						                             key={`${rowIndex}-${columnIndex}`}>
							{`${row[def.index]}`}
						</DataSetTableBodyCell>;
					})}
					{autoFill ? <DataSetTableBodyCell lastRow={lastRow} lastColumn={false} data-filler={true}/> : null}
				</Fragment>;
			})}
		</DataSetTableBody>
	</DataSetTableContainer>;
});
