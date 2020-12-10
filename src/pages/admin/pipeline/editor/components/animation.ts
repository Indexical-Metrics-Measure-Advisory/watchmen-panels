import { keyframes } from 'styled-components';

export const BodyHeightExpand = keyframes`
	0% {
		transform-origin: top;
		transform: scaleY(0);
	}
	99.999999% {
		transform-origin: top;
		transform: scaleY(1);
	}
	100% {
	}
`;
export const BodyHeightCollapse = keyframes`
	from {
		transform-origin: top;
		transform: scaleY(1);
	}
	99.999999% {
		transform-origin: top;
		transform: scaleY(0);
	}
	to {
		height: 0;
		overflow: hidden;
	}
`;
