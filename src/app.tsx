import React from 'react';
import Pages from './pages';
import { ThemeContextProvider } from './theme/theme-context';

export default () => {
	return <ThemeContextProvider>
		<Pages/>
	</ThemeContextProvider>;
};
