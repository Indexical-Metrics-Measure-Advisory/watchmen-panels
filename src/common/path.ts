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
	CONSOLE_SPACES: '/console/spaces',
	CONSOLE_CONNECTED_SPACE: '/console/space/connected/:connectId',
	CONSOLE_CONNECTED_SPACE_OVERALL: '/console/space/connected/:connectId/overall',
	CONSOLE_CONNECTED_SPACE_RESOURCES: '/console/space/connected/:connectId/resources',
	CONSOLE_CONNECTED_SPACE_GROUP: '/console/space/connected/:connectId/group/:groupId',
	CONSOLE_CONNECTED_SPACE_SUBJECT: '/console/space/connected/:connectId/subject/:subjectId',
	CONSOLE_DASHBOARDS: '/console/dashboards',
	CONSOLE_DASHBOARD: '/console/dashboard/:dashboardId',
	CONSOLE_INBOX: '/console/inbox',
	CONSOLE_NOTIFICATION: '/console/notification',
	CONSOLE_SETTINGS_INBOX: '/console/settings/inbox',
	CONSOLE_SETTINGS_NOTIFICATION: '/console/settings/notification'
};
export default Paths;

export const toDomain = (path: string, domain: string) => path.replace(':domain', domain);

export const isConnectedSpaceOpened = (connectId: string): boolean => {
	const match = matchPath<{ connectId: string }>(window.location.pathname, Paths.CONSOLE_CONNECTED_SPACE);
	// eslint-disable-next-line
	return !!match && match.params.connectId == connectId;
};
export const toConnectedSpace = (path: string, connectId: string) => path.replace(':connectId', connectId);
export const toSpaceGroup = (path: string, connectId: string, groupId: string) => path.replace(':connectId', connectId).replace(':groupId', groupId);
export const toSpaceSubject = (path: string, connectId: string, subjectId: string) => path.replace(':connectId', connectId).replace(':subjectId', subjectId);
export const isDashboardOpened = (dashboardId: string): boolean => {
	const match = matchPath<{ dashboardId: string }>(window.location.pathname, Paths.CONSOLE_DASHBOARD);
	// eslint-disable-next-line
	return !!match && match.params.dashboardId == dashboardId;
};
export const toDashboard = (path: string, dashboardId: string) => path.replace(':dashboardId', dashboardId);
