import React, { useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { Theme } from '../../../theme/types';
import { ResizeHandle, ResizeHandleAlignment } from '../../component/console/menu/resize-handle';

const ScrollWidth = 15;
const Navigator = styled.div.attrs<{ width: number }>(({ width }) => {
	return {
		style: { width }
	};
})<{ width: number }>`
	border-left: var(--border);
`;

export const PipelineNavigator = () => {
	const { consoleSpaceHeaderHeight } = useTheme() as Theme;
	const [ width, setWidth ] = useState(300 + ScrollWidth);

	const onResize = (width: number) => {
		setWidth(Math.min(Math.max(width, 300), 500));
	};

	return <Navigator width={width - ScrollWidth}>
		<ResizeHandle top={consoleSpaceHeaderHeight} width={width} onResize={onResize}
		              alignment={ResizeHandleAlignment.RIGHT}/>
	</Navigator>;
};