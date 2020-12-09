import styled from 'styled-components';

export const ActionBody = styled.div`
	display: grid;
	grid-auto-rows: minmax(32px, auto);
	align-items: center;
`;
export const ActionBody2Columns = styled(ActionBody)`
	grid-template-columns: minmax(100px, auto) 1fr;
	grid-column-gap: calc(var(--margin) / 2);
	margin-left: calc(var(--margin) / -2 - 100px);
	> div:nth-child(2n + 1) {
		text-align: right;
	}
`;

export const ActionBodyItemLabel = styled.div`
	font-variant: petite-caps;
`;