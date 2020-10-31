import * as faPlay from '@fortawesome/free-solid-svg-icons/faPlay';
import React from 'react';
import styled from 'styled-components';
import { Scene, useDirector } from './director';
import { box } from './producer';

const playBtn = { r: 150 };

const PlayButtonContainer = styled.g`
	cursor: pointer;
	transition: all 300ms ease-in-out;
	&:not([data-start='${Scene.NOT_START}']) {
		opacity: 0;
		pointer-events: none;
	}
	&:hover {
		transform: scale(1.05) translate(-${box.cx * 0.05}px, -${box.cy * 0.05}px);
		> circle {
			stroke: var(--primary-color);
		}
		> path {
			fill: var(--primary-color);
		}
	}
	> circle {
		fill: transparent;
		stroke: #999;
		stroke-width: 32px;
		transition: all 300ms ease-in-out;
	}
`;
// for balance the visual effect, let coefficient of x-axis to be more than 2, now it is 2.45.
const PlayButton = styled.path<{ scale: number }>`
	fill: #999;
	transform: scale(${({ scale }) => scale}) translate(${({ scale }) => box.cx / scale - faPlay.width / 2.45}px, ${({ scale }) => box.cy / scale - faPlay.height / 2}px);
	transition: all 300ms ease-in-out;
`;

export const Announcer = (props: {}) => {
	const { current, next } = useDirector();

	return <PlayButtonContainer onClick={next} data-start={current()}>
		<circle cx={box.cx} cy={box.cy} r={playBtn.r}/>
		<PlayButton d={faPlay.svgPathData} scale={playBtn.r / faPlay.width}/>
	</PlayButtonContainer>;

};