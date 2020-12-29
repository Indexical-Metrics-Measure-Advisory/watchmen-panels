import React, { RefObject, useEffect, useRef, useState } from 'react';
import { DataPage } from '../../../../../services/admin/types';
import { ConnectedConsoleSpace, ConsoleSpaceSubject } from '../../../../../services/console/types';
import { DataSetTable } from './dataset-table';
import { Wrapper } from './dataset-table-components';
import { DataSetTableSelection } from './dataset-table-selection';
import { ColumnDefs, FactorColumnDef } from './types';
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
};

export const DataSetTableWrapper = (props: {
	space: ConnectedConsoleSpace;
	subject: ConsoleSpaceSubject;
	data: DataPage<Array<any>>;
}) => {
	const { space, subject, data } = props;

	const fixTableRef = useRef<HTMLDivElement>(null);
	const dataTableRef = useRef<HTMLDivElement>(null);
	const [ rowNoColumnWidth ] = useState(40);
	const [ columnDefs, setColumnDefs ] = useState<ColumnDefs>(() => {
		return {
			fixed: [],
			data: filterColumns({ columns: subject.dataset?.columns || [], factorMap: buildFactorMap(space.topics) })
		};
	});
	useDecorateFixStyle({ fixTableRef, dataTableRef });

	const onColumnFixChange = (column: FactorColumnDef, fix: boolean) => {
		if (fix) {
			// move leading columns from data columns to fix columns
			const index = columnDefs.data.indexOf(column);
			setColumnDefs({
				fixed: [ ...columnDefs.fixed, ...columnDefs.data.splice(0, index + 1) ],
				data: [ ...columnDefs.data ]
			});
		} else {
			// move tailing columns from fix columns to data columns
			const index = columnDefs.fixed.indexOf(column);
			setColumnDefs({
				data: [ ...columnDefs.fixed.splice(index), ...columnDefs.data ],
				fixed: [ ...columnDefs.fixed ]
			});
		}
	};

	return <Wrapper>
		<DataSetTable displayColumns={columnDefs.fixed}
		              isFixTable={true} rowNoColumnWidth={rowNoColumnWidth}
		              data={data.data}
		              onColumnFixChange={onColumnFixChange}
		              ref={fixTableRef}/>
		<DataSetTable displayColumns={columnDefs.data}
		              isFixTable={false} rowNoColumnWidth={rowNoColumnWidth}
		              data={data.data}
		              onColumnFixChange={onColumnFixChange}
		              ref={dataTableRef}/>
		<DataSetTableSelection data={data} columnDefs={columnDefs}
		                       rowNoColumnWidth={rowNoColumnWidth}
		                       dataTableRef={dataTableRef}/>
	</Wrapper>;
};