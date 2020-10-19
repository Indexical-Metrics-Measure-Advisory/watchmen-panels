import styled from 'styled-components';

export const OperationBar = styled.div`
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
