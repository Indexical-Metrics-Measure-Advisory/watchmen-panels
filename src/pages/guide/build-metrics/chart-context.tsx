import React, { useRef, useState } from 'react';
import { ChartInstanceContextProvider } from '../../../charts/chart-instance-context';
import { ChartContainer } from '../../component/chart';
import { ChartSettingsContextProvider } from './settings-context';

export interface ChartContext {
	expanded: boolean;
	toggleExpanded: () => void;
}

const Context = React.createContext<ChartContext>({} as ChartContext);
Context.displayName = 'ChartContext';

export const ChartContextProvider = (props: { children?: ((props: any) => React.ReactNode) | React.ReactNode }) => {
	const { children } = props;

	const containerRef = useRef<HTMLDivElement>(null);
	const [ expanded, setExpanded ] = useState<boolean>(false);
	const toggleExpanded = () => {
		setExpanded(!expanded);
		setTimeout(() => {
			containerRef.current!.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
		}, 300);
	};
	const context = { expanded, toggleExpanded };

	return <Context.Provider value={context}>
		<ChartContainer data-expanded={expanded} ref={containerRef}>
			<ChartSettingsContextProvider>
				<ChartInstanceContextProvider>
					{children}
				</ChartInstanceContextProvider>
			</ChartSettingsContextProvider>
		</ChartContainer>
	</Context.Provider>;
};

export const useChartContext = () => {
	return React.useContext(Context);
};
