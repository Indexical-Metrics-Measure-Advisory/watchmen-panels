import { useState } from 'react';
import { ConsoleDashboard } from '../../../services/console/types';

export interface ConsoleDashboardsStorage {
	items: Array<ConsoleDashboard>
}

export const useConsoleDashboards = () => {
	const [ state ] = useState<ConsoleDashboardsStorage>({
		items: [ {
			dashboardId: '1',
			name: 'Sales Statistics'
		} ]
	});

	return {
		...state
	};
};