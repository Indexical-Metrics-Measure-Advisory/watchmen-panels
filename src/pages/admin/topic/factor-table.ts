import styled from 'styled-components';
import {
	FACTOR_BUTTONS_WIDTH,
	FACTOR_ROW_HEIGHT,
	FACTOR_TABLE_BODY_MAX_HEIGHT,
	FACTOR_TABLE_FOOTER_HEIGHT,
	FACTOR_TABLE_HEADER_HEIGHT,
	FACTOR_TABLE_VERTICAL_GAP
} from './factor-table-constants';

export const FactorTable = styled.div.attrs<{ expanded: boolean, factorCount: number }>(({ expanded, factorCount }) => {
	const offset = FACTOR_TABLE_HEADER_HEIGHT + FACTOR_TABLE_FOOTER_HEIGHT + FACTOR_TABLE_VERTICAL_GAP;
	return {
		style: {
			height: expanded ? (Math.min(FACTOR_TABLE_BODY_MAX_HEIGHT + offset, factorCount * FACTOR_ROW_HEIGHT + offset)) : 0
		}
	};
})<{ expanded: boolean, factorCount: number }>`
	grid-column: span 2;
	display: flex;
	flex-direction: column;
	font-size: 0.8em;
	margin: 0 -40px 24px ${0 - FACTOR_BUTTONS_WIDTH}px;
	padding: 0 40px 0 ${FACTOR_BUTTONS_WIDTH}px;
	overflow-x: hidden;
	overflow-y: hidden;
	transition: all 300ms ease-in-out;

	&[data-max=true] {
		// editor in grid layout, 30% 70%, column gap is 32px, table is second column in editor.
		margin-left: calc((100% + 32px) / 0.7 * 0.3 * -1 - 32px - ${FACTOR_BUTTONS_WIDTH}px);
		z-index: 1;
		+ div {
			margin-left: calc((100% + 32px) / 0.7 * 0.3 * -1 - 32px);
		}
	}
`;
