import React from 'react';
import styled, { keyframes } from 'styled-components';

const Container = styled.div.attrs({
	'data-widget': 'console-horizontal-loading'
})`
	display: flex;
	position: relative;
	align-items: center;
	justify-content: space-around;
	transition: opacity 300ms ease-in-out;
	&[data-visible=true] {
		opacity: 1;
	}
	&[data-visible=false] {
		opacity: 0;
	}
`;

const createRollingAnimation = (options: { distance: number, opacity: 0.2 | 0.6 | 1 }) => {
	const { distance, opacity } = options;
	const opacityList: Array<number> = ({
		'1': [ 1, 0.6, 0.2, 0.6, 1, 0.6, 0.2, 0.6, 1, 0.6, 0.2, 0.6, 1 ],
		'0.6': [ 0.6, 0.2, 0.6, 1, 0.6, 0.2, 0.6, 1, 0.6, 0.2, 0.6, 1, 0.6 ],
		'0.2': [ 0.2, 0.6, 1, 0.6, 0.2, 0.6, 1, 0.6, 0.2, 0.6, 1, 0.6, 0.2 ]
	} as any)[`${opacity}`] || [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ];
	return keyframes`${new Array(13).fill(1).map((v, index, array) => {
		let marginLeft = 0;
		let rotateY = 0;
		let opacity = opacityList[index];
		switch (true) {
			case index === 0 || index === 12:
				marginLeft = 0 - distance;
				rotateY = 0;
				break;
			case index === 1 || index === 11:
				marginLeft = 0 - distance / 3 * 2;
				rotateY = 180;
				break;
			case index === 2 || index === 10:
				marginLeft = 0 - distance / 3;
				rotateY = 360;
				break;
			case index === 3 || index === 9:
				marginLeft = 0;
				rotateY = 540;
				break;
			case index === 4 || index === 8:
				marginLeft = distance / 3;
				rotateY = 720;
				break;
			case index === 5 || index === 7:
				marginLeft = distance / 3 * 2;
				rotateY = 900;
				break;
			case index === 6:
				marginLeft = distance;
				rotateY = 1080;
				break;
		}
		return `
				${index / (array.length - 1) * 100}% {
					transform: rotateY(${rotateY}deg);
					margin-left: ${marginLeft}px;
					opacity: ${opacity};
				}
			`;
	}).join('')}`;
};
const Loading = styled.div<{ width: number, opacity: 0.2 | 0.6 | 1, distance: number }>`
	display: block;
	position: absolute;
	border-radius: 100%;
	background-color: var(--primary-color);
	opacity: ${({ opacity }) => opacity};
	left: calc(50% - ${({ width }) => width / 2}px);
	width: ${({ width }) => width}px;
	height: ${({ width }) => width}px;
	user-select: none;
	pointer-events: none;
	animation: ${({ distance, opacity }) => createRollingAnimation({ distance, opacity })} 6s linear infinite;
`;

export const HorizontalLoading = (props: { className?: string, visible: boolean }) => {
	const { className, visible } = props;

	return <Container className={className} data-visible={visible}>
		<Loading width={12} opacity={1} distance={80}/>
		<Loading width={16} opacity={0.6} distance={70}/>
		<Loading width={20} opacity={0.2} distance={60}/>
	</Container>;
};