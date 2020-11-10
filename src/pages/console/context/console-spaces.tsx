import { useEffect, useState } from 'react';
import { fetchAvailableSpaces, fetchConnectedSpaces } from '../../../services/console/space';
import { ConnectedConsoleSpace, ConsoleSpace } from '../../../services/console/types';

export interface ConsoleSpacesStorage {
	connected: Array<ConnectedConsoleSpace>;
	available: Array<ConsoleSpace>;
}

export const useConsoleSpaces = () => {
	const [ state, setState ] = useState<ConsoleSpacesStorage>({
		connected: [],
		available: []
	});

	// TODO simulate data for demo purpose
	useEffect(() => {
		(async () => {
			const connected = await fetchConnectedSpaces();
			const available = await fetchAvailableSpaces();
			setState({ connected, available });
		})();
		// eslint-disable-next-line
	}, [ 0 ]);

	return {
		...state
	};
};