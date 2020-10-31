import React, { useState } from 'react';

export enum Scene {
	NOT_START,
	STAGE1,
	STAGE2
}

export interface Director {
	current: () => Scene;
	next: () => void;
}

const Context = React.createContext<Director>({} as Director);
Context.displayName = 'Director';

export const DirectorProvider = (props: { children?: ((props: any) => React.ReactNode) | React.ReactNode }) => {
	const { children } = props;

	const [ scene, setScene ] = useState<Scene>(Scene.NOT_START);

	const context = {
		current: (): Scene => scene,
		next: (): void => setScene(scene + 1)
	};
	return <Context.Provider value={context}>{children}</Context.Provider>;
};

export const useDirector = () => {
	return React.useContext(Context);
};
