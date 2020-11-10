import { useState } from 'react';
import { useTheme } from 'styled-components';
import { Theme } from '../../../theme/types';

export interface ConsoleMenuUsable {
	menuWidth: number;
	setMenuWidth: (width: number) => void;
}

export const useConsoleMenu = (): ConsoleMenuUsable => {
	const theme = useTheme();
	const minWidth = (theme as Theme).consoleMenuWidth;
	const [ width, setWidth ] = useState<number>(minWidth);

	return {
		menuWidth: width,
		setMenuWidth: setWidth
	};
};