import {
	faAngleLeft,
	faAngleRight,
	faArrowAltCircleDown,
	faCloudDownloadAlt,
	faCompressAlt,
	faTimes
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';
import {DataPage} from '../../../../../services/admin/types';
import {ConsoleSpaceSubject} from '../../../../../services/console/types';
import {LinkButton} from '../../../../component/console/link-button';
import {SubjectPanelHeader} from '../components';
import {useDataSetTableContext} from './dataset-table-context';
import {ColumnDefs} from "./types";
import {fetchSubjectData} from "../../../../../services/console/space";
import dayjs from "dayjs";

const DataSetHeaderContainer = styled(SubjectPanelHeader)`
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
			> span {
				font-variant: unicase;
			}
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
	> button {
		width: 24px;
		height: 24px;
		margin-left: calc(var(--margin) / 8);
	}
`;

export const DataSetHeader = (props: {
	subject: ConsoleSpaceSubject;
	columnDefs: ColumnDefs;
	data: DataPage<Array<any>>;
	onHide: () => void;
	fetchData: (pageNumber: number) => void;
}) => {
	const {subject, columnDefs, data, onHide, fetchData} = props;

	const {selectionChange, compressColumnWidth} = useDataSetTableContext();
	const onPreviousPageClicked = () => {
		fetchData(data.pageNumber - 1);
		selectionChange(false, -1, -1);
	};
	const onNextPageClicked = () => {
		fetchData(data.pageNumber + 1);
		selectionChange(false, -1, -1);
	};

	const download = (data: DataPage<Array<any>>) => {
		const header = [
			'',
			...columnDefs.fixed.map(column => column.alias || column.factor.label || column.factor.name),
			...columnDefs.data.map(column => column.alias || column.factor.label || column.factor.name)
		].join('\t');
		const body = data.data.map((row, rowIndex) => `${rowIndex + 1}\t${row.join('\t')}`).join('\n');
		const content = `${header}\n${body}\n`;
		const link = document.createElement('a');
		link.href = 'data:text/csv;charset=utf-8,' + encodeURI(content);
		link.target = '_blank';
		//provide the name for the CSV file to be downloaded
		link.download = `${subject.name}-Page${data.pageNumber}-TotalItemCount${data.data.length}-${dayjs().format('YYYYMMDDHHmmss')}.csv`;
		link.click();
	};

	const onDownloadCurrentClicked = () => {
		download(data);
	};
	const onDownloadAllClicked = async () => {
		const data = await fetchSubjectData({subjectId: subject.subjectId, pageNumber: 1, pageSize: 50000});
		download(data);
	};

	return <DataSetHeaderContainer>
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
				{data.itemCount} Row{data.itemCount !== 1 ? 's' : ''} Total, <span>#</span>{data.pageNumber} of {data.pageCount} Pages.
			</div>
			{data.pageNumber !== data.pageCount
				? <LinkButton ignoreHorizontalPadding={true}
				              tooltip='Next Page' center={true} offsetY={6}
				              onClick={onNextPageClicked}>
					<FontAwesomeIcon icon={faAngleRight}/>
				</LinkButton>
				: null}
		</div>
		<LinkButton onClick={compressColumnWidth} ignoreHorizontalPadding={true} tooltip='Compress Columns'
		            right={true} offsetX={-6}>
			<FontAwesomeIcon icon={faCompressAlt} transform={{rotate: 45}}/>
		</LinkButton>
		<LinkButton onClick={onDownloadCurrentClicked} ignoreHorizontalPadding={true} tooltip='Download Current Page'
		            right={true} offsetX={-6}>
			<FontAwesomeIcon icon={faArrowAltCircleDown}/>
		</LinkButton>
		<LinkButton onClick={onDownloadAllClicked} ignoreHorizontalPadding={true} tooltip='Download All Pages'
		            right={true} offsetX={-6}>
			<FontAwesomeIcon icon={faCloudDownloadAlt}/>
		</LinkButton>
		<LinkButton onClick={onHide} ignoreHorizontalPadding={true} tooltip='Minimize'
		            right={true} offsetX={-6}>
			<FontAwesomeIcon icon={faTimes}/>
		</LinkButton>
	</DataSetHeaderContainer>;

};