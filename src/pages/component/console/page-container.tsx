import styled from 'styled-components';

export const PageContainer = styled.div<{ 'background-image': string }>`
	&:before {
		content: '';
		position: fixed;
		left: 0;
		top: 0;	
		width: 100vw;
		height: 100vh;
		z-index: -1;
		pointer-events: none;
		user-select: none;
		filter: brightness(1.5) opacity(0.2);
		background-repeat: no-repeat;
		background-position: left calc(var(--margin) * 3) bottom calc(var(--margin) * 3);
		background-size: 300px;
		background-image: url(${({ 'background-image': backgroundImage }) => backgroundImage});
		transform: rotateY(180deg);
	}
`;
export const NarrowContainer = styled(PageContainer).attrs({
	'data-widget': 'console-narrow-page-container'
})`
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	position: relative;
	max-width: 1000px;
	min-width: 600px;
	margin: var(--margin) auto;
`;
export const PlainNarrowContainer = styled.div.attrs({
	'data-widget': 'console-narrow-page-container'
})`
	flex-grow: 1;
	display: flex;
	position: relative;
	flex-direction: column;
	max-width: 1000px;
	min-width: 600px;
	margin: var(--margin) auto;
`;
