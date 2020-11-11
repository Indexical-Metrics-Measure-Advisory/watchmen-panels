import dayjs from 'dayjs';
import Duration from 'dayjs/plugin/duration';
import QuarterOfYear from 'dayjs/plugin/quarterOfYear';
import RelativeTime from 'dayjs/plugin/relativeTime';
import WeekOfYear from 'dayjs/plugin/weekOfYear';
import React from 'react';
import { Pages } from './pages';
import { AlertProvider } from './pages/context/alert';
import { NotImplementedProvider } from './pages/context/not-implemented';
import { ResponsiveProvider } from './pages/context/responsive';
import { ThemeContextProvider } from './theme/theme-context';

// datetime functions
dayjs.extend(WeekOfYear);
dayjs.extend(QuarterOfYear);
dayjs.extend(Duration);
dayjs.extend(RelativeTime);

const app = () => {
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
export default app;
