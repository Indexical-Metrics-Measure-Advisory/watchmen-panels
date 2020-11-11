import { matchPath } from 'react-router-dom';

const Paths = {
	HOME: '/home',

	WELCOME: '/welcome',

	GUIDE: '/guide',
	GUIDE_DOMAIN_SELECT: '/guide/domain-select',
	GUIDE_IMPORT_DATA: '/guide/:domain/import-data',
	GUIDE_MAPPING_FACTOR: '/guide/:domain/mapping-factor',
	GUIDE_MEASURE_INDICATOR: '/guide/:domain/measure-indicator',
	GUIDE_BUILD_METRICS: '/guide/:domain/build-metrics',

	CONSOLE: '/console',
	CONSOLE_HOME: '/console/home',
	CONSOLE_SPACE: '/console/space/:spaceId',
	CONSOLE_CONNECTED_SPACE: '/console/space/connected/:connectId',
	CONSOLE_INBOX: '/console/inbox',
	CONSOLE_NOTIFICATION: '/console/notification'
};
export default Paths;

export const toDomain = (path: string, domain: string) => path.replace(':domain', domain);

export const isConnectedSpaceOpened = (connectId: string): boolean => {
	const match = matchPath(location.pathname, Paths.CONSOLE_CONNECTED_SPACE);
	if (match) {
		// eslint-disable-next-line
		if ((match.params as any)?.connectId == connectId) {
			return true;
		}
	}
	return false;
};
export const toConnectedSpace = (path: string, connectId: string) => path.replace(':connectId', connectId);
