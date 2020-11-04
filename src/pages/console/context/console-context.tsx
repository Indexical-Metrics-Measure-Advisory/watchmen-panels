import React, { useState } from 'react';

export interface ConsoleContext {
}

const Context = React.createContext<ConsoleContext>({});
Context.displayName = 'ConsoleContext';

export const ConsoleContextProvider = (props: { children?: ((props: any) => React.ReactNode) | React.ReactNode }) => {
	const { children } = props;

	const [ context ] = useState<ConsoleContext>({});

	return <Context.Provider value={context}>{children}</Context.Provider>;
};

export const useGuideContext = () => {
	return React.useContext(Context);
};
