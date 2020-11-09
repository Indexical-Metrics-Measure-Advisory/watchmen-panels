import React, { useState } from 'react';
import { ConsoleDashboardsStorage, useConsoleDashboards } from './console-dashboards';
import { ConsoleMailsStorage, ConsoleMailsUsable, useConsoleMails } from './console-mails';
import {
	ConsoleNotificationsStorage,
	ConsoleNotificationsUsable,
	useConsoleNotifications
} from './console-nofitications';
import { ConsoleSpacesStorage, useConsoleSpaces } from './console-spaces';
import { ConsoleTooltipContextProvider } from './console-tooltip';

export interface ConsoleUser {
	name: string;
}

export interface ConsoleContext {
	user: ConsoleUser;
	notifications: ConsoleNotificationsStorage & ConsoleNotificationsUsable;
	mails: ConsoleMailsStorage & ConsoleMailsUsable;
	spaces: ConsoleSpacesStorage;
	dashboards: ConsoleDashboardsStorage
}

const Context = React.createContext<ConsoleContext>({} as ConsoleContext);
Context.displayName = 'ConsoleContext';

export const ConsoleContextProvider = (props: { children?: ((props: any) => React.ReactNode) | React.ReactNode }) => {
	const { children } = props;

	// TODO account is fixed now, for demo purpose
	const [ currentUser ] = useState<ConsoleUser>({ name: 'Walter Kovacs' });
	const notifications = useConsoleNotifications();
	const mails = useConsoleMails();
	const spaces = useConsoleSpaces();
	const dashboards = useConsoleDashboards();

	const context = {
		user: currentUser,
		notifications,
		mails,
		spaces,
		dashboards
	};

	return <Context.Provider value={context}>
		<ConsoleTooltipContextProvider>
			{children}
		</ConsoleTooltipContextProvider>
	</Context.Provider>;
};

export const useConsoleContext = () => {
	return React.useContext(Context);
};
