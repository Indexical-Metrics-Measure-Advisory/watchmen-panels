import styled from 'styled-components';

export const EditPanelButtons = styled.div`
	grid-column: span 2;
	display: flex;
	justify-content: flex-end;
	> button {
		font-size: 1.2em;
		height: 32px;
		min-width: 120px;
		&:not(:first-child) {
			margin-left: calc(var(--margin) / 2);
		}
	}
`;