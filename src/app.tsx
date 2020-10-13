import React from 'react';
import Pages from './pages';
import { ResponsiveProvider } from './pages/context/responsive';
import { ThemeContextProvider } from './theme/theme-context';

export default () => {
	return <ThemeContextProvider>
		<ResponsiveProvider>
			<Pages/>
		</ResponsiveProvider>
	</ThemeContextProvider>;
};
