import { useEffect, useReducer, useState } from 'react';
import { fetchFavorites } from '../../../services/console/favorites';
import { ConsoleFavorite } from '../../../services/console/types';

export interface ConsoleFavoritesStorage {
	items: Array<ConsoleFavorite>;
	pinned: boolean;
	visible: boolean;
	invoker?: {
		rect: DOMRect;
		isMenuExpanded: boolean
	}
}

export interface ConsoleFavoritesUsable {
	remove: (fav: ConsoleFavorite) => void;
	add: (fav: ConsoleFavorite) => void;
	show: (rect: DOMRect, isMenuExpanded: boolean) => void;
	hide: () => void;
	pin: () => void;
	unpin: () => void;
}

export const useConsoleFavorites = () => {
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);
	const [ state ] = useState<ConsoleFavoritesStorage>({
		items: [],
		pinned: false,
		visible: false
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
	const show = (rect: DOMRect, isMenuExpanded: boolean) => mergeToState({
		visible: true,
		invoker: { rect, isMenuExpanded }
	});
	const hide = () => mergeToState({ visible: false });
	const pin = () => mergeToState({ pinned: true });
	const unpin = () => mergeToState({ pinned: false, visible: false });

	// TODO simulate data for demo purpose
	useEffect(() => {
		(async () => {
			try {
				const items = await fetchFavorites();
				mergeToState({ items });
			} catch (e) {
				console.groupCollapsed(`%cError on fetch favorites.`, 'color:rgb(251,71,71)');
				console.error(e);
				console.groupEnd();
			}
		})();
		// eslint-disable-next-line
	}, []);

	return {
		...state,
		remove,
		add,
		show,
		hide,
		pin,
		unpin
	};
};