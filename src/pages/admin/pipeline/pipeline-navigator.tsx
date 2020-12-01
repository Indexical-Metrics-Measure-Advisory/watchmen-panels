import React, { useEffect, useReducer, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { Theme } from '../../../theme/types';
import { ResizeHandle, ResizeHandleAlignment } from '../../component/console/menu/resize-handle';
import { usePipelineContext } from './pipeline-context';

const ScrollWidth = 15;
const Navigator = styled.div.attrs<{ width: number, visible: boolean }>(({ width, visible }) => {
	return {
		style: {
			width: visible ? width : 0,
			borderLeft: visible ? 'var(--border)' : 0,
			pointerEvents: visible ? 'auto' : 'none'
		}
	};
})<{ width: number, visible: boolean }>`
	overflow-x: hidden;
	overflow-y: auto;
`;

export const PipelineNavigator = () => {
	const { consoleSpaceHeaderHeight } = useTheme() as Theme;
	const { store: { menuVisible }, addMenuVisibilityListener, removeMenuVisibilityListener } = usePipelineContext();
	const [ width, setWidth ] = useState(300 + ScrollWidth);
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);
	useEffect(() => {
		addMenuVisibilityListener(forceUpdate);
		return () => removeMenuVisibilityListener(forceUpdate);
	});

	const onResize = (width: number) => setWidth(Math.min(Math.max(width, 300), 500));

	return <Navigator width={width - ScrollWidth} visible={menuVisible}>
		<ResizeHandle top={consoleSpaceHeaderHeight} width={width} onResize={onResize}
		              alignment={ResizeHandleAlignment.RIGHT}/>
	</Navigator>;
};