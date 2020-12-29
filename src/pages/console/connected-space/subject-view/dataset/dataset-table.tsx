import { faLock, faLockOpen, faSortAmountUpAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ForwardedRef, forwardRef, Fragment, useRef } from 'react';
import { LinkButton } from '../../../../component/console/link-button';
import {
	DataSetTableBody,
	DataSetTableBodyCell,
	DataSetTableContainer,
	DataSetTableHeader,
	DataSetTableHeaderCell,
	HeaderCellButtons
} from './dataset-table-components';
import { useDataSetTableContext } from './dataset-table-context';
import { ColumnDef, FactorColumnDef, SequenceColumnDef } from './types';

const HeaderCell = (props: {
	column: FactorColumnDef;
	isFixTable: boolean;
	last: boolean;
	selectColumn: (event: React.MouseEvent<HTMLDivElement>) => void;
	fixColumn: (event: React.MouseEvent<HTMLButtonElement>) => void;
	unfixColumn: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
	const { column, isFixTable, last, selectColumn, fixColumn, unfixColumn } = props;

	const cellRef = useRef<HTMLDivElement>(null);

	return <DataSetTableHeaderCell lastColumn={last}
	                               onClick={selectColumn}
	                               ref={cellRef}>
		<span>{column.factor.label || column.factor.name}</span>
		<HeaderCellButtons>
			<LinkButton ignoreHorizontalPadding={true} tooltip='Sort ascending'
			            right={true} offsetX={-6} offsetY={6}>
				<FontAwesomeIcon icon={faSortAmountUpAlt}/>
			</LinkButton>
			{isFixTable
				? <LinkButton ignoreHorizontalPadding={true} tooltip='Unfix this and follows'
				              right={true} offsetX={-6} offsetY={6}
				              onClick={unfixColumn}>
					<FontAwesomeIcon icon={faLockOpen}/>
				</LinkButton>
				: <LinkButton ignoreHorizontalPadding={true} tooltip='Fix columns to here'
				              right={true} offsetX={-6} offsetY={6}
				              onClick={fixColumn}>
					<FontAwesomeIcon icon={faLock}/>
				</LinkButton>}
		</HeaderCellButtons>
	</DataSetTableHeaderCell>;
};

export const DataSetTable = forwardRef((props: {
	displayColumns: Array<FactorColumnDef>;
	data: Array<Array<any>>;
	isFixTable: boolean;
	rowNoColumnWidth: number;
	onColumnFixChange: (column: FactorColumnDef, fix: boolean) => void;
}, ref: ForwardedRef<HTMLDivElement>) => {
	const { displayColumns, isFixTable, rowNoColumnWidth, data, onColumnFixChange } = props;

	const { selectionChange } = useDataSetTableContext();
	const onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
		// const { clientX, clientY } = event;
	};
	const onSelectionChanged = (rowIndex: number, columnIndex: number) => (event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		selectionChange(isFixTable, rowIndex, columnIndex);
	};
	const fixColumn = (fix: boolean, column: FactorColumnDef) => (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		event.stopPropagation();
		onColumnFixChange(column, fix);
	};

	const allDisplayColumns: Array<ColumnDef> = [ ...displayColumns ];
	if (isFixTable) {
		allDisplayColumns.unshift({ fixed: true, width: rowNoColumnWidth } as SequenceColumnDef);
	}
	const autoFill = !isFixTable;

	return <DataSetTableContainer columns={allDisplayColumns} autoFill={autoFill}
	                              onMouseMove={onMouseMove}
	                              ref={ref}>
		<DataSetTableHeader columns={allDisplayColumns} autoFill={autoFill}>
			{isFixTable
				? <DataSetTableHeaderCell lastColumn={displayColumns.length === 0}
				                          data-rowno={true}>
					<span>#</span>
				</DataSetTableHeaderCell>
				: null}
			{displayColumns.map((column, columnIndex, columns) => {
				const lastColumn = isFixTable && columnIndex === columns.length - 1;
				return <HeaderCell column={column}
				                   isFixTable={isFixTable}
				                   last={lastColumn}
				                   selectColumn={onSelectionChanged(-1, columnIndex)}
				                   fixColumn={fixColumn(true, column)}
				                   unfixColumn={fixColumn(false, column)}
				                   key={`0-${columnIndex}`}/>;
			})}
			{autoFill ? <DataSetTableHeaderCell lastColumn={false} data-filler={true}/> : null}
		</DataSetTableHeader>
		<DataSetTableBody columns={allDisplayColumns} autoFill={autoFill}>
			{data.map((row, rowIndex, rows) => {
				const lastRow = rows.length - 1 === rowIndex;
				return <Fragment key={`${rowIndex}`}>
					{isFixTable
						? <DataSetTableBodyCell lastRow={lastRow} lastColumn={displayColumns.length === 0}
						                        onClick={onSelectionChanged(rowIndex, -1)}
						                        data-rowno={true}>
							<span>{rowIndex + 1}</span>
						</DataSetTableBodyCell>
						: null}
					{displayColumns.map((def, columnIndex, columns) => {
						const lastColumn = isFixTable && columnIndex === columns.length - 1;
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
