import { EventEmitter } from 'events';
import { useEffect, useState } from 'react';
import { fetchAvailableSpaces, fetchConnectedSpaces } from '../../../services/console/space';
import { ConnectedConsoleSpace, ConsoleSpace } from '../../../services/console/types';

export enum ConsoleSpacesEvent {
	SPACE_DELETED = 'space-deleted',
	SPACE_RENAMED = 'space-renamed'
}

export type ConsoleSpaceDeletedListener = (space: ConnectedConsoleSpace) => void;
export type ConsoleSpaceRenamedListener = (space: ConnectedConsoleSpace) => void;

export interface ConsoleSpacesStorage {
	connected: Array<ConnectedConsoleSpace>;
	available: Array<ConsoleSpace>;
}

export interface ConsoleSpacesUsable {
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
		connected: [],
		available: []
	});

	// TODO simulate data for demo purpose
	useEffect(() => {
		(async () => {
			try {
				const connected = await fetchConnectedSpaces();
				const available = await fetchAvailableSpaces();
				setState({ connected, available });
			} catch (e) {
				console.groupCollapsed(`%cError on fetch spaces.`, 'color:rgb(251,71,71)');
				console.error(e);
				console.groupEnd();
			}
		})();
		// eslint-disable-next-line
	}, [ 0 ]);

	const deleteSpace = (space: ConnectedConsoleSpace) => {
		// eslint-disable-next-line
		setState({
			connected: state.connected.filter(s => s.connectId != space.connectId),
			available: state.available
		});
	};
	const addSpaceDeletedListener = (listener: ConsoleSpaceDeletedListener) => emitter.on(ConsoleSpacesEvent.SPACE_DELETED, listener);
	const removeSpaceDeletedListener = (listener: ConsoleSpaceDeletedListener) => emitter.off(ConsoleSpacesEvent.SPACE_DELETED, listener);

	const spaceRenamed = (space: ConnectedConsoleSpace) => emitter.emit(ConsoleSpacesEvent.SPACE_RENAMED, space);
	const addSpaceRenamedListener = (listener: ConsoleSpaceRenamedListener) => emitter.on(ConsoleSpacesEvent.SPACE_RENAMED, listener);
	const removeSpaceRenamedListener = (listener: ConsoleSpaceRenamedListener) => emitter.off(ConsoleSpacesEvent.SPACE_RENAMED, listener);

	return {
		...state,

		deleteSpace, addSpaceDeletedListener, removeSpaceDeletedListener,
		spaceRenamed, addSpaceRenamedListener, removeSpaceRenamedListener
	};
};