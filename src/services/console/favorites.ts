import { ConsoleFavorite, ConsoleFavoriteDashboard, ConsoleFavoriteSpace, ConsoleFavoriteType } from './types';

export const fetchFavorites = async (): Promise<Array<ConsoleFavorite>> => {
	return [ {
		dashboardId: '1',
		type: ConsoleFavoriteType.DASHBOARD
	} as ConsoleFavoriteDashboard, {
		connectId: '2',
		type: ConsoleFavoriteType.SPACE
	} as ConsoleFavoriteSpace ];
};