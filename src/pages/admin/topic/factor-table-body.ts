import styled from 'styled-components';
import {
	FACTOR_BUTTONS_WIDTH,
	FACTOR_ROW_EDITOR_HEIGHT,
	FACTOR_ROW_HEIGHT,
	FACTOR_TABLE_BODY_MAX_HEIGHT,
	FACTOR_TABLE_LABEL_COLUMN_WIDTH,
	FACTOR_TABLE_MAX_LABEL_COLUMN_WIDTH,
	FACTOR_TABLE_MAX_NAME_COLUMN_WIDTH,
	FACTOR_TABLE_NAME_COLUMN_WIDTH,
	FACTOR_TABLE_TYPE_COLUMN_WIDTH
} from './factor-table-constants';

export const FactorTableBody = styled.div`
	display: grid;
	grid-template-columns: ${FACTOR_TABLE_NAME_COLUMN_WIDTH}px ${FACTOR_TABLE_LABEL_COLUMN_WIDTH}px ${FACTOR_TABLE_TYPE_COLUMN_WIDTH}px 1fr;
	margin: 0 -4px 0 ${0 - FACTOR_BUTTONS_WIDTH}px;
	padding: 0 4px 0 ${FACTOR_BUTTONS_WIDTH}px;
	max-height: ${FACTOR_TABLE_BODY_MAX_HEIGHT}px;
	overflow-x: visible;
	overflow-y: auto;
	transition: all 300ms ease-in-out;
	&[data-max=true] {
		grid-template-columns: ${FACTOR_TABLE_MAX_NAME_COLUMN_WIDTH}px ${FACTOR_TABLE_MAX_LABEL_COLUMN_WIDTH}px ${FACTOR_TABLE_TYPE_COLUMN_WIDTH}px 1fr;
	}
	&::-webkit-scrollbar {
		background-color: transparent;
		height: 4px;
		width: 4px;
	}
	&::-webkit-scrollbar-track {
		background-color: var(--scrollbar-background-color);
		border-radius: 2px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: var(--console-favorite-color);
		border-radius: 2px;
	}
`;
export const FactorCell = styled.div`
	display: flex;
	position: relative;
	align-items: center;
	height: ${FACTOR_ROW_HEIGHT}px;
	padding-left: calc(var(--margin) / 2);
	transition: all 300ms ease-in-out;
	&:nth-child(8n + 5), &:nth-child(8n + 6), &:nth-child(8n + 7), &:nth-child(8n) {
		background-color: var(--pipeline-bg-color);
	}
	> input {
		height: ${FACTOR_ROW_EDITOR_HEIGHT}px;
		width: calc(100% + var(--input-indent));
		border-color: transparent;
		margin-left: calc(var(--input-indent) * -1);
		color: var(--console-font-color);
		&:hover {
			border-color: var(--border-color);
			box-shadow: var(--console-hover-shadow);
		}
		&:focus {
			border-color: var(--console-primary-color);
			color: var(--font-color);
			background-color: var(--bg-color);
			box-shadow: var(--console-primary-hover-shadow);
			z-index: 1;
		}
	}
	> div[data-widget=dropdown] {
		height: ${FACTOR_ROW_EDITOR_HEIGHT}px;
		width: calc(100% + var(--input-indent));
		border-color: transparent;
		margin-left: calc(var(--input-indent) * -1);
		color: var(--console-font-color);
		&:hover {
			border-color: var(--border-color);
			box-shadow: var(--console-hover-shadow);
		}
		&:focus {
			border-color: var(--console-primary-color);
			color: var(--font-color);
			background-color: var(--bg-color);
			box-shadow: var(--console-primary-hover-shadow);
			z-index: 1;
		}
		&[data-options-visible=true] {
			> div {
				border-color: var(--console-primary-color);
			}
		}
	}
`;
export const FactorNameCell = styled(FactorCell)`
	border-top-left-radius: var(--border-radius);
	border-bottom-left-radius: var(--border-radius);
	&:hover + div + div + div {
		> div {
			opacity: 1;
			pointer-events: auto;
		}
	}
`;
export const FactorLabelCell = styled(FactorCell)`
	&:hover + div + div {
		> div {
			opacity: 1;
			pointer-events: auto;
		}
	}
`;
export const FactorTypeCell = styled(FactorCell)`
	&:hover + div {
		> div {
			opacity: 1;
			pointer-events: auto;
		}
	}
`;
export const FactorDescCell = styled(FactorCell)`
	padding-right: calc(var(--margin) / 2);
	border-top-right-radius: var(--border-radius);
	border-bottom-right-radius: var(--border-radius);
	&:hover {
		// buttons
		> div {
			opacity: 1;
			pointer-events: auto;
		}
	}
	> input {
		margin-right: calc(var(--margin) / -2);
		width: calc(100% + var(--input-indent) * 2);
	}
`;
export const FactorButtons = styled.div`
	display: flex;
	position: absolute;
	opacity: 0;
	pointer-events: none;
	padding: 4px 8px;
	left: calc((${FACTOR_TABLE_NAME_COLUMN_WIDTH}px + ${FACTOR_TABLE_LABEL_COLUMN_WIDTH}px + ${FACTOR_TABLE_TYPE_COLUMN_WIDTH}px + ${FACTOR_BUTTONS_WIDTH}px) * -1);
	height: ${FACTOR_ROW_HEIGHT}px;
	&[data-max=true] {
		left: calc((${FACTOR_TABLE_MAX_NAME_COLUMN_WIDTH}px + ${FACTOR_TABLE_MAX_LABEL_COLUMN_WIDTH}px + ${FACTOR_TABLE_TYPE_COLUMN_WIDTH}px + ${FACTOR_BUTTONS_WIDTH}px) * -1);
	}
	button {
		width: 24px;
		height: 24px;
		font-size: 1em;
		color: var(--invert-color);
		border-radius: 12px;
		&:before {
			border-radius: 12px;
		}
		&:first-child {
			background-color: var(--console-danger-color);
			margin-right: calc(var(--margin) / 8);
		}
		&:last-child {
			background-color: var(--console-primary-color);
		}
	}
`;
