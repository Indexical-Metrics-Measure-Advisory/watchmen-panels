import styled from 'styled-components';
import { FACTOR_TABLE_FOOTER_HEIGHT } from './factor-table-constants';

export const FactorTableFooter = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-end;
	height: ${FACTOR_TABLE_FOOTER_HEIGHT}px;
	border-top: var(--border);
	transition: all 300ms ease-in-out;
	> button:not(:first-child) {
		margin-left: calc(var(--margin) / 3);
	}
	> button:last-child {
		&[data-max=true] > svg {
			transform: rotateZ(225deg);
		}
		> svg {
			transform: rotateZ(45deg);
			transition: all 300ms ease-in-out;
			margin-top: 2px;
			margin-right: calc(var(--margin) / 3);
		}
	}
`;
