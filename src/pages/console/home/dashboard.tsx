import { faSolarPanel } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import React from 'react';
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
	const { data } = props;

	const { favorites: { items: favorites, remove, add } } = useConsoleContext();
	// eslint-disable-next-line
	const findInFavorite = () => favorites.find(fav => isFavDashboard(fav) && fav.dashboardId == data.dashboardId);
	const toggleFavorite = () => {
		const exists = findInFavorite();
		if (exists) {
			remove(exists);
		} else {
			add({ type: ConsoleFavoriteType.DASHBOARD, dashboardId: data.dashboardId } as ConsoleFavoriteDashboard);
		}
	};

	const lastVisit = dayjs(data.lastVisitTime).fromNow();
	const isFavorite = !!findInFavorite();

	return <HomeSectionCard>
		<div>
			<span>
				<FontAwesomeIcon icon={faSolarPanel}/>
				<span>{lastVisit}</span>
			</span>
			<span>{data.name}</span>
		</div>
		<FavoriteButton toggle={toggleFavorite} isFavorite={isFavorite}/>
	</HomeSectionCard>;
};