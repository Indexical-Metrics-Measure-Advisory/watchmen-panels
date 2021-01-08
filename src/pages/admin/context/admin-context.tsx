import React, { useState } from 'react';
import { findAccount } from '../../../services/account/account-session';
import { ConsoleMenuUsable, useConsoleMenu } from '../../component/console/context/console-menu';
import { ConsoleTooltipContextProvider } from '../../component/console/context/console-tooltip';
import { ConsoleUser } from '../../component/console/types';

export interface AdminContext {
	menu: ConsoleMenuUsable;
	user: ConsoleUser;
}

const Context = React.createContext<AdminContext>({} as AdminContext);
Context.displayName = 'AdminContext';

export const AdminContextProvider = (props: { children?: ((props: any) => React.ReactNode) | React.ReactNode }) => {
	const { children } = props;

	const menu = useConsoleMenu();
	const [ currentUser ] = useState<ConsoleUser>(() => {
		return {
			name: findAccount()?.name || 'Walter Kovacs'
		};
	});

	const context = {
		menu,
		user: currentUser
	};

	return <Context.Provider value={context}>
		<ConsoleTooltipContextProvider>
			{children}
		</ConsoleTooltipContextProvider>
	</Context.Provider>;
};

export const useAdminContext = () => {
	return React.useContext(Context);
};
