import React from 'react';
import Pages from './pages';
import { AlertProvider } from './pages/context/alert';
import { NotImplementedProvider } from './pages/context/not-implemented';
import { ResponsiveProvider } from './pages/context/responsive';
import { ThemeContextProvider } from './theme/theme-context';

export default () => {
	return <ThemeContextProvider>
		<ResponsiveProvider>
			<AlertProvider>
				<NotImplementedProvider>
					<Pages/>
				</NotImplementedProvider>
			</AlertProvider>
		</ResponsiveProvider>
	</ThemeContextProvider>;
};
