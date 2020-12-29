import { faAngleLeft, faAngleRight, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { DataPage } from '../../../../../services/admin/types';
import { fetchSubjectData } from '../../../../../services/console/space';
import { ConnectedConsoleSpace, ConsoleSpaceSubject } from '../../../../../services/console/types';
import { LinkButton } from '../../../../component/console/link-button';
import { SubjectPanelHeader } from '../components';
import { DataSetTableWrapper } from './dataset-table-wrapper';

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
const DataSetHeader = styled(SubjectPanelHeader)`
	> div:first-child {
		flex-grow: 0;
		margin-right: var(--margin);
	}
	> div:nth-child(2) {
		flex-grow: 1;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		font-family: var(--console-title-font-family);
		font-size: 0.8em;
		margin-right: var(--margin);
		> div {
			padding: 0 calc(var(--margin) / 4);
			font-variant: petite-caps;
		}
		> button {
			font-weight: normal;
			color: inherit;
			width: 24px;
			height: 24px;
		}
		> button[data-visible=false] {
			display: none;
		}
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
	// fetch data
	useEffect(() => {
		if (!visible) {
			return;
		}
		fetchData();
		// eslint-disable-next-line
	}, [ visible ]);

	const onPreviousPageClicked = () => fetchData(data.pageNumber - 1);
	const onNextPageClicked = () => fetchData(data.pageNumber + 1);
	const onToDefClicked = () => switchToDefinition();

	const hasColumns = columns.length !== 0;

	return <DataSetContainer data-visible={visible}>
		<DataSetHeader>
			<div>Dataset of {subject.name}</div>
			<div>
				{data.pageNumber !== 1
					? <LinkButton ignoreHorizontalPadding={true}
					              tooltip='Previous Page' center={true} offsetY={6}
					              onClick={onPreviousPageClicked}>
						<FontAwesomeIcon icon={faAngleLeft}/>
					</LinkButton>
					: null}
				<div>
					Page {data.pageNumber} of {data.pageCount}, {data.itemCount} Row{data.itemCount !== 1 ? 's' : ''} Total.
				</div>
				{data.pageNumber !== data.pageCount
					? <LinkButton ignoreHorizontalPadding={true}
					              tooltip='Next Page' center={true} offsetY={6}
					              onClick={onNextPageClicked}>
						<FontAwesomeIcon icon={faAngleRight}/>
					</LinkButton>
					: null}
			</div>
			<LinkButton onClick={() => onVisibleChanged(false)} ignoreHorizontalPadding={true} tooltip='Minimize'
			            center={true}>
				<FontAwesomeIcon icon={faTimes}/>
			</LinkButton>
		</DataSetHeader>
		{hasColumns
			? <DataSetTableWrapper space={space} subject={subject} data={data}/>
			: <DataSetNoDef>
				<span>No columns defined yet, switch to <span onClick={onToDefClicked}>definition</span>?</span>
			</DataSetNoDef>}
		<DataSetLoading data-visible={loading}>
			<FontAwesomeIcon icon={faSpinner} spin={true}/>
		</DataSetLoading>
	</DataSetContainer>;
};