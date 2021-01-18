import { faSolarPanel } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import React from 'react';
import { useHistory } from 'react-router-dom';
import Path from '../../../common/path';
import {
	ConsoleDashboard,
	ConsoleFavorite,
	ConsoleFavoriteDashboard,
	ConsoleFavoriteType
} from '../../../services/console/types';
import { useConsoleContext } from '../context/console-context';
import { FavoriteButton } from './favorite-button';
import { HomeSectionCard } from './home-section-card';

const isFavDashboard = (fav: ConsoleFavorite): fav is ConsoleFavoriteDashboard => fav.type === ConsoleFavoriteType.DASHBOARD;

export const Dashboard = (props: {
	data: ConsoleDashboard
}) => {
	const { data: dashboard } = props;

	const history = useHistory();
	const {
		favorites: {
			items: favorites, remove: removeFromFavorite, add: addIntoFavorite
		},
		dashboards: { items: dashboards }
	} = useConsoleContext();
	// eslint-disable-next-line
	const findInFavorite = () => favorites.find(fav => isFavDashboard(fav) && fav.dashboardId == dashboard.dashboardId);
	const toggleFavorite = () => {
		const exists = findInFavorite();
		if (exists) {
			removeFromFavorite(exists);
		} else {
			addIntoFavorite({
				type: ConsoleFavoriteType.DASHBOARD,
				dashboardId: dashboard.dashboardId
			} as ConsoleFavoriteDashboard);
		}
	};

	const lastVisit = dayjs(dashboard.lastVisitTime).fromNow();
	const isFavorite = !!findInFavorite();
	const onDashboardClicked = () => {
		dashboards.forEach(d => {
			// eslint-disable-next-line
			d.current = d.dashboardId == dashboard.dashboardId;
		});
		history.push(Path.CONSOLE_DASHBOARDS);
	};

	return <HomeSectionCard onClick={onDashboardClicked}>
		<div>
			<span>
				<FontAwesomeIcon icon={faSolarPanel}/>
				<span>{lastVisit}</span>
			</span>
			<span>{dashboard.name}</span>
		</div>
		<FavoriteButton toggle={toggleFavorite} isFavorite={isFavorite}/>
	</HomeSectionCard>;
};