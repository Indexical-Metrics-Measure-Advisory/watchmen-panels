import { DispatchWithoutAction, useEffect, useReducer, useState } from 'react';
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

const mergeToState = (newData: Partial<ConsoleFavoritesStorage>, forceUpdate: DispatchWithoutAction) => {
	// @ts-ignore
	Object.keys(newData).forEach(key => state[key] = newData[key]);
	forceUpdate();
};

export const useConsoleFavorites = () => {
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);
	const [ state ] = useState<ConsoleFavoritesStorage>({
		items: [],
		pinned: false,
		visible: false
	});

	const remove = (fav: ConsoleFavorite) => {
		mergeToState({ items: state.items.filter(f => f !== fav) }, forceUpdate);
	};
	const add = (fav: ConsoleFavorite) => {
		mergeToState({ items: [ ...state.items, fav ] }, forceUpdate);
	};
	const show = (rect: DOMRect, isMenuExpanded: boolean) => mergeToState({
		visible: true,
		invoker: { rect, isMenuExpanded }
	}, forceUpdate);
	const hide = () => mergeToState({ visible: false }, forceUpdate);
	const pin = () => mergeToState({ pinned: true }, forceUpdate);
	const unpin = () => mergeToState({ pinned: false, visible: false }, forceUpdate);

	// TODO simulate data for demo purpose
	useEffect(() => {
		(async () => {
			try {
				const items = await fetchFavorites();
				mergeToState({ items }, forceUpdate);
			} catch (e) {
				console.groupCollapsed(`%cError on fetch favorites.`, 'color:rgb(251,71,71)');
				console.error(e);
				console.groupEnd();
			}
		})();
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