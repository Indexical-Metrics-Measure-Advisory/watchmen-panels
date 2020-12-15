import styled from 'styled-components';

export const ActionBody2Columns = styled.div.attrs({
	'data-widget': 'stage-unit-action-body'
})`
	display: grid;
	grid-template-columns: calc(120px - var(--margin) / 2) 1fr;
	grid-auto-rows: minmax(32px, auto);
	grid-column-gap: calc(var(--margin) / 2);
	align-items: center;
	> div:nth-child(2n + 1) {
		text-align: right;
		align-self: start;
		height: 32px;
		line-height: 32px;
	}
`;

export const ActionBodyItemLabel = styled.div.attrs({
	'data-widget': 'stage-unit-action-item-label'
})`
	font-variant: petite-caps;
`;