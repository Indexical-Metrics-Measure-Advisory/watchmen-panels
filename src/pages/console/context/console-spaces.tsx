import { useState } from 'react';
import { ConnectedConsoleSpace, ConsoleSpace, ConsoleSpaceType } from '../../../services/console/types';

export interface ConsoleSpacesStorage {
	connected: Array<ConnectedConsoleSpace>;
	available: Array<ConsoleSpace>;
}

export const useConsoleSpaces = () => {
	const [ state ] = useState<ConsoleSpacesStorage>({
		connected: [ {
			spaceId: '1',
			connectId: '1',
			name: 'Sales Statistics',
			type: ConsoleSpaceType.PUBLIC
		}, {
			spaceId: '1',
			connectId: '2',
			name: 'Sales Statistics in NY',
			type: ConsoleSpaceType.PRIVATE
		} ],
		available: [ {
			spaceId: '2',
			name: 'Claim Trend'
		} ]
	});

	return {
		...state
	};
};