import React from 'react';
import { RouteChildrenProps } from 'react-router';
import { ThemeProvider } from 'styled-components';
import DefaultTheme from './default-theme';
import ThemeIndex from './theme-index';

const Themes = {
	default: DefaultTheme,
	dark: DefaultTheme,
	light: DefaultTheme
};

type ThemeName = keyof typeof Themes;

interface ThemeContext {
	switch: (theme: ThemeName) => void;
}

const Context = React.createContext<ThemeContext>({
	switch: () => console.info('Theme switch is not supported yet.')
});


export const ThemeContextProvider = (props: { children?: ((props: RouteChildrenProps<any>) => React.ReactNode) | React.ReactNode }) => {
	const { children } = props;

	const [ theme, switchTheme ] = React.useState(DefaultTheme);

	const doSwitchTheme = (theme: ThemeName) => {
		if (theme in Themes) {
			switchTheme(Themes[theme]);
		} else {
			console.warn(`Theme[${theme}] is not supported yet.`);
		}
	};

	return <Context.Provider value={{ switch: doSwitchTheme }}>
		<ThemeProvider theme={theme}>
			<ThemeIndex>
				{children}
			</ThemeIndex>
		</ThemeProvider>
	</Context.Provider>;
};

export const useThemeContext = () => {
	return React.useContext(Context);
};
