import styled from 'styled-components';
import { DataSetTableProps } from './types';

export const TITLE_HEIGHT = 40;
export const HEADER_HEIGHT = 32;
export const ROW_HEIGHT = 24;
export const DEFAULT_COLUMN_WIDTH = 200;
export const FILLER_MIN_WIDTH = 40;
export const RESIZE_DEVIATION = 3;
export const MIN_COLUMN_WIDTH = 100;
export const MAX_COLUMN_WIDTH = 500;
export const DRAG_DEVIATION = 10;

export const Wrapper = styled.div.attrs({
	'data-widget': 'console-subject-view-dataset-table-wrapper'
})`
	display: flex;
	position: absolute;
	top: ${TITLE_HEIGHT}px;
	left: 0;
	width: 100%;
	height: calc(100% - ${TITLE_HEIGHT}px);
	&[data-resize-state=pick-column],
	&[data-resize-state=ready-to-drag],
	&[data-resize-state=dragging] {
		cursor: move;
	}
	&[data-resize-state=can-resize],
	&[data-resize-state=resizing] {
		cursor: col-resize;
	}
`;

export const DataSetTableContainer = styled.div
	.attrs<DataSetTableProps>(
		({ columns, autoFill }) => {
			const fixTableWidth = columns.reduce((width, column) => width + column.width, 0);
			return {
				'data-widget': 'console-subject-view-dataset-table',
				style: {
					minWidth: autoFill ? 'unset' : fixTableWidth
				}
			};
		})<DataSetTableProps>`
	display: flex;
	flex-direction: column;
	height: 100%;
	&:first-child {
		overflow-x: hidden;
		overflow-y: auto;
		> div:nth-child(2) > div:after {
			content: '';
			display: block;
			position: absolute;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: var(--console-primary-color);
			opacity: 0.02;
		}
		&::-webkit-scrollbar {
			background-color: transparent;
			width: 0;
		}
	}
	&:nth-child(2) {
		flex-grow: 1;
		overflow: auto;
	}
`;

export const DataSetTableHeader = styled.div
	.attrs<DataSetTableProps>(({ columns, autoFill }) => {
		return {
			'data-widget': 'console-subject-view-dataset-table-header',
			style: {
				gridTemplateColumns: autoFill ? `${columns.map(def => `${def.width}px`).join(' ')} minmax(${FILLER_MIN_WIDTH}px, 1fr)` : columns.map(def => `${def.width}px`).join(' ')
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
	.attrs<{ filler?: true }>(({ filler }) => {
		return {
			'data-widget': 'console-subject-view-dataset-table-header-cell',
			style: {
				borderRightColor: filler ? 'transparent' : 'var(--border-color)'
			}
		};
	})<{ lastColumn: boolean, filler?: true }>`
	display: flex;
	position: relative;
	align-items: center;
	font-size: 0.8em;
	font-family: var(--console-title-font-family);
	background-color: var(--bg-color);
	padding: 0 8px;
	border-right: var(--border);
	border-bottom: var(--border);
	&:not([data-rowno=true]):not([data-filler=true]) {
		//cursor: s-resize;
		&:hover {
			> div[data-widget='console-subject-view-dataset-table-header-cell-buttons'] {
				opacity: 1;
				pointer-events: auto;
				transition: all 300ms ease-in-out;
			}
		}
	}
	&[data-dragging=true] {
		opacity: 0;
		& + div {
			box-shadow: -1px 0 0 0 var(--border-color);
		}
	}
	> span {
		flex-grow: 1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
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
export const HeaderCellButtons = styled.div.attrs({
	'data-widget': 'console-subject-view-dataset-table-header-cell-buttons'
})`
	display: flex;
	position: absolute;
	height: 31px;
	top: 0;
	right: 0;
	padding: calc(var(--margin) / 8);
	background-color: var(--bg-color);
	opacity: 0;
	pointer-events: none;
	> button {
		font-size: 0.9em;
		width: 24px;
	}
`;

export const DataSetTableBody = styled.div
	.attrs<DataSetTableProps>(({ columns, autoFill }) => {
		return {
			'data-widget': 'console-subject-view-dataset-table-body',
			style: {
				gridTemplateColumns: autoFill ? `${columns.map(def => `${def.width}px`).join(' ')} minmax(${FILLER_MIN_WIDTH}px, 1fr)` : columns.map(def => `${def.width}px`).join(' ')
			}
		};
	})<DataSetTableProps>`
	display: grid;
	justify-items: stretch;
	align-items: stretch;
	grid-auto-rows: ${ROW_HEIGHT}px;
`;

export const DataSetTableBodyCell = styled.div
	.attrs<{ lastRow: boolean, filler?: true }>(({ lastRow, filler }) => {
		return {
			'data-widget': 'console-subject-view-dataset-table-body-cell',
			style: {
				borderBottom: lastRow ? 0 : 'var(--border)',
				borderRightColor: filler ? 'transparent' : 'var(--border-color)'
			}
		};
	})<{ lastRow: boolean, lastColumn: boolean, filler?: true }>`
	display: flex;
	position: relative;
	align-items: center;
	font-size: 0.8em;
	padding: 0 8px;
	background-color: var(--invert-color);
	border-right: var(--border);
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
	&[data-last-row=true] {
		box-shadow: 0 1px 0 0 var(--border-color);
	}
	&[data-dragging=true] {
		opacity: 0;
		& + div {
			box-shadow: -1px 0 0 0 var(--border-color);
		}
		&[data-last-row=true] + div {
			box-shadow: 0 1px 0 0 var(--border-color), -1px 0 0 0 var(--border-color);
		}
	}
	> span {
		flex-grow: 1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
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
				height: height + 1
			}
		};
	})<{ index: number, top: number, height: number, scroll: number }>`
	position: absolute;
	left: 0;
	background-color: var(--console-favorite-color);
	opacity: 0.1;
	pointer-events: none;
	transition: top 300ms ease-in-out;
	z-index: 10;
`;

export const ColumnSelection = styled.div
	.attrs<{ index: number, left: number, width: number, height: number, scroll: number }>(
		({ index, left, width, height, scroll }
		) => {
			return {
				'data-widget': 'console-subject-view-dataset-table-column-selection',
				style: {
					display: index !== -1 ? 'block' : 'none',
					left,
					width: width,
					height: height === 0 ? `calc(100% + 1px - ${scroll}px)` : height
				}
			};
		})<{ index: number, left: number, width: number, height: number, scroll: number }>`
	position: absolute;
	top: 0;
	background-color: var(--console-favorite-color);
	opacity: 0.05;
	pointer-events: none;
	transition: left 300ms ease-in-out;
	z-index: 10;
`;

export const DataSetResizeShade = styled.div`
	display: block;
	position: absolute;
	z-index: 20;
	top: 0;
	left: 0;
	width: 0;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.05);
	&[data-visible=true] {
		width: 100%;
	}
`;
