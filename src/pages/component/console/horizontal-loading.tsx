import React from 'react';
import styled, { keyframes, useTheme } from 'styled-components';
import { Theme } from '../../../theme/types';

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
const HorizontalCircle = styled.div<{ width: number, opacity: 0.2 | 0.6 | 1, distance: number }>`
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
		<HorizontalCircle width={12} opacity={1} distance={80}/>
		<HorizontalCircle width={16} opacity={0.6} distance={70}/>
		<HorizontalCircle width={20} opacity={0.2} distance={60}/>
	</Container>;
};

const BlendSmall = keyframes`
	from {
		transform: translateX(0);
	}
	to {
		transform: translateX(160px);
	}
`;
const BlendMiddle = keyframes`
	from {
		transform: translateX(0);
	}
	to {
		transform: translateX(120px);
	}
`;
const BlendLarge = keyframes`
	from {
		transform: translateX(0);
	}
	to {
		transform: translateX(80px);
	}
`;

const BlendCircle = styled.div.attrs<{ left: number | string, size: number, color: string }>(({
	                                                                                              left,
	                                                                                              size,
	                                                                                              color
                                                                                              }) => {
	return {
		style: {
			width: size,
			height: size,
			marginTop: 20 - size,
			left,
			backgroundColor: color
		}
	};
})<{ left: number | string, size: number, color: string }>`
	display: block;
	position: absolute;
	border-radius: 50%;
	&[data-small] {
		animation: ${BlendSmall} 5s infinite alternate;
	}
	&[data-middle] {
		animation: ${BlendMiddle} 5s infinite alternate;
	}
	&[data-large] {
		animation: ${BlendLarge} 5s infinite alternate;
	}
`;
export const BlendLoading = (props: { className?: string, visible: boolean }) => {
	const { className, visible } = props;
	const theme = useTheme() as Theme;

	return <Container className={className} data-visible={visible} style={{ filter: 'blur(2px) contrast(10)' }}>
		<BlendCircle left='calc(50% - 40px)' size={20} color={theme.successColor} data-large/>
		<BlendCircle left='calc(50% - 60px)' size={16} color={theme.dangerColor} data-middle/>
		<BlendCircle left='calc(50% - 80px)' size={12} color={theme.primaryColor} data-small/>
	</Container>;
};