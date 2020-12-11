import styled from 'styled-components';

export const ActionBody2Columns = styled.div`
	display: grid;
	grid-template-columns: calc(120px - var(--margin) / 2) 1fr;
	grid-auto-rows: minmax(32px, auto);
	grid-column-gap: calc(var(--margin) / 2);
	align-items: center;
	> div:nth-child(2n + 1) {
		text-align: right;
	}
`;

export const ActionBodyItemLabel = styled.div`
	font-variant: petite-caps;
`;