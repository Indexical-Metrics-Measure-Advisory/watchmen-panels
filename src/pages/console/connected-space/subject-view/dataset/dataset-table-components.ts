import styled from 'styled-components';
import { DataSetTableProps } from './types';

export const DataSetTableContainer = styled.div
	.attrs<DataSetTableProps>(({ columns, autoFill }) => {
		return {
			'data-widget': 'console-subject-view-dataset-table',
			style: {
				minWidth: autoFill ? 'unset' : columns.reduce((width, column) => width + column.width, 0)
			}
		};
	})<DataSetTableProps>`
	display: flex;
	flex-direction: column;
	overflow: hidden;
	& + div[data-widget='console-subject-view-dataset-table'] {
		flex-grow: 1;
		overflow: auto;
	}
`;

export const DataSetTableHeader = styled.div
	.attrs<DataSetTableProps>(({ columns, autoFill }) => {
		return {
			'data-widget': 'console-subject-view-dataset-table-header',
			style: {
				gridTemplateColumns: autoFill ? `${columns.map(def => `${def.width}px`).join(' ')} minmax(40px, 1fr)` : columns.map(def => `${def.width}px`).join(' ')
			}
		};
	})<DataSetTableProps>`
	display: grid;
	position: sticky;
	top: 0;
	justify-items: stretch;
	align-items: stretch;
	height: 32px;
	z-index: 1;
`;

export const DataSetTableHeaderCell = styled.div
	.attrs<{ lastColumn: boolean, filler?: true }>(({ lastColumn, filler }) => {
		return {
			'data-widget': 'console-subject-view-dataset-table-header-cell',
			style: {
				borderRightColor: filler ? 'transparent' : 'var(--border-color)',
				borderRightWidth: lastColumn ? 2 : 1
			}
		};
	})<{ lastColumn: boolean, filler?: true }>`
	display: flex;
	align-items: center;
	font-size: 0.8em;
	font-family: var(--console-title-font-family);
	background-color: var(--bg-color);
	padding: 0 8px;
	border-right: var(--border);
	border-bottom: var(--border);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	&:not([data-rowno=true]) {
		&:hover {
			cursor: s-resize;
		}
	}
	> span {
		flex-grow: 1;
	}
	> button {
		opacity: 0.7;
		font-size: 0.9em;
		> svg:nth-child(2) {
			display: block;
			position: absolute;
			z-index: 1;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%) scale(0.8);
			transform-origin: center center;
		}
	}
`;

export const DataSetTableBody = styled.div
	.attrs<DataSetTableProps>(({ columns, autoFill }) => {
		return {
			'data-widget': 'console-subject-view-dataset-table-body',
			style: {
				gridTemplateColumns: autoFill ? `${columns.map(def => `${def.width}px`).join(' ')} minmax(40px, 1fr)` : columns.map(def => `${def.width}px`).join(' ')
			}
		};
	})<DataSetTableProps>`
	display: grid;
	justify-items: stretch;
	align-items: stretch;
	grid-auto-rows: 24px;
`;

export const DataSetTableBodyCell = styled.div
	.attrs<{ lastRow: boolean, lastColumn: boolean, filler?: true }>(({ lastRow, lastColumn, filler }) => {
		return {
			'data-widget': 'console-subject-view-dataset-table-body-cell',
			style: {
				borderBottomColor: lastRow ? 'transparent' : 'var(--border-color)',
				borderRightColor: filler ? 'transparent' : 'var(--border-color)',
				borderRightWidth: lastColumn ? 2 : 1
			}
		};
	})<{ lastRow: boolean, lastColumn: boolean, filler?: true }>`
	display: flex;
	align-items: center;
	font-size: 0.8em;
	padding: 0 8px;
	background-color: var(--invert-color);
	border-right: var(--border);
	border-bottom: var(--border);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	&[data-rowno=true] {
		&:hover {
			cursor: e-resize;
		}
		> span {
			font-family: var(--console-title-font-family);
			transform: scale(0.8);
			transform-origin: left;
		}
	}
`;
