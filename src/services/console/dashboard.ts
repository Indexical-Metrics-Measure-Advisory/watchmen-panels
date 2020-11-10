import { ConsoleDashboard } from './types';

export const fetchDashboards = async (): Promise<Array<ConsoleDashboard>> => {
	return [ {
		dashboardId: '1',
		name: 'Sales Statistics',
		lastVisitTime: '2020/10/20 09:36:46'
	} ];
};