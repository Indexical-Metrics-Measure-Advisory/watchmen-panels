import styled from 'styled-components';

export const HomeSectionCard = styled.div.attrs({
	'data-widget': 'console-home-section-card'
})`
	position: relative;
	border-radius: calc(var(--margin) / 3);
	background-color: var(--invert-color);
	padding: calc(var(--margin) / 3) calc(var(--margin) / 2);
	cursor: pointer;
	&:hover {
		box-shadow: var(--console-hover-shadow);
	}
`;
