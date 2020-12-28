import { faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { DataPage } from '../../../../../services/admin/types';
import { fetchSubjectData } from '../../../../../services/console/space';
import {
	ConnectedConsoleSpace,
	ConsoleSpaceSubject,
	ConsoleTopic,
	ConsoleTopicFactor
} from '../../../../../services/console/types';
import { LinkButton } from '../../../../component/console/link-button';
import { SubjectPanelHeader } from '../components';

type FactorMap = Map<string, { topic: ConsoleTopic, factor: ConsoleTopicFactor }>;
type ColumnWidths = Map<string, number>;

interface ColumnDef {
	fixed: boolean;
	width: number;
}

interface FactorColumnDef extends ColumnDef {
	topic: ConsoleTopic;
	factor: ConsoleTopicFactor;
}

interface SequenceColumnDef extends ColumnDef {
}

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
const DataSetTableWrapper = styled.div.attrs({
	'data-widget': 'console-subject-view-dataset-table-wrapper'
})`
	display: flex;
	position: absolute;
	top: 40px;
	left: 0;
	width: 100%;
	height: calc(100% - 40px);
	overflow: hidden;
`;
const DataSetTable = styled.div.attrs<{ columns: Array<ColumnDef>, autoFill: boolean }>(({ columns, autoFill }) => {
	return {
		'data-widget': 'console-subject-view-dataset-table',
		style: {
			minWidth: autoFill ? 'unset' : columns.reduce((width, column) => width + column.width, 0)
		}
	};
})<{ columns: Array<ColumnDef>, autoFill: boolean }>`
	display: flex;
	flex-direction: column;
	overflow: hidden;
	& + div[data-widget='console-subject-view-dataset-table'] {
		flex-grow: 1;
		overflow: auto;
	}
`;
const DataSetTableHeader = styled.div
	.attrs<{ columns: Array<ColumnDef>, autoFill: boolean }>(
		({ columns, autoFill }) => {
			return {
				'data-widget': 'console-subject-view-dataset-table-header',
				style: {
					gridTemplateColumns: autoFill ? `${columns.map(def => `${def.width}px`).join(' ')} minmax(40px, 1fr)` : columns.map(def => `${def.width}px`).join(' ')
				}
			};
		})<{ columns: Array<ColumnDef>, autoFill: boolean }>`
	display: grid;
	position: sticky;
	top: 0;
	justify-items: stretch;
	align-items: stretch;
	height: 32px;
	z-index: 1;
`;
const DataSetTableHeaderCell = styled.div.attrs<{ filler?: true }>(({ filler }) => {
	return {
		'data-widget': 'console-subject-view-dataset-table-header-cell',
		style: {
			borderRightColor: filler ? 'transparent' : 'var(--border-color)'
		}
	};
})<{ filler?: true }>`
	display: flex;
	align-items: center;
	font-size: 0.8em;
	font-family: var(--console-title-font-family);
	background-color: var(--bg-color);
	padding: 0 8px;
	border-right: var(--border);
	border-bottom: var(--border);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;
const DataSetTableBody = styled.div
	.attrs<{ columns: Array<ColumnDef>, autoFill: boolean }>(({ columns, autoFill }) => {
		return {
			'data-widget': 'console-subject-view-dataset-table-body',
			style: {
				gridTemplateColumns: autoFill ? `${columns.map(def => `${def.width}px`).join(' ')} minmax(40px, 1fr)` : columns.map(def => `${def.width}px`).join(' ')
			}
		};
	})<{ columns: Array<ColumnDef>, autoFill: boolean }>`
	display: grid;
	justify-items: stretch;
	align-items: stretch;
	grid-auto-rows: 32px;
`;
const DataSetTableBodyCell = styled.div.attrs<{ lastRow: boolean, filler?: true }>(({ lastRow, filler }) => {
	return {
		'data-widget': 'console-subject-view-dataset-table-body-cell',
		style: {
			borderBottomColor: lastRow ? 'transparent' : 'var(--border-color)',
			borderRightColor: filler ? 'transparent' : 'var(--border-color)'
		}
	};
})<{ lastRow: boolean, filler?: true }>`
	display: flex;
	align-items: center;
	font-size: 0.8em;
	padding: 0 8px;
	background-color: var(--invert-color);
	border-right: var(--border);
	border-bottom: var(--border);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
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
const Rotate = keyframes`
	from {
		transform: rotateZ(0deg);
	}
	to {
		transform: rotateZ(360deg);
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
		animation: ${Rotate} infinite 1500ms linear;
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
	const [ columnWidths ] = useState<ColumnWidths>(() => {
		const widths: ColumnWidths = new Map();
		columns.forEach(({ factorId }) => {
			if (factorId) {
				widths.set(factorId, 200);
			}
		});
		widths.set('#', 40);
		return widths;
	});
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
	useEffect(() => {
		if (!tableRef.current || !fixedTableRef.current) {
			return;
		}
		const scrollBarHeight = tableRef.current.offsetHeight - tableRef.current.clientHeight;
		if (scrollBarHeight <= 0) {
			return;
		}
		fixedTableRef.current.style.height = `calc(100% - ${scrollBarHeight}px)`;
		fixedTableRef.current.style.boxShadow = `0 1px 0 0 var(--border-color)`;
		const onTableScroll = () => {
			fixedTableRef.current!.scrollTop = tableRef.current!.scrollTop;
		};
		tableRef.current.addEventListener('scroll', onTableScroll);
		return () => {
			tableRef.current!.removeEventListener('scroll', onTableScroll);
		};
	});

	const onToDefClicked = () => switchToDefinition();

	const hasColumns = columns.length !== 0;
	const factorMap = buildFactorMap(space.topics);
	const columnDefs: Array<ColumnDef> = columns.map(({ factorId }) => {
		if (!factorId) {
			return null;
		}
		const { topic, factor } = factorMap.get(factorId)!;
		const width = columnWidths.get(factorId) || 200;
		return { topic, factor, fixed: false, width } as FactorColumnDef;
	}).filter(x => x) as Array<ColumnDef>;
	const fixedColumnDefs: Array<ColumnDef> = [ {
		fixed: true,
		width: columnWidths.get('#') || 40
	} as SequenceColumnDef ];

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
				<DataSetTable columns={fixedColumnDefs} autoFill={false} ref={fixedTableRef}>
					<DataSetTableHeader columns={fixedColumnDefs} autoFill={false}>
						<DataSetTableHeaderCell>#</DataSetTableHeaderCell>
					</DataSetTableHeader>
					<DataSetTableBody columns={fixedColumnDefs} autoFill={false}>
						{data.data.map((row, rowIndex, rows) => {
							const lastRow = rows.length - 1 === rowIndex;
							return <DataSetTableBodyCell lastRow={lastRow} key={`${rowIndex}-#`}>
								{rowIndex + 1}
							</DataSetTableBodyCell>;
						})}
					</DataSetTableBody>
				</DataSetTable>
				<DataSetTable columns={columnDefs} autoFill={true} ref={tableRef}>
					<DataSetTableHeader columns={columnDefs} autoFill={true}>
						{columns.map(({ factorId }) => {
							if (!factorId) {
								return null;
							}
							const { factor } = factorMap.get(factorId)!;
							return <DataSetTableHeaderCell key={factorId}>
								<span>{factor.label || factor.name}</span>
							</DataSetTableHeaderCell>;
						}).filter(x => x)}
						<DataSetTableHeaderCell filler={true}/>
					</DataSetTableHeader>
					<DataSetTableBody columns={columnDefs} autoFill={true}>
						{data.data.map((row, rowIndex, rows) => {
							const lastRow = rows.length - 1 === rowIndex;
							return <Fragment key={`${rowIndex}-#`}>
								{row.map((cell, cellIndex) => {
									return <DataSetTableBodyCell lastRow={lastRow} key={`${rowIndex}-${cellIndex}`}>
										{`${cell}`}
									</DataSetTableBodyCell>;
								})}
								<DataSetTableBodyCell lastRow={lastRow} filler={true}/>
							</Fragment>;
						})}
					</DataSetTableBody>
				</DataSetTable>
			</DataSetTableWrapper>
			: <DataSetNoDef>
				<span>No columns defined yet, switch to <span onClick={onToDefClicked}>definition</span>?</span>
			</DataSetNoDef>}
		<DataSetLoading data-visible={loading}>
			<FontAwesomeIcon icon={faSpinner}/>
		</DataSetLoading>
	</DataSetContainer>;
};