import React, { useState } from 'react';

export interface ChartSettingsContext {
	active: boolean;
	toggleActive: () => void;
}

const Context = React.createContext<ChartSettingsContext>({} as ChartSettingsContext);
Context.displayName = 'ChartSettingsContext';

export const ChartSettingsContextProvider = (props: { children?: ((props: any) => React.ReactNode) | React.ReactNode }) => {
	const { children } = props;

	const [ active, setActive ] = useState<boolean>(false);
	const toggleActive = () => setActive(!active);
	const context = { active, toggleActive };

	return <Context.Provider value={context}>
		{children}
	</Context.Provider>;
};

export const useChartSettingsContext = () => {
	return React.useContext(Context);
};
