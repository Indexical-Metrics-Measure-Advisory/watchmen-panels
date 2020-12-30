import { faLock, faLockOpen, faSortAmountDown, faSortAmountUpAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ForwardedRef, forwardRef, Fragment, useRef, useState } from 'react';
import { DataPage } from '../../../../../services/admin/types';
import { LinkButton } from '../../../../component/console/link-button';
import {
	DataSetTableBody,
	DataSetTableBodyCell,
	DataSetTableContainer,
	DataSetTableHeader,
	DataSetTableHeaderCell,
	HEADER_HEIGHT,
	HeaderCellButtons
} from './dataset-table-components';
import { useDataSetTableContext } from './dataset-table-context';
import { ColumnDef, FactorColumnDef, SequenceColumnDef } from './types';

enum ResizeState {
	NONE = 'none',
	PICK_COLUMN = 'pick-column',
	CAN_RESIZE = 'can-resize',
	RESIZING = 'resizing'
}

const RESIZE_DEVIATION = 3;

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
			<LinkButton ignoreHorizontalPadding={true} tooltip='Sort ascending'
			            right={true} offsetX={-6} offsetY={6}
			            onClick={sortColumnAsc}>
				<FontAwesomeIcon icon={faSortAmountUpAlt}/>
			</LinkButton>
			<LinkButton ignoreHorizontalPadding={true} tooltip='Sort descending'
			            right={true} offsetX={-6} offsetY={6}
			            onClick={sortColumnDesc}>
				<FontAwesomeIcon icon={faSortAmountDown}/>
			</LinkButton>
			{isFixTable
				? <LinkButton ignoreHorizontalPadding={true} tooltip='Unfix me and follows'
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

const findDataTable = (element: HTMLElement) => {
	const widgetType = element.getAttribute('data-widget');
	if (widgetType !== 'console-subject-view-dataset-table') {
		return element.closest('div[data-widget="console-subject-view-dataset-table"]')! as HTMLElement;
	}
	return element;
};
const manageCursor = (options: {
	eventTarget: HTMLElement;
	mouseClientX: number;
	mouseClientY: number;
	isFixTable: boolean;
	rowNoColumnWidth: number;
	displayColumns: Array<FactorColumnDef>;
	fixColumns: Array<FactorColumnDef>;
	changeResizeState: (state: ResizeState) => void;
}) => {
	const {
		eventTarget, mouseClientX, mouseClientY,
		isFixTable, rowNoColumnWidth,
		displayColumns, fixColumns,
		changeResizeState
	} = options;

	const element = findDataTable(eventTarget);
	const { top: containerTop, left: containerLeft } = element.getBoundingClientRect();
	if (mouseClientY - containerTop > HEADER_HEIGHT) {
		// not in header
		changeResizeState(ResizeState.NONE);
		return;
	}
	const left = mouseClientX - containerLeft;
	if (isFixTable && left <= rowNoColumnWidth) {
		// in row number column
		changeResizeState(ResizeState.NONE);
		return;
	}

	// compute every resize point
	const widths = displayColumns.map(column => column.width);
	for (let index = 1, count = widths.length; index < count; index++) {
		widths[index] += widths[index - 1];
	}

	if (!isFixTable && left > widths[widths.length - 1] + RESIZE_DEVIATION - element.scrollLeft) {
		// in filler column
		changeResizeState(ResizeState.NONE);
		return;
	}

	const offsetLeft = isFixTable ? left - rowNoColumnWidth : left;
	let canResize;
	if (isFixTable) {
		canResize = widths.some(width => Math.abs(width - offsetLeft) <= RESIZE_DEVIATION);
	} else {
		// resize self, or last fix column
		canResize = (fixColumns.length !== 0 && offsetLeft <= RESIZE_DEVIATION)
			|| widths.some(width => Math.abs(width - offsetLeft - element.scrollLeft) <= RESIZE_DEVIATION);
	}
	changeResizeState(canResize ? ResizeState.CAN_RESIZE : ResizeState.PICK_COLUMN);
};

export const DataSetTable = forwardRef((props: {
	displayColumns: Array<FactorColumnDef>;
	fixColumns: Array<FactorColumnDef>;
	data: DataPage<Array<any>>;
	isFixTable: boolean;
	rowNoColumnWidth: number;
	onColumnFixChange: (column: FactorColumnDef, fix: boolean) => void;
	onColumnSort: (column: FactorColumnDef, asc: boolean) => void;
}, ref: ForwardedRef<HTMLDivElement>) => {
	const {
		displayColumns, fixColumns,
		isFixTable,
		rowNoColumnWidth,
		data: { data, pageNumber, pageSize },
		onColumnFixChange, onColumnSort
	} = props;

	const { selectionChange } = useDataSetTableContext();
	const [ resizeState, setResizeState ] = useState<ResizeState>(ResizeState.NONE);
	const onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
		if (resizeState !== ResizeState.RESIZING) {
			manageCursor({
				eventTarget: event.target as HTMLElement,
				mouseClientX: event.clientX,
				mouseClientY: event.clientY,
				isFixTable,
				rowNoColumnWidth,
				displayColumns,
				fixColumns,
				changeResizeState: setResizeState
			});
		} else {

		}
	};
	const onMouseDown = () => {
		if (resizeState === ResizeState.CAN_RESIZE) {
			setResizeState(ResizeState.RESIZING);
		}
	};
	const onMouseUp = () => {
		if (resizeState === ResizeState.RESIZING) {
			setResizeState(ResizeState.PICK_COLUMN);
		}
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
	                              data-resize-state={resizeState}
	                              onMouseMove={onMouseMove} onMouseDown={onMouseDown} onMouseUp={onMouseUp}
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
							{`${row[def.index]}`}
						</DataSetTableBodyCell>;
					})}
					{autoFill ? <DataSetTableBodyCell lastRow={lastRow} lastColumn={false} data-filler={true}/> : null}
				</Fragment>;
			})}
		</DataSetTableBody>
	</DataSetTableContainer>;
});
