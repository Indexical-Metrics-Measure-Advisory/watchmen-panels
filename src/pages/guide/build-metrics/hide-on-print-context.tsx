import React, { useState } from 'react';

export interface HideChart {
	title: string,
	recover: () => Promise<void>
}

export interface HideOnPrintContext {
	get: () => Array<HideChart>;
	hide: (chart: HideChart) => void;
	recover: (chart: HideChart) => Promise<void>
}

const Context = React.createContext<HideOnPrintContext>({} as HideOnPrintContext);
Context.displayName = 'HideOnPrintContext';

export const HideOnPrintProvider = (props: { children?: ((props: any) => React.ReactNode) | React.ReactNode }) => {
	const { children } = props;

	const [ hideCharts, setHideCharts ] = useState<Array<HideChart>>([]);

	const context = {
		hide: (chart: HideChart) => setHideCharts([ ...hideCharts, chart ]),
		get: () => hideCharts,
		recover: async (chart: HideChart) => {
			await chart.recover();
			setHideCharts(hideCharts.filter(c => c !== chart));
		}
	};
	return <Context.Provider value={context}>{children}</Context.Provider>;
};

export const useHideOnPrintContext = () => {
	return React.useContext(Context);
};
