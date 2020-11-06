import React, { useState } from 'react';
import { ConsoleNotifications, ConsoleNotificationsFunctions, useNotifications } from './console-nofitications';
import { ConsoleTooltipContextProvider } from './console-tooltip';

export interface ConsoleUser {
	name: string;
}

export interface ConsoleContext {
	user: ConsoleUser,
	notifications: ConsoleNotifications & ConsoleNotificationsFunctions
}

const Context = React.createContext<ConsoleContext>({} as ConsoleContext);
Context.displayName = 'ConsoleContext';

export const ConsoleContextProvider = (props: { children?: ((props: any) => React.ReactNode) | React.ReactNode }) => {
	const { children } = props;

	// TODO account is fixed now, for demo purpose
	const [ currentUser ] = useState<ConsoleUser>({ name: 'Walter Kovacs' });
	const notifications = useNotifications();

	const context = {
		user: currentUser,
		notifications
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
