import React, { useState } from 'react';

export enum PipelineEvent {
}

export interface PipelineContextStore {
}

export interface PipelineContext {
	store: PipelineContextStore;
}

const Context = React.createContext<PipelineContext>({} as PipelineContext);
Context.displayName = 'PipelineContext';

export const PipelineContextProvider = (props: {
	children?: ((props: any) => React.ReactNode) | React.ReactNode;
}) => {
	const { children } = props;
	const [ store ] = useState<PipelineContextStore>({} as PipelineContextStore);

	return <Context.Provider value={{
		store
	}}>{children}</Context.Provider>;
};

export const usePipelineContext = () => {
	return React.useContext(Context);
};
