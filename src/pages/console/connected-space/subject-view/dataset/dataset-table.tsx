import { faLock, faLockOpen, faSortAmountDown, faSortAmountUpAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ForwardedRef, forwardRef, Fragment, useRef } from 'react';
import { DataPage } from '../../../../../services/admin/types';
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
	sortColumnAsc: (event: React.MouseEvent<HTMLButtonElement>) => void;
	sortColumnDesc: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
	const { column, isFixTable, last, selectColumn, fixColumn, unfixColumn, sortColumnAsc, sortColumnDesc } = props;

	const cellRef = useRef<HTMLDivElement>(null);

	return <DataSetTableHeaderCell lastColumn={last}
	                               onClick={selectColumn}
	                               ref={cellRef}>
		<span>{column.factor.label || column.factor.name}</span>
		<HeaderCellButtons>
			<LinkButton ignoreHorizontalPadding={true} tooltip='Sort Ascending'
			            right={true} offsetX={-6} offsetY={6}
			            onClick={sortColumnAsc}>
				<FontAwesomeIcon icon={faSortAmountUpAlt}/>
			</LinkButton>
			<LinkButton ignoreHorizontalPadding={true} tooltip='Sort Descending'
			            right={true} offsetX={-6} offsetY={6}
			            onClick={sortColumnDesc}>
				<FontAwesomeIcon icon={faSortAmountDown}/>
			</LinkButton>
			{isFixTable
				? <LinkButton ignoreHorizontalPadding={true} tooltip='Unfix Me and Follows'
				              right={true} offsetX={-6} offsetY={6}
				              onClick={unfixColumn}>
					<FontAwesomeIcon icon={faLockOpen}/>
				</LinkButton>
				: <LinkButton ignoreHorizontalPadding={true} tooltip='Fix Columns to Here'
				              right={true} offsetX={-6} offsetY={6}
				              onClick={fixColumn}>
					<FontAwesomeIcon icon={faLock}/>
				</LinkButton>}
		</HeaderCellButtons>
	</DataSetTableHeaderCell>;
};

export const DataSetTable = forwardRef((props: {
	displayColumns: Array<FactorColumnDef>;
	data: DataPage<Array<any>>;
	isFixTable: boolean;
	rowNoColumnWidth: number;
	onColumnFixChange: (column: FactorColumnDef, fix: boolean) => void;
	onColumnSort: (column: FactorColumnDef, asc: boolean) => void;
}, ref: ForwardedRef<HTMLDivElement>) => {
	const {
		displayColumns,
		isFixTable,
		rowNoColumnWidth,
		data: { data, pageNumber, pageSize },
		onColumnFixChange, onColumnSort
	} = props;

	const { selectionChange } = useDataSetTableContext();
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
	const sortColumn = (asc: boolean, column: FactorColumnDef) => (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		event.stopPropagation();
		onColumnSort(column, asc);
	};

	const allDisplayColumns: Array<ColumnDef> = [ ...displayColumns ];
	if (isFixTable) {
		allDisplayColumns.unshift({ fixed: true, width: rowNoColumnWidth } as SequenceColumnDef);
	}
	const autoFill = !isFixTable;

	return <DataSetTableContainer columns={allDisplayColumns} autoFill={autoFill}
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
				                   sortColumnAsc={sortColumn(true, column)}
				                   sortColumnDesc={sortColumn(false, column)}
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
							<span>{pageSize * (pageNumber - 1) + rowIndex + 1}</span>
						</DataSetTableBodyCell>
						: null}
					{displayColumns.map((def, columnIndex, columns) => {
						const lastColumn = isFixTable && columnIndex === columns.length - 1;
						return <DataSetTableBodyCell lastRow={lastRow} lastColumn={lastColumn}
						                             onClick={onSelectionChanged(rowIndex, columnIndex)}
						                             key={`${rowIndex}-${columnIndex}`}>
							<span>{`${row[def.index]}`}</span>
						</DataSetTableBodyCell>;
					})}
					{autoFill ? <DataSetTableBodyCell lastRow={lastRow} lastColumn={false} data-filler={true}/> : null}
				</Fragment>;
			})}
		</DataSetTableBody>
	</DataSetTableContainer>;
});
