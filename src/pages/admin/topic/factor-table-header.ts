import styled from 'styled-components';
import {
	FACTOR_TABLE_HEADER_HEIGHT,
	FACTOR_TABLE_LABEL_COLUMN_WIDTH,
	FACTOR_TABLE_MAX_LABEL_COLUMN_WIDTH,
	FACTOR_TABLE_MAX_NAME_COLUMN_WIDTH,
	FACTOR_TABLE_NAME_COLUMN_WIDTH,
	FACTOR_TABLE_TYPE_COLUMN_WIDTH
} from './factor-table-constants';

export const FactorTableHeader = styled.div`
	display: grid;
	grid-template-columns: ${FACTOR_TABLE_NAME_COLUMN_WIDTH}px ${FACTOR_TABLE_LABEL_COLUMN_WIDTH}px ${FACTOR_TABLE_TYPE_COLUMN_WIDTH}px 1fr;
	transition: all 300ms ease-in-out;
	&[data-max=true] {
		grid-template-columns: ${FACTOR_TABLE_MAX_NAME_COLUMN_WIDTH}px ${FACTOR_TABLE_MAX_LABEL_COLUMN_WIDTH}px ${FACTOR_TABLE_TYPE_COLUMN_WIDTH}px 1fr;
	}
	> div {
		display: flex;
		align-items: center;
		height: ${FACTOR_TABLE_HEADER_HEIGHT}px;
		border-bottom: var(--border);
		padding-left: calc(var(--margin) / 2);
		font-variant: petite-caps;
		font-weight: var(--font-bold);
	}
`;
