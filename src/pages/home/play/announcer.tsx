import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Scene, ScenesDefs, useDirector } from './director';
import { box } from './producer';

const size = { r: 150, stroke: 32, smallR: 16, smallStroke: 4, margin: 16 };

const Starting = keyframes`
	50% {
		opacity: 0;
	}
	100% {
		opacity: 1;
		top: ${box.top + box.h + (box.bottom - size.smallR * 2) / 2}px;
		left: calc(50% + ${box.w / 2 - size.margin - size.smallR * 2}px);
		width: ${size.smallR * 2}px;
		height: ${size.smallR * 2}px;
		border-width: ${size.smallStroke}px;
	}
`;
const StartingPlay = keyframes`
	50% {
		opacity: 0;
	}
	100% {
		opacity: 0;
		font-size: 1em;
		top: ${size.smallR - size.smallStroke - 7}px;
		left: ${size.smallR - size.smallStroke - 5}px;
	}
`;
const ShowPause = keyframes`
	50% {
		opacity: 0;
	}
	100% {
		opacity: 1;
		font-size: 1em;
		top: ${size.smallR - size.smallStroke - 7}px;
		left: ${size.smallR - size.smallStroke - 6}px;
	}
`;
const PlayButtonContainer = styled.div`
	display: flex;
	align-items: center;
	position: absolute;
	top: ${box.h / 2 - size.r + box.top}px;
	left: calc(50% - ${size.r}px);
	width: ${size.r * 2}px;
	height: ${size.r * 2}px;
	border: ${size.stroke}px solid #999;
	border-radius: 100%;
	cursor: pointer;
	transition: all 300ms ease-in-out;
	z-index: 100;
	&:not([data-scene='${Scene.NOT_START}']) {
		animation: ${Starting} ${ScenesDefs[Scene.MASSES_OF_FILES].announce}ms ease-in-out forwards;
		> svg:first-child {
			animation: ${StartingPlay} ${ScenesDefs[Scene.MASSES_OF_FILES].announce}ms ease-in-out forwards;
		}
		> svg:last-child {
			animation: ${ShowPause} ${ScenesDefs[Scene.MASSES_OF_FILES].announce}ms ease-in-out forwards;
		}
	}
	&:hover {
		transform: scale(1.05);
		border-color: var(--primary-color);
		> svg {
			color: var(--primary-color);
		}
	}
`;
// for balance the visual effect, add 6px on left
const InnerIcon = styled(FontAwesomeIcon)`
	display: block;
	position: absolute;
	top: ${size.r - size.stroke - 72}px;
	color: #999;
	font-size: 144px;
	transition: all 300ms ease-in-out;
`;
const Play = styled(InnerIcon)`
	left: ${size.r - size.stroke - 61 + 6}px;
	opacity: 1;
`;
const Pause = styled(InnerIcon)`
	left: ${size.r - size.stroke - 61}px;
	opacity: 0;
`;

export const Announcer = () => {
	const { current, next, isPaused } = useDirector();

	const currentScene = current();
	const paused = isPaused();

	return <PlayButtonContainer onClick={next} data-scene={currentScene}>
		<Play icon={faPlay} data-visible={paused || currentScene === Scene.NOT_START}/>
		<Pause icon={faPause} data-visible={!paused && currentScene !== Scene.NOT_START}/>
	</PlayButtonContainer>;
};