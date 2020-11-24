import React, { useState } from 'react';
import { ConsoleMenuUsable, useConsoleMenu } from '../../component/console/context/console-menu';
import { ConsoleTooltipContextProvider } from '../../component/console/context/console-tooltip';
import { ConsoleUser } from '../../component/console/types';
import { ConsoleDashboardsStorage, useConsoleDashboards } from './console-dashboards';
import { ConsoleFavoritesStorage, ConsoleFavoritesUsable, useConsoleFavorites } from './console-favorites';
import { ConsoleMailsStorage, ConsoleMailsUsable, useConsoleMails } from './console-mails';
import {
	ConsoleNotificationsStorage,
	ConsoleNotificationsUsable,
	useConsoleNotifications
} from './console-nofitications';
import { ConsoleSettingsStorage, ConsoleSettingsUsable, useConsoleSettings } from './console-settings';
import { ConsoleSpacesStorage, ConsoleSpacesUsable, useConsoleSpaces } from './console-spaces';

export interface ConsoleContext {
	menu: ConsoleMenuUsable;
	user: ConsoleUser;
	notifications: ConsoleNotificationsStorage & ConsoleNotificationsUsable;
	mails: ConsoleMailsStorage & ConsoleMailsUsable;
	spaces: ConsoleSpacesStorage & ConsoleSpacesUsable;
	dashboards: ConsoleDashboardsStorage;
	favorites: ConsoleFavoritesStorage & ConsoleFavoritesUsable;
	settings: ConsoleSettingsStorage & ConsoleSettingsUsable;
}

const Context = React.createContext<ConsoleContext>({} as ConsoleContext);
Context.displayName = 'ConsoleContext';

export const ConsoleContextProvider = (props: { children?: ((props: any) => React.ReactNode) | React.ReactNode }) => {
	const { children } = props;

	const menu = useConsoleMenu();
	// TODO account is fixed now, for demo purpose
	const [ currentUser ] = useState<ConsoleUser>({ name: 'Walter Kovacs' });
	const notifications = useConsoleNotifications();
	const mails = useConsoleMails();
	const spaces = useConsoleSpaces();
	const dashboards = useConsoleDashboards();
	const favorites = useConsoleFavorites();
	const settings = useConsoleSettings();

	const context = {
		menu,
		user: currentUser,
		notifications,
		mails,
		spaces,
		dashboards,
		favorites,
		settings
	};
	console.log(context);

	return <Context.Provider value={context}>
		<ConsoleTooltipContextProvider>
			{children}
		</ConsoleTooltipContextProvider>
	</Context.Provider>;
};

export const useConsoleContext = () => {
	return React.useContext(Context);
};
