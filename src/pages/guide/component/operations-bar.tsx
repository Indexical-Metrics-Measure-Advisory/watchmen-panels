import styled from 'styled-components';

export const OperationBar = styled.div.attrs({
	'data-widget': 'guide-operation-bar'
})`
	display: flex;
	margin-top: var(--margin);
	padding: 0 var(--margin);
	> button:not(:first-child) {
		margin-left: var(--margin);
	}
`;
export const OperationBarPlaceholder = styled.div`
	flex-grow: 1;
`;
