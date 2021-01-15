import { EventEmitter } from 'events';
import { useEffect, useState } from 'react';
import { fetchDashboards } from '../../../services/console/dashboard';
import { ConsoleDashboard } from '../../../services/console/types';

export enum ConsoleDashboardsEvent {
	DASHBOARD_ADDED = 'dashboard-added',
	DASHBOARD_DELETED = 'dashboard-deleted',
	DASHBOARD_RENAMED = 'dashboard-renamed'
}

export type DashboardAddedListener = (space: ConsoleDashboard) => void;
export type DashboardDeletedListener = (space: ConsoleDashboard) => void;
export type DashboardRenamedListener = (space: ConsoleDashboard) => void;

export interface ConsoleDashboardsStorage {
	initialized: boolean;
	items: Array<ConsoleDashboard>;
}

export interface ConsoleDashboardsUsable {
	addDashboard: (dashboard: ConsoleDashboard) => void;
	addDashboardAddedListener: (listener: DashboardAddedListener) => void;
	removeDashboardAddedListener: (listener: DashboardAddedListener) => void;

	deleteDashboard: (dashboard: ConsoleDashboard) => void;
	addDashboardDeletedListener: (listener: DashboardDeletedListener) => void;
	removeDashboardDeletedListener: (listener: DashboardDeletedListener) => void;

	dashboardRenamed: (dashboard: ConsoleDashboard) => void;
	addDashboardRenamedListener: (listener: DashboardRenamedListener) => void;
	removeDashboardRenamedListener: (listener: DashboardRenamedListener) => void;
}

export const useConsoleDashboards = () => {
	const [ emitter ] = useState(new EventEmitter());
	const [ state, setState ] = useState<ConsoleDashboardsStorage>({
		initialized: false,
		items: []
	});
	const [ usable ] = useState<ConsoleDashboardsUsable>({
		addDashboard: (dashboard: ConsoleDashboard) => {
			state.initialized = true;
			state.items.push(dashboard);
			emitter.emit(ConsoleDashboardsEvent.DASHBOARD_ADDED, dashboard);
		},
		addDashboardAddedListener: (listener: DashboardAddedListener) => emitter.on(ConsoleDashboardsEvent.DASHBOARD_ADDED, listener),
		removeDashboardAddedListener: (listener: DashboardAddedListener) => emitter.off(ConsoleDashboardsEvent.DASHBOARD_ADDED, listener),

		deleteDashboard: (dashboard: ConsoleDashboard) => {
			state.initialized = true;
			// eslint-disable-next-line
			const index = state.items.findIndex(d => d.dashboardId == dashboard.dashboardId);
			if (index !== -1) {
				state.items.splice(index, 1);
			}
			emitter.emit(ConsoleDashboardsEvent.DASHBOARD_DELETED, dashboard);
		},
		addDashboardDeletedListener: (listener: DashboardDeletedListener) => emitter.on(ConsoleDashboardsEvent.DASHBOARD_DELETED, listener),
		removeDashboardDeletedListener: (listener: DashboardDeletedListener) => emitter.off(ConsoleDashboardsEvent.DASHBOARD_DELETED, listener),

		dashboardRenamed: (dashboard: ConsoleDashboard) => emitter.emit(ConsoleDashboardsEvent.DASHBOARD_RENAMED, dashboard),
		addDashboardRenamedListener: (listener: DashboardRenamedListener) => emitter.on(ConsoleDashboardsEvent.DASHBOARD_RENAMED, listener),
		removeDashboardRenamedListener: (listener: DashboardRenamedListener) => emitter.off(ConsoleDashboardsEvent.DASHBOARD_RENAMED, listener)
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

	return { ...state, ...usable };
};