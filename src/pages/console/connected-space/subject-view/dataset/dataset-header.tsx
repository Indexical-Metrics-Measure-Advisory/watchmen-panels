import { faAngleLeft, faAngleRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';
import { DataPage } from '../../../../../services/admin/types';
import { ConsoleSpaceSubject } from '../../../../../services/console/types';
import { LinkButton } from '../../../../component/console/link-button';
import { SubjectPanelHeader } from '../components';
import { useDataSetTableContext } from './dataset-table-context';

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
`;

export const DataSetHeader = (props: {
	subject: ConsoleSpaceSubject;
	data: DataPage<Array<any>>;
	onHide: () => void;
	fetchData: (pageNumber: number) => void;
}) => {
	const { subject, data, onHide, fetchData } = props;

	const { selectionChange } = useDataSetTableContext();
	const onPreviousPageClicked = () => {
		fetchData(data.pageNumber - 1);
		selectionChange(false, -1, -1);
	};
	const onNextPageClicked = () => {
		fetchData(data.pageNumber + 1);
		selectionChange(false, -1, -1);
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
		<LinkButton onClick={onHide} ignoreHorizontalPadding={true} tooltip='Minimize'
		            center={true}>
			<FontAwesomeIcon icon={faTimes}/>
		</LinkButton>
	</DataSetHeaderContainer>;

};