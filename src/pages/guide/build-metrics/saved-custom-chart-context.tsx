import React, { useState } from 'react';
import { ChartSettings } from '../../../charts/custom/types';

export interface SavedCustomChartContext {
	get: () => Array<ChartSettings>;
	add: (settings: ChartSettings) => void;
	replace: (replacement: ChartSettings, replaced: ChartSettings) => void;
}

const Context = React.createContext<SavedCustomChartContext>({} as SavedCustomChartContext);
Context.displayName = 'SavedCustomChartContext';

export const SavedCustomChartContextProvider = (props: { children?: ((props: any) => React.ReactNode) | React.ReactNode }) => {
	const { children } = props;

	const [ charts, setCharts ] = useState<Array<ChartSettings>>([]);
	const context = {
		get: () => charts,
		add: (settings: ChartSettings) => setCharts([ ...charts.filter(c => c !== settings), { ...settings } ]),
		replace: (replacement: ChartSettings, replaced: ChartSettings) => setCharts(charts.map(c => c === replaced ? replacement : c))
	};
	return <Context.Provider value={context}>{children}</Context.Provider>;
};

export const useSavedCustomChartContext = () => {
	return React.useContext(Context);
};
