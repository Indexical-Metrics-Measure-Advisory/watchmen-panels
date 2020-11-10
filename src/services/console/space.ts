import { ConsoleSpaceType } from './types';

export const fetchConnectedSpaces = async () => {
	return [ {
		spaceId: '1',
		connectId: '1',
		name: 'Sales Statistics',
		type: ConsoleSpaceType.PUBLIC,
		lastVisitTime: '2020/10/31 14:23:07'
	}, {
		spaceId: '1',
		connectId: '2',
		name: 'Sales Statistics in NY',
		type: ConsoleSpaceType.PRIVATE,
		lastVisitTime: '2020/11/05 15:14:11'
	} ];
};

export const fetchAvailableSpaces = async () => {
	return [ {
		spaceId: '2',
		name: 'Claim Trend'
	} ];
};