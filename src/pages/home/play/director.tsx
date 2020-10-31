import React, { useState } from 'react';

export enum Scene {
	NOT_START = 'not-start',
	MASSES_OF_FILES = 'masses-of-files',
	A_RAW_STORAGE = 'a-raw-storage'
}

export interface Director {
	current: () => Scene;
	next: () => void;
	isPaused: () => boolean;
	pause: () => void;
	resume: () => void;
}

const Context = React.createContext<Director>({} as Director);
Context.displayName = 'Director';

const getNextScene = (current: Scene) => {
	switch (current) {
		case Scene.NOT_START:
			return Scene.MASSES_OF_FILES;
		case Scene.MASSES_OF_FILES:
			return Scene.A_RAW_STORAGE;
	}
	return Scene.NOT_START;
};

export const DirectorProvider = (props: { children?: ((props: any) => React.ReactNode) | React.ReactNode }) => {
	const { children } = props;

	const [ scene, setScene ] = useState<Scene>(Scene.NOT_START);
	const [ pause, setPause ] = useState<boolean>(false);

	const context = {
		current: (): Scene => scene,
		next: (): void => setScene(getNextScene(scene)),
		isPaused: () => pause,
		pause: () => setPause(true),
		resume: () => setPause(false)
	};
	return <Context.Provider value={context}>{children}</Context.Provider>;
};

export const useDirector = () => {
	return React.useContext(Context);
};

export const ScenesDefs = {
	subtitleIn: 2000,
	subtitleOut: 1000,
	[Scene.MASSES_OF_FILES]: {
		announce: 600,
		showFile: 3000
	}
};