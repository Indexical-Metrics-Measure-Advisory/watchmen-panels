import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { DataPage } from '../../../../../services/admin/types';
import { fetchSubjectData } from '../../../../../services/console/space';
import { ConnectedConsoleSpace, ConsoleSpaceSubject } from '../../../../../services/console/types';
import { DataSetHeader } from './dataset-header';
import { DataSetTableContextProvider } from './dataset-table-context';
import { DataSetTableWrapper } from './dataset-table-wrapper';
import { ColumnDefs } from './types';
import { buildFactorMap, filterColumns } from './utils';

const DataSetContainer = styled.div.attrs({
	'data-widget': 'console-subject-view-dataset'
})`
	align-self: flex-end;
	display: flex;
	position: absolute;
	flex-direction: column;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: var(--bg-color);
	transition: top 300ms ease-in-out, height 300ms ease-in-out, opacity 300ms ease-in-out;
	overflow: hidden;
	&[data-visible=false] {
		opacity: 0;
		top: 100%;
		height: 0;
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

	const [ loading, setLoading ] = useState(false);
	const [ data, setData ] = useState<DataPage<Array<any>>>({
		itemCount: 0,
		pageNumber: 1,
		pageSize: 1,
		pageCount: 1,
		data: []
	});

	const fetchData = (pageNumber: number = 1) => {
		(async () => {
			try {
				setLoading(true);
				const data = await fetchSubjectData({ subjectId: subject.subjectId, pageNumber, pageSize: 100 });
				setData(data);
			} catch (e) {
				console.groupCollapsed(`%cError on fetch subject data.`, 'color:rgb(251,71,71)');
				console.error(e);
				console.groupEnd();
			} finally {
				setLoading(false);
			}
		})();
	};
	const [ columnDefs, setColumnDefs ] = useState<ColumnDefs>(() => {
		return {
			fixed: [],
			data: filterColumns({ columns: subject.dataset?.columns || [], factorMap: buildFactorMap(space.topics) })
		};
	});

	// fetch data
	useEffect(() => {
		if (!visible) {
			return;
		}
		// rebuild columns in case of definition was changed
		setColumnDefs({
			fixed: [],
			data: filterColumns({ columns: subject.dataset?.columns || [], factorMap: buildFactorMap(space.topics) })
		});
		fetchData();
		// eslint-disable-next-line
	}, [ visible ]);

	const onToDefClicked = () => switchToDefinition();

	const hasColumns = columns.length !== 0;

	return <DataSetTableContextProvider>
		<DataSetContainer data-visible={visible}>
			<DataSetHeader subject={subject} data={data}
			               onHide={() => onVisibleChanged(false)}
			               fetchData={fetchData}/>
			{hasColumns
				? <DataSetTableWrapper space={space} subject={subject}
				                       columnDefs={columnDefs}
				                       data={data}/>
				: <DataSetNoDef>
					<span>No column defined yet, switch to <span onClick={onToDefClicked}>definition</span>?</span>
				</DataSetNoDef>}
			<DataSetLoading data-visible={loading}>
				<FontAwesomeIcon icon={faSpinner} spin={true}/>
			</DataSetLoading>
		</DataSetContainer>
	</DataSetTableContextProvider>;
};