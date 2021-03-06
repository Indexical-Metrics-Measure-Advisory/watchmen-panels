import { faCompactDisc, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import React from 'react';
import { useHistory } from 'react-router-dom';
import Path, { toConnectedSpace } from '../../../common/path';
import {
	ConnectedConsoleSpace,
	ConsoleFavorite,
	ConsoleFavoriteSpace,
	ConsoleFavoriteType,
	ConsoleSpaceType
} from '../../../services/console/types';
import { useConsoleContext } from '../context/console-context';
import { FavoriteButton } from './favorite-button';
import { HomeSectionCard } from './home-section-card';

const isFavSpace = (fav: ConsoleFavorite): fav is ConsoleFavoriteSpace => fav.type === ConsoleFavoriteType.SPACE;

export const Space = (props: {
	space: ConnectedConsoleSpace
}) => {
	const { space } = props;

	const history = useHistory();
	const { favorites: { items: favorites, remove: removeFromFavorite, add: addIntoFavorite } } = useConsoleContext();
	// eslint-disable-next-line
	const findInFavorite = () => favorites.find(fav => isFavSpace(fav) && fav.connectId == space.connectId);
	const toggleFavorite = (event: React.MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		const exists = findInFavorite();
		if (exists) {
			removeFromFavorite(exists);
		} else {
			addIntoFavorite({ type: ConsoleFavoriteType.SPACE, connectId: space.connectId } as ConsoleFavoriteSpace);
		}
	};

	const lastVisit = dayjs(space.lastVisitTime).fromNow();
	const isFavorite = !!findInFavorite();
	const onSpaceClicked = () => {
		history.push(toConnectedSpace(Path.CONSOLE_CONNECTED_SPACE, space.connectId));
	};

	return <HomeSectionCard onClick={onSpaceClicked}>
		<div>
			<span>
				<FontAwesomeIcon icon={space.type === ConsoleSpaceType.PUBLIC ? faGlobe : faCompactDisc}/>
				<span>{lastVisit}</span>
			</span>
			<span>{space.name}</span>
		</div>
		<FavoriteButton toggle={toggleFavorite} isFavorite={isFavorite}/>
	</HomeSectionCard>;
};