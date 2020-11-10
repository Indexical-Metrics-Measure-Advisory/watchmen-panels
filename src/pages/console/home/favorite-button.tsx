import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef } from 'react';
import styled from 'styled-components';
import { useTooltip } from '../context/console-tooltip';

const FavBtn = styled.div.attrs({
	'data-widget': 'console-home-section-card-fav-btn'
})`
	display: flex;
	width: 32px;
	align-items: center;
	color: var(--console-waive-color);
	&:hover {
		color: var(--console-primary-color);
	}
	&[data-favorite=true] {
		color: var(--console-favorite-color);
		> svg {
			opacity: 1;
			width: 100%;
			height: 16px;
			margin-left: 0;
			pointer-events: auto;
		}
	}
	> svg {
		opacity: 0;
		width: 0;
		height: 0;
		margin-left: 32px;
		pointer-events: none;
		transition: all 300ms ease-in-out;
	}
`;

export const FavoriteButton = (props: {
	toggle: () => void;
	isFavorite: boolean;
}) => {
	const { toggle, isFavorite } = props;

	const buttonRef = useRef<HTMLDivElement>(null);
	const { mouseEnter, mouseLeave, show, hide } = useTooltip<HTMLDivElement>({
		show: true,
		tooltip: isFavorite ? 'Remove from Favorite' : 'Add into Favorite',
		ref: buttonRef,
		rect: ({ left, top }) => ({
			x: left + 16,
			y: top - 30,
			center: true
		})
	});
	const onClick = () => {
		hide!();
		show!(isFavorite ? 'Add into Favorite' : 'Remove from Favorite');
		toggle();
	};

	return <FavBtn onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}
	               onClick={onClick}
	               data-favorite={isFavorite}
	               ref={buttonRef}>
		<FontAwesomeIcon icon={faStar}/>
	</FavBtn>;
};