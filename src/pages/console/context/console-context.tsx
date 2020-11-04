import React, { useState } from 'react';
import { ConsoleTooltipContextProvider } from './console-tooltip';

export interface ConsoleContext {
}

const Context = React.createContext<ConsoleContext>({});
Context.displayName = 'ConsoleContext';

export const ConsoleContextProvider = (props: { children?: ((props: any) => React.ReactNode) | React.ReactNode }) => {
	const { children } = props;

	const [ context ] = useState<ConsoleContext>({});

	return <Context.Provider value={context}>
		<ConsoleTooltipContextProvider>
			{children}
		</ConsoleTooltipContextProvider>
	</Context.Provider>;
};

export const useConsoleContext = () => {
	return React.useContext(Context);
};
