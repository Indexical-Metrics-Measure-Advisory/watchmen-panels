import styled from 'styled-components';
import { DataSetTableProps } from './types';

export const TITLE_HEIGHT = 40;
export const HEADER_HEIGHT = 32;
export const ROW_HEIGHT = 24;
export const Wrapper = styled.div.attrs({
	'data-widget': 'console-subject-view-dataset-table-wrapper'
})`
	display: flex;
	position: absolute;
	top: ${TITLE_HEIGHT}px;
	left: 0;
	width: 100%;
	height: calc(100% - ${TITLE_HEIGHT}px);
`;

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
	height: ${HEADER_HEIGHT}px;
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
	&:not([data-rowno=true]):not([data-filler=true]) {
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
	grid-auto-rows: ${ROW_HEIGHT}px;
`;

export const DataSetTableBodyCell = styled.div
	.attrs<{ lastRow: boolean, lastColumn: boolean, filler?: true }>(({ lastColumn, filler }) => {
		return {
			'data-widget': 'console-subject-view-dataset-table-body-cell',
			style: {
				borderBottomColor: 'var(--border-color)',
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

export const RowSelection = styled.div
	.attrs<{ index: number, top: number, height: number, scroll: number }>(({ index, top, height, scroll }) => {
		return {
			'data-widget': 'console-subject-view-dataset-table-row-selection',
			style: {
				display: index === -1 ? 'none' : 'block',
				top,
				width: `calc(100% - ${scroll}px)`,
				height
			}
		};
	})<{ index: number, top: number, height: number, scroll: number }>`
	position: absolute;
	left: 0;
	background-color: var(--console-favorite-color);
	opacity: 0.1;
	pointer-events: none;
	transition: top 300ms ease-in-out, height 1ms linear 200ms;
	z-index: 10;
`;

export const ColumnSelection = styled.div
	.attrs<{ index: number, left: number, width: number, scroll: number }>(({ index, left, width, scroll }) => {
		return {
			'data-widget': 'console-subject-view-dataset-table-column-selection',
			style: {
				display: index !== -1 ? 'block' : 'none',
				left,
				width: width,
				height: `calc(100% + 1px - ${scroll}px)`
			}
		};
	})<{ index: number, left: number, width: number, scroll: number }>`
	position: absolute;
	top: -1px;
	background-color: var(--console-favorite-color);
	opacity: 0.05;
	pointer-events: none;
	transition: left 300ms ease-in-out, width 1ms linear 200ms;
	z-index: 10;
`;
