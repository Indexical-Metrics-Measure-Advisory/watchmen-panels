import { useEffect, useState } from 'react';
import { fetchDashboards } from '../../../services/console/dashboard';
import { ConsoleDashboard } from '../../../services/console/types';

export interface ConsoleDashboardsStorage {
	initialized: boolean;
	items: Array<ConsoleDashboard>;
}

export const useConsoleDashboards = () => {
	const [ state, setState ] = useState<ConsoleDashboardsStorage>({
		initialized: false,
		items: []
	});

	// TODO simulate data for demo purpose
	useEffect(() => {
		if (!state.initialized) {
			(async () => {
				try {
					const dashboards = await fetchDashboards();
					setState({ initialized: true, items: dashboards });
				} catch (e) {
					console.groupCollapsed(`%cError on fetch dashboards.`, 'color:rgb(251,71,71)');
					console.error(e);
					console.groupEnd();
				}
			})();
		}
	}, [ state.initialized ]);

	return {
		...state
	};
};