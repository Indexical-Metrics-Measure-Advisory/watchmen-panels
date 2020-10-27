import { EventEmitter } from 'events';
import React, { useState } from 'react';

export interface ChartInstanceContext {
	/** get data url if chart rendered */
	download: () => Promise<string>;
	sendImage: (dataUrl: string | null) => void;
	on: (event: ChartInstanceContextEvent, listener: () => void) => void;
	off: (event: ChartInstanceContextEvent, listener: () => void) => void;
}

const Context = React.createContext<ChartInstanceContext>({} as ChartInstanceContext);
Context.displayName = 'ChartContext';

export enum ChartInstanceContextEvent {
	DOWNLOAD = 'download',
	IMAGE = 'image'
}

export const ChartInstanceContextProvider = (props: { children?: ((props: any) => React.ReactNode) | React.ReactNode }) => {
	const { children } = props;

	const [ emitter ] = useState(new EventEmitter());
	const context = {
		download: () => {
			return new Promise<string>((resolve, reject) => {
				emitter.once(ChartInstanceContextEvent.IMAGE, (dataUrl: string) => {
					dataUrl ? resolve(dataUrl) : reject();
				});
				emitter.emit(ChartInstanceContextEvent.DOWNLOAD);
			});
		},
		on: (event: ChartInstanceContextEvent, listener: () => void) => {
			emitter.on(event, listener);
		},
		off: (event: ChartInstanceContextEvent, listener: () => void) => {
			emitter.off(event, listener);
		},
		sendImage: (dataUrl: string | null) => {
			emitter.emit(ChartInstanceContextEvent.IMAGE, dataUrl);
		}
	};

	return <Context.Provider value={context}>
		{children}
	</Context.Provider>;
};

export const useChartInstanceContext = () => {
	return React.useContext(Context);
};
