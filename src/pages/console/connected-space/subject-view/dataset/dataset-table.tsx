import { faMapPin, faSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ForwardedRef, forwardRef, Fragment, useRef, useState } from 'react';
import { LinkButton } from '../../../../component/console/link-button';
import {
	DataSetTableBody,
	DataSetTableBodyCell,
	DataSetTableContainer,
	DataSetTableHeader,
	DataSetTableHeaderCell
} from './dataset-table-components';
import { ColumnDef, FactorColumnDef, SequenceColumnDef } from './types';

const HeaderCell = (props: {
	column: FactorColumnDef;
	last: boolean;
	togglePinned: (pin: boolean) => void;
}) => {
	const { column, last, togglePinned } = props;

	const cellRef = useRef<HTMLDivElement>(null);

	return <DataSetTableHeaderCell lastColumn={last} ref={cellRef}>
		<span>{column.factor.label || column.factor.name}</span>
		{column.fixed
			? <LinkButton ignoreHorizontalPadding={true} onClick={() => togglePinned(false)}
			              tooltip='Unpin Column' right={true} offsetX={-11} offsetY={8}>
				<FontAwesomeIcon icon={faMapPin}/>
				<FontAwesomeIcon icon={faSlash} color='var(--console-danger-color)'/>
			</LinkButton>
			: <LinkButton ignoreHorizontalPadding={true} onClick={() => togglePinned(true)}
			              tooltip='Pin Column' right={true} offsetX={-11} offsetY={8}>
				<FontAwesomeIcon icon={faMapPin}/>
			</LinkButton>}
	</DataSetTableHeaderCell>;
};

export const DataSetTable = forwardRef((props: {
	displayColumns: Array<FactorColumnDef>;
	showRowNo: boolean;
	data: Array<Array<any>>;
	pinColumn: (column: FactorColumnDef, pin: boolean) => void;
}, ref: ForwardedRef<HTMLDivElement>) => {
	const { displayColumns, showRowNo, data, pinColumn } = props;

	const [ rowNoColumnWidth ] = useState(40);

	const onColumnPinToggle = (column: FactorColumnDef) => (pin: boolean) => pinColumn(column, pin);

	const allDisplayColumns: Array<ColumnDef> = [ ...displayColumns ];
	if (showRowNo) {
		allDisplayColumns.unshift({ fixed: true, width: rowNoColumnWidth } as SequenceColumnDef);
	}
	const autoFill = !showRowNo;

	return <DataSetTableContainer columns={allDisplayColumns} autoFill={autoFill} ref={ref}>
		<DataSetTableHeader columns={allDisplayColumns} autoFill={autoFill}>
			{showRowNo
				? <DataSetTableHeaderCell lastColumn={displayColumns.length === 0}>#</DataSetTableHeaderCell>
				: null}
			{displayColumns.map((column, columnIndex, columns) => {
				const lastColumn = showRowNo && columnIndex === columns.length - 1;
				return <HeaderCell column={column}
				                   last={lastColumn}
				                   togglePinned={onColumnPinToggle(column)}
				                   key={`0-${columnIndex}`}/>;
			})}
			{autoFill ? <DataSetTableHeaderCell lastColumn={false}/> : null}
		</DataSetTableHeader>
		<DataSetTableBody columns={allDisplayColumns} autoFill={autoFill}>
			{data.map((row, rowIndex, rows) => {
				const lastRow = rows.length - 1 === rowIndex;
				return <Fragment key={`${rowIndex}`}>
					{showRowNo
						? <DataSetTableBodyCell lastRow={lastRow} lastColumn={displayColumns.length === 0}>
							{rowIndex + 1}
						</DataSetTableBodyCell>
						: null}
					{displayColumns.map((def, columnIndex, columns) => {
						const lastColumn = showRowNo && columnIndex === columns.length - 1;
						return <DataSetTableBodyCell lastRow={lastRow} lastColumn={lastColumn}
						                             key={`${rowIndex}-${columnIndex}`}>
							{`${row[def.index]}`}
						</DataSetTableBodyCell>;
					})}
					{autoFill ? <DataSetTableBodyCell lastRow={lastRow} lastColumn={false}/> : null}
				</Fragment>;
			})}
		</DataSetTableBody>
	</DataSetTableContainer>;
});
