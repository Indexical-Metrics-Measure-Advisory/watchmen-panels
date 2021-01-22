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

	LOGIN: '/login',

	CONSOLE: '/console',
	CONSOLE_HOME: '/console/home',
	CONSOLE_SPACES: '/console/spaces',
	CONSOLE_CONNECTED_SPACE: '/console/space/connected/:connectId',
	CONSOLE_CONNECTED_SPACE_OVERALL: '/console/space/connected/:connectId/overall',
	CONSOLE_CONNECTED_SPACE_RESOURCES: '/console/space/connected/:connectId/resources',
	CONSOLE_CONNECTED_SPACE_GROUP: '/console/space/connected/:connectId/group/:groupId',
	CONSOLE_CONNECTED_SPACE_SUBJECT: '/console/space/connected/:connectId/subject/:subjectId',
	CONSOLE_DASHBOARDS: '/console/dashboard',
	CONSOLE_DASHBOARD: '/console/dashboard/:dashboardId',
	CONSOLE_INBOX: '/console/inbox',
	CONSOLE_NOTIFICATION: '/console/notification',
	CONSOLE_TIMELINE: '/console/timeline',
	CONSOLE_SETTINGS: '/console/settings',
	CONSOLE_SETTINGS_INBOX: '/console/settings/inbox',
	CONSOLE_SETTINGS_NOTIFICATION: '/console/settings/notification',

	ADMIN: '/admin',
	ADMIN_HOME: '/admin/home',
	ADMIN_TASKS: '/admin/task',
	ADMIN_TASK: '/admin/task/:taskId',
	ADMIN_SPACES: '/admin/space',
	ADMIN_SPACE: '/admin/space/:spaceId',
	ADMIN_TOPICS: '/admin/topic',
	ADMIN_TOPIC: '/admin/topic/:topicId',
	ADMIN_REPORTS: '/admin/report',
	ADMIN_REPORT: '/admin/report/:reportId',
	ADMIN_PIPELINE: '/admin/pipeline',
	ADMIN_USER_GROUPS: '/admin/group',
	ADMIN_USER_GROUP: '/admin/group/:groupId',
	ADMIN_USERS: '/admin/user',
	ADMIN_USER: '/admin/user/:userId'
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
