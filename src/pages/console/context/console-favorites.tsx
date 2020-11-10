import { useEffect, useReducer, useState } from 'react';
import { fetchFavorites } from '../../../services/console/favorites';
import { ConsoleFavorite } from '../../../services/console/types';

export interface ConsoleFavoritesStorage {
	items: Array<ConsoleFavorite>
}

export interface ConsoleFavoritesUsable {
	remove: (fav: ConsoleFavorite) => void;
	add: (fav: ConsoleFavorite) => void;
}

export const useConsoleFavorites = () => {
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);
	const [ state, setState ] = useState<ConsoleFavoritesStorage>({
		items: []
	});

	const mergeToState = (newData: Partial<ConsoleFavoritesStorage>) => {
		// @ts-ignore
		Object.keys(newData).forEach(key => state[key] = newData[key]);
		forceUpdate();
	};
	const remove = (fav: ConsoleFavorite) => {
		mergeToState({ items: state.items.filter(f => f !== fav) });
	};
	const add = (fav: ConsoleFavorite) => {
		mergeToState({ items: [ ...state.items, fav ] });
	};

	// TODO simulate data for demo purpose
	useEffect(() => {
		(async () => {
			const items = await fetchFavorites();
			setState({ items });
		})();
		// eslint-disable-next-line
	}, [ 0 ]);

	return {
		...state,
		remove,
		add
	};
};