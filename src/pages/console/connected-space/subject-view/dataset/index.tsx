import { faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { DataPage } from '../../../../../services/admin/types';
import { fetchSubjectData } from '../../../../../services/console/space';
import { ConnectedConsoleSpace, ConsoleSpaceSubject, ConsoleTopic } from '../../../../../services/console/types';
import { LinkButton } from '../../../../component/console/link-button';
import { SubjectPanelHeader } from '../components';
import { DataSetTable } from './dataset-table';
import { DataSetTableWrapper } from './dataset-table-wrapper';
import { FactorColumnDef, FactorMap } from './types';
import { filterColumns } from './utils';

const DataSetContainer = styled.div.attrs({
	'data-widget': 'console-subject-view-dataset'
})`
	align-self: flex-end;
	display: flex;
	position: relative;
	flex-direction: column;
	width: 100%;
	height: 100%;
	background-color: var(--bg-color);
	transition: height 300ms ease-in-out, opacity 300ms ease-in-out;
	overflow: hidden;
	&[data-visible=false] {
		opacity: 0;
		height: 0;
		width: 0;
		pointer-events: none;
	}
`;
const DataSetNoDef = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	position: absolute;
	top: 40px;
	left: 0;
	height: calc(100% - 40px);
	width: 100%;
	font-family: var(--console-title-font-family);
	font-size: 1.4em;
	> span > span {
		text-decoration: underline;
		cursor: pointer;
	}
`;
const DataSetLoading = styled.div`
	display: none;
	align-items: center;
	justify-content: center;
	position: absolute;
	top: 40px;
	left: 0;
	height: calc(100% - 40px);
	width: 100%;
	font-size: 1.4em;
	z-index: 1;
	&[data-visible=true] {
		display: flex;
	}
	&:before {
		content: '';
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: var(--invert-color);
		opacity: 0.3;
	}
	> svg {
		font-size: 5em;
		opacity: 0.3;
	}
`;

const buildFactorMap = (topics: Array<ConsoleTopic>): FactorMap => {
	return topics.reduce((map, topic) => {
		topic.factors.forEach(factor => {
			map.set(factor.factorId, { topic, factor });
		});
		return map;
	}, new Map());
};

export const DataSet = (props: {
	space: ConnectedConsoleSpace;
	subject: ConsoleSpaceSubject;
	visible: boolean
	onVisibleChanged: (visible: boolean) => void;
	switchToDefinition: () => void;
}) => {
	const {
		space, subject,
		visible, onVisibleChanged, switchToDefinition
	} = props;

	const { dataset = {} } = subject;
	const { columns = [] } = dataset;

	const fixedTableRef = useRef<HTMLDivElement>(null);
	const tableRef = useRef<HTMLDivElement>(null);
	const [ loading, setLoading ] = useState(false);
	const [ data, setData ] = useState<DataPage<Array<any>>>({
		itemCount: 0,
		pageNumber: 1,
		pageSize: 1,
		pageCount: 1,
		data: []
	});

	const [ columnDefs, setColumnDefs ] = useState<{ fixed: Array<FactorColumnDef>, data: Array<FactorColumnDef> }>(() => {
		return {
			fixed: [],
			data: filterColumns({ columns, factorMap: buildFactorMap(space.topics) })
		};
	});
	// fetch data
	useEffect(() => {
		(async () => {
			try {
				setLoading(true);
				const data = await fetchSubjectData(subject.subjectId);
				setData(data);
			} catch (e) {
				console.groupCollapsed(`%cError on fetch subject data.`, 'color:rgb(251,71,71)');
				console.error(e);
				console.groupEnd();
			} finally {
				setLoading(false);
			}
		})();
	}, [ subject.subjectId ]);
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

	const onToDefClicked = () => switchToDefinition();
	const pinColumn = (column: FactorColumnDef, pin: boolean) => {
		column.fixed = pin;
		if (pin) {
			// move to fixed
			setColumnDefs({
				fixed: [ ...columnDefs.fixed, column ],
				data: columnDefs.data.filter(c => c !== column)
			});
		} else {
			// remove from fixed
			setColumnDefs({
				fixed: columnDefs.fixed.filter(c => c !== column),
				// to original column index
				data: [ ...columnDefs.data, column ].sort((c1, c2) => c1.index - c2.index)
			});
		}
	};

	const hasColumns = columns.length !== 0;

	return <DataSetContainer data-visible={visible}>
		<SubjectPanelHeader>
			<div>Dataset of {subject.name}</div>
			<LinkButton onClick={() => onVisibleChanged(false)} ignoreHorizontalPadding={true} tooltip='Minimize'
			            center={true}>
				<FontAwesomeIcon icon={faTimes}/>
			</LinkButton>
		</SubjectPanelHeader>
		{hasColumns
			? <DataSetTableWrapper>
				<DataSetTable displayColumns={columnDefs.fixed} showRowNo={true} data={data.data}
				              pinColumn={pinColumn}
				              ref={fixedTableRef}/>
				<DataSetTable displayColumns={columnDefs.data} showRowNo={false} data={data.data}
				              pinColumn={pinColumn}
				              ref={tableRef}/>
			</DataSetTableWrapper>
			: <DataSetNoDef>
				<span>No columns defined yet, switch to <span onClick={onToDefClicked}>definition</span>?</span>
			</DataSetNoDef>}
		<DataSetLoading data-visible={loading}>
			<FontAwesomeIcon icon={faSpinner} spin={true}/>
		</DataSetLoading>
	</DataSetContainer>;
};