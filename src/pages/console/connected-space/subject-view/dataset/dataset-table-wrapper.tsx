import styled from 'styled-components';

export const DataSetTableWrapper = styled.div.attrs({
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
