import { ConnectedConsoleSpace, ConsoleSpace, ConsoleSpaceType } from './types';

export const fetchConnectedSpaces = async (): Promise<Array<ConnectedConsoleSpace>> => {
	return [ {
		spaceId: '1',
		connectId: '1',
		name: 'Sales Statistics',
		type: ConsoleSpaceType.PUBLIC,
		lastVisitTime: '2020/10/31 14:23:07'
	}, {
		spaceId: '1',
		connectId: '2',
		name: 'Sales Statistics in New York',
		type: ConsoleSpaceType.PRIVATE,
		lastVisitTime: '2020/11/05 15:14:11'
	}, {
		spaceId: '1',
		connectId: '3',
		name: 'Sales Statistics in Maine',
		type: ConsoleSpaceType.PRIVATE,
		lastVisitTime: '2020/11/05 14:13:11'
	}, {
		spaceId: '1',
		connectId: '4',
		name: 'Sales Statistics in New Hampshire',
		type: ConsoleSpaceType.PRIVATE,
		lastVisitTime: '2020/11/05 13:12:11'
	}, {
		spaceId: '1',
		connectId: '5',
		name: 'Sales Statistics in Vermont',
		type: ConsoleSpaceType.PRIVATE,
		lastVisitTime: '2020/11/05 12:11:11'
	}, {
		spaceId: '1',
		connectId: '6',
		name: 'Sales Statistics in Rhode Island',
		type: ConsoleSpaceType.PRIVATE,
		lastVisitTime: '2020/11/05 11:10:11'
	}, {
		spaceId: '1',
		connectId: '7',
		name: 'Sales Statistics in Connecticut',
		type: ConsoleSpaceType.PRIVATE,
		lastVisitTime: '2020/11/05 10:09:11'
	}, {
		spaceId: '1',
		connectId: '8',
		name: 'Sales Statistics in Massachusetts',
		type: ConsoleSpaceType.PRIVATE,
		lastVisitTime: '2020/11/05 09:08:11'
	} ];
};

export const fetchAvailableSpaces = async (): Promise<Array<ConsoleSpace>> => {
	return [ {
		spaceId: '2',
		name: 'Claim Trend'
	} ];
};