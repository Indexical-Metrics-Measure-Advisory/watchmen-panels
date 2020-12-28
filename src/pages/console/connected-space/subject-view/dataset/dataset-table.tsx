import { faMapPin, faSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ForwardedRef, forwardRef, Fragment, useState } from 'react';
import { LinkButton } from '../../../../component/console/link-button';
import {
	DataSetTableBody,
	DataSetTableBodyCell,
	DataSetTableContainer,
	DataSetTableHeader,
	DataSetTableHeaderCell
} from './dataset-table-components';
import { ColumnDef, FactorColumnDef, SequenceColumnDef } from './types';

export const DataSetTable = forwardRef((props: {
	displayColumns: Array<FactorColumnDef>;
	showRowNo: boolean;
	data: Array<Array<any>>;
	pinColumn: (column: FactorColumnDef, pin: boolean) => void;
}, ref: ForwardedRef<HTMLDivElement>) => {
	const { displayColumns, showRowNo, data, pinColumn } = props;

	const [ rowNoColumnWidth ] = useState(40);

	const onColumnPinClicked = (column: FactorColumnDef) => () => pinColumn(column, true);
	const onColumnUnpinClicked = (column: FactorColumnDef) => () => pinColumn(column, false);

	const allDisplayColumns: Array<ColumnDef> = [ ...displayColumns ];
	if (showRowNo) {
		allDisplayColumns.unshift({ fixed: true, width: rowNoColumnWidth } as SequenceColumnDef);
	}
	const autoFill = !showRowNo;

	return <DataSetTableContainer columns={allDisplayColumns} autoFill={autoFill} ref={ref}>
		<DataSetTableHeader columns={allDisplayColumns} autoFill={autoFill}>
			{showRowNo ? <DataSetTableHeaderCell>#</DataSetTableHeaderCell> : null}
			{displayColumns.map((column, columnIndex) => {
				return <DataSetTableHeaderCell key={`0-${columnIndex}`}>
					<span>{column.factor.label || column.factor.name}</span>
					{column.fixed
						? <LinkButton ignoreHorizontalPadding={true} onClick={onColumnUnpinClicked(column)}
						              tooltip='Unpin Column' right={true} offsetX={-11} offsetY={8}>
							<FontAwesomeIcon icon={faMapPin}/>
							<FontAwesomeIcon icon={faSlash} color='var(--console-danger-color)'/>
						</LinkButton>
						: <LinkButton ignoreHorizontalPadding={true} onClick={onColumnPinClicked(column)}
						              tooltip='Pin Column' right={true} offsetX={-11} offsetY={8}>
							<FontAwesomeIcon icon={faMapPin}/>
						</LinkButton>}
				</DataSetTableHeaderCell>;
			})}
			{autoFill ? <DataSetTableHeaderCell/> : null}
		</DataSetTableHeader>
		<DataSetTableBody columns={allDisplayColumns} autoFill={autoFill}>
			{data.map((row, rowIndex, rows) => {
				const lastRow = rows.length - 1 === rowIndex;
				return <Fragment key={`${rowIndex}`}>
					{showRowNo
						? <DataSetTableBodyCell lastRow={lastRow}>
							{rowIndex + 1}
						</DataSetTableBodyCell>
						: null}
					{displayColumns.map((def, columnIndex) => {
						return <DataSetTableBodyCell lastRow={lastRow} key={`${rowIndex}-${columnIndex}`}>
							{`${row[def.index]}`}
						</DataSetTableBodyCell>;
					})}
					{autoFill ? <DataSetTableBodyCell lastRow={lastRow}/> : null}
				</Fragment>;
			})}
		</DataSetTableBody>
	</DataSetTableContainer>;
});
