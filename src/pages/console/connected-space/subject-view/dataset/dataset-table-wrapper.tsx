import React, { RefObject, useEffect, useRef, useState } from 'react';
import { DataPage } from '../../../../../services/admin/types';
import { ConnectedConsoleSpace, ConsoleSpaceSubject } from '../../../../../services/console/types';
import { DataSetTable } from './dataset-table';
import { Wrapper } from './dataset-table-components';
import { DataSetTableSelection } from './dataset-table-selection';
import { ColumnDefs } from './types';
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

export const DataSetTableWrapper = (props: {
	space: ConnectedConsoleSpace;
	subject: ConsoleSpaceSubject;
	data: DataPage<Array<any>>;
}) => {
	const { space, subject, data } = props;

	const fixTableRef = useRef<HTMLDivElement>(null);
	const dataTableRef = useRef<HTMLDivElement>(null);
	const [ rowNoColumnWidth ] = useState(40);
	const [ columnDefs ] = useState<ColumnDefs>(() => {
		return {
			fixed: [],
			data: filterColumns({ columns: subject.dataset?.columns || [], factorMap: buildFactorMap(space.topics) })
		};
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
		              ref={fixTableRef}/>
		<DataSetTable displayColumns={columnDefs.data}
		              showRowNo={false} rowNoColumnWidth={rowNoColumnWidth}
		              data={data.data}
		              ref={dataTableRef}/>
		<DataSetTableSelection data={data} columnDefs={columnDefs}
		                       rowNoColumnWidth={rowNoColumnWidth}
		                       dataTableRef={dataTableRef}/>
	</Wrapper>;
};