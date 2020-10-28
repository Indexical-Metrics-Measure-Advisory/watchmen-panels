import React, { useRef, useState } from 'react';
import { ChartInstanceContextProvider } from '../../../charts/chart-instance-context';
import { ChartContainer } from '../../component/chart';
import { useHideOnPrintContext } from './hide-on-print-context';
import { ChartSettingsContextProvider } from './settings-context';

export interface ChartContext {
	expanded: boolean;
	toggleExpanded: () => void;
	hideOnPrint: (title: string) => void;
}

const Context = React.createContext<ChartContext>({} as ChartContext);
Context.displayName = 'ChartContext';

export const ChartContextProvider = (props: { children?: ((props: any) => React.ReactNode) | React.ReactNode }) => {
	const { children } = props;

	const hideOnPrintContext = useHideOnPrintContext();
	const containerRef = useRef<HTMLDivElement>(null);
	const [ expanded, setExpanded ] = useState<boolean>(false);
	const toggleExpanded = () => {
		setExpanded(!expanded);
		setTimeout(() => {
			containerRef.current!.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
		}, 300);
	};
	const hide = (title: string) => {
		const draggable = containerRef.current!.parentElement!;

		const rect = draggable.getBoundingClientRect();
		const { transform, top, left, width, height } = draggable.style;
		draggable.style.position = 'fixed';
		draggable.style.transform = '';
		draggable.style.opacity = '1';
		draggable.style.top = `${rect.top}px`;
		draggable.style.left = `${rect.left}px`;
		draggable.style.width = `${rect.width}px`;
		draggable.style.height = `${rect.height}px`;
		draggable.style.transition = 'all 300ms ease-in-out';
		setTimeout(() => {
			draggable.style.top = 'calc(100vh - 56px)';
			draggable.style.left = 'calc(100vw - 72px)';
			draggable.style.width = '0';
			draggable.style.height = '0';
			draggable.style.opacity = '0';
			setTimeout(() => {
				hideOnPrintContext.hide({
					title, recover: async () => {
						return new Promise(resolve => {
							draggable.style.position = 'absolute';
							draggable.style.transform = transform;
							draggable.style.opacity = '';
							draggable.style.top = top;
							draggable.style.left = left;
							draggable.style.width = width;
							draggable.style.height = height;
							setTimeout(() => {
								draggable.style.transition = '';
								resolve();
							}, 300);
						});
					}
				});
			}, 300);
		}, 10);
	};
	const context = { expanded, toggleExpanded, hideOnPrint: hide };

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
