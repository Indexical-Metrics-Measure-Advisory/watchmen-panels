import { useEffect, useState } from 'react';
import { fetchDashboards } from '../../../services/console/dashboard';
import { ConsoleDashboard } from '../../../services/console/types';

export interface ConsoleDashboardsStorage {
	items: Array<ConsoleDashboard>
}

export const useConsoleDashboards = () => {
	const [ state, setState ] = useState<ConsoleDashboardsStorage>({
		items: []
	});

	// TODO simulate data for demo purpose
	useEffect(() => {
		(async () => {
			try {
				const dashboards = await fetchDashboards();
				setState({ items: dashboards });
			} catch (e) {
				console.groupCollapsed(`%cError on fetch dashboards.`, 'color:rgb(251,71,71)');
				console.error(e);
				console.groupEnd();
			}
		})();
	}, []);

	return {
		...state
	};
};