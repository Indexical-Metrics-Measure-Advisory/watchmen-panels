import React from 'react';
import Pages from './pages';
import { NotImplementedProvider } from './pages/context/not-implemented';
import { ResponsiveProvider } from './pages/context/responsive';
import { ThemeContextProvider } from './theme/theme-context';

export default () => {
	return <ThemeContextProvider>
		<ResponsiveProvider>
			<NotImplementedProvider>
				<Pages/>
			</NotImplementedProvider>
		</ResponsiveProvider>
	</ThemeContextProvider>;
};
