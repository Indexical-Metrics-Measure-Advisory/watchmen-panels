import { EventEmitter } from 'events';
import { useEffect, useState } from 'react';
import { fetchAvailableSpaces, fetchConnectedSpaces } from '../../../services/console/space';
import { ConnectedConsoleSpace, ConsoleSpace } from '../../../services/console/types';

export enum ConsoleSpacesEvent {
	SPACE_ADDED = 'space-added',
	SPACE_DELETED = 'space-deleted',
	SPACE_RENAMED = 'space-renamed'
}

export type ConsoleSpaceAddedListener = (space: ConnectedConsoleSpace) => void;
export type ConsoleSpaceDeletedListener = (space: ConnectedConsoleSpace) => void;
export type ConsoleSpaceRenamedListener = (space: ConnectedConsoleSpace) => void;

export interface ConsoleSpacesStorage {
	initialized: boolean;
	connected: Array<ConnectedConsoleSpace>;
	available: Array<ConsoleSpace>;
}

export interface ConsoleSpacesUsable {
	addSpace: (space: ConnectedConsoleSpace) => void;
	addSpaceAddedListener: (listener: ConsoleSpaceAddedListener) => void;
	removeSpaceAddedListener: (listener: ConsoleSpaceAddedListener) => void;

	deleteSpace: (space: ConnectedConsoleSpace) => void;
	addSpaceDeletedListener: (listener: ConsoleSpaceDeletedListener) => void;
	removeSpaceDeletedListener: (listener: ConsoleSpaceDeletedListener) => void;

	spaceRenamed: (space: ConnectedConsoleSpace) => void;
	addSpaceRenamedListener: (listener: ConsoleSpaceRenamedListener) => void;
	removeSpaceRenamedListener: (listener: ConsoleSpaceRenamedListener) => void;
}

export const useConsoleSpaces = () => {
	const [ emitter ] = useState(new EventEmitter());
	const [ state, setState ] = useState<ConsoleSpacesStorage>({
		initialized: false,
		connected: [],
		available: []
	});
	const [ usable ] = useState<ConsoleSpacesUsable>({
		addSpace: (space: ConnectedConsoleSpace) => {
			state.initialized = true;
			state.connected.push(space);
			emitter.emit(ConsoleSpacesEvent.SPACE_ADDED, space);
		},
		addSpaceAddedListener: (listener: ConsoleSpaceAddedListener) => emitter.on(ConsoleSpacesEvent.SPACE_ADDED, listener),
		removeSpaceAddedListener: (listener: ConsoleSpaceAddedListener) => emitter.off(ConsoleSpacesEvent.SPACE_ADDED, listener),

		deleteSpace: (space: ConnectedConsoleSpace) => {
			state.initialized = true;
			// eslint-disable-next-line
			const index = state.connected.findIndex(s => s.connectId == space.connectId);
			if (index !== -1) {
				state.connected.splice(index, 1);
			}
			emitter.emit(ConsoleSpacesEvent.SPACE_DELETED, space);
		},
		addSpaceDeletedListener: (listener: ConsoleSpaceDeletedListener) => emitter.on(ConsoleSpacesEvent.SPACE_DELETED, listener),
		removeSpaceDeletedListener: (listener: ConsoleSpaceDeletedListener) => emitter.off(ConsoleSpacesEvent.SPACE_DELETED, listener),

		spaceRenamed: (space: ConnectedConsoleSpace) => emitter.emit(ConsoleSpacesEvent.SPACE_RENAMED, space),
		addSpaceRenamedListener: (listener: ConsoleSpaceRenamedListener) => emitter.on(ConsoleSpacesEvent.SPACE_RENAMED, listener),
		removeSpaceRenamedListener: (listener: ConsoleSpaceRenamedListener) => emitter.off(ConsoleSpacesEvent.SPACE_RENAMED, listener)
	});

	// TODO simulate data for demo purpose
	useEffect(() => {
		(async () => {
			try {
				const connected = await fetchConnectedSpaces();
				const available = await fetchAvailableSpaces();
				setState({ initialized: true, connected, available });
			} catch (e) {
				console.groupCollapsed(`%cError on fetch spaces.`, 'color:rgb(251,71,71)');
				console.error(e);
				console.groupEnd();
			}
		})();
	}, [ state.initialized ]);

	return { ...state, ...usable };
};