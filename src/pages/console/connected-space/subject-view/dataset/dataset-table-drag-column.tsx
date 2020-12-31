import React, { ForwardedRef, forwardRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { DataPage } from '../../../../../services/admin/types';
import { HEADER_HEIGHT, ROW_HEIGHT } from './dataset-table-components';
import { DragColumnState, useDataSetTableContext } from './dataset-table-context';
import { FactorColumnDef } from './types';

interface ContainerProps {
	left?: number;
	width: number;
	height: number;
	movementX: number;
}

const DragColumnContainer = styled.div
	.attrs<ContainerProps>((
		{ left = 10, width, height, movementX }
	) => {
		const rotate = Math.max(-10, Math.min(10, movementX / 10));
		return {
			'data-widget': 'console-subject-view-dataset-drag-column',
			style: { top: -1, left: left + movementX, width, height: height + 1, transform: `rotate(${rotate}deg)` }
		};
	})<ContainerProps>`
	display: flex;
	flex-direction: column;
	position: absolute;
	overflow: hidden;
	border-bottom: var(--border);
	z-index: 30;
	cursor: move;
	pointer-events: none;
	transform-origin: center center;
	box-shadow: var(--console-favorite-shadow);
	&[data-visible=false] {
		display: none;
	}
	&:after {
		content: '';
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: var(--console-favorite-color);
		opacity: 0.1;
		z-index: 2;
	}
`;
const DragColumnHeader = styled.div.attrs({
	'data-widget': 'console-subject-view-dataset-drag-column-header'
})`
	display: flex;
	align-items: stretch;
	min-height: ${HEADER_HEIGHT + 1}px;
	z-index: 1;
`;
const DragColumnHeaderCell = styled.div.attrs({
	'data-widget': 'console-subject-view-dataset-drag-column-header-cell'
})`
	display: flex;
	position: relative;
	align-items: center;
	font-size: 0.8em;
	font-family: var(--console-title-font-family);
	background-color: var(--bg-color);
	padding: 0 8px;
	width: 100%;
	border: var(--border);
	> span {
		flex-grow: 1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
`;
const DragColumnBody = styled.div.attrs<{ firstRowOffsetY: number }>(({ firstRowOffsetY }) => {
	return {
		'data-widget': 'console-subject-view-dataset-drag-column-body',
		style: { marginTop: 0 - firstRowOffsetY }
	};
})<{ firstRowOffsetY: number }>`
	display: grid;
	justify-items: stretch;
	align-items: stretch;
	grid-auto-rows: ${ROW_HEIGHT}px;
`;
const DragColumnBodyCell = styled.div.attrs({
	'data-widget': 'console-subject-view-dataset-drag-column-body-cell'
})`
	display: flex;
	position: relative;
	align-items: center;
	font-size: 0.8em;
	padding: 1px 8px 0;
	background-color: var(--invert-color);
	border: var(--border);
	border-top: 0;
	> span {
		flex-grow: 1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
`;

export const DataSetTableDragColumn = forwardRef((props: {
	column?: FactorColumnDef;
	data: DataPage<Array<any>>;
}, ref: ForwardedRef<HTMLDivElement>) => {
	const {
		column, data: { data }
	} = props;

	const {
		addDragColumnStateChangeListener, removeDragColumnStateChangeListener,
		addDragColumnVisibleChangeListener, removeDragColumnVisibleChangeListener,
		addDragColumnVisibleDeterminationHandler, removeDragColumnVisibleDeterminationHandler
	} = useDataSetTableContext();

	const [ visible, setVisible ] = useState(false);
	const [ state, setState ] = useState<DragColumnState>({
		left: 0,
		height: 0,
		startRowIndex: 0,
		endRowIndex: 0,
		firstRowOffsetY: 0,
		movementX: 0
	});
	useEffect(() => {
		const determinationListener = (reply: (visible: boolean) => void) => reply(visible);
		const stateChangeListener = (newState: Partial<DragColumnState>) => setState({ ...state, ...newState });
		addDragColumnVisibleDeterminationHandler(determinationListener);
		addDragColumnVisibleChangeListener(setVisible);
		addDragColumnStateChangeListener(stateChangeListener);

		return () => {
			removeDragColumnVisibleDeterminationHandler(determinationListener);
			removeDragColumnVisibleChangeListener(setVisible);
			removeDragColumnStateChangeListener(stateChangeListener);
		};
	}, [
		addDragColumnVisibleDeterminationHandler, addDragColumnVisibleChangeListener, addDragColumnStateChangeListener,
		visible, state,
		removeDragColumnVisibleDeterminationHandler, removeDragColumnVisibleChangeListener, removeDragColumnStateChangeListener
	]);

	if (!column || !state) {
		return null;
	}

	const { width } = column;
	const { left, height, startRowIndex, endRowIndex, firstRowOffsetY, movementX } = state;

	return <DragColumnContainer left={left} width={width} height={height} movementX={movementX}
	                            data-visible={visible}
	                            ref={ref}>
		<DragColumnHeader>
			<DragColumnHeaderCell>
				<span>{column.factor.label || column.factor.name}</span>
			</DragColumnHeaderCell>
		</DragColumnHeader>
		<DragColumnBody firstRowOffsetY={firstRowOffsetY}>
			{data.map((row, rowIndex) => {
				if (rowIndex < startRowIndex || rowIndex > endRowIndex) {
					return null;
				}

				return <DragColumnBodyCell key={`${rowIndex}`}>
					<span>{`${row[column.index]}`}</span>
				</DragColumnBodyCell>;
			})}
		</DragColumnBody>
	</DragColumnContainer>;
});