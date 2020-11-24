import React from 'react';
import styled from 'styled-components';
import Logo from '../../logo';

const LogoContainer = styled.div.attrs({ 'data-widget': 'console-logo-container' })`
	display: flex;
	padding: calc(var(--margin) / 2) calc((var(--console-menu-width) - var(--console-menu-item-icon-size)) / 2) \
			 calc(var(--margin) / 2) calc(var(--margin) / 4);
	align-items: center;
`;
const TopLogo = styled(Logo)`
	width: var(--console-menu-item-icon-size);
	height: var(--console-menu-item-icon-size);
`;
const TopTitle = styled.div`
	font-family: var(--console-title-font-family);
	font-weight: var(--console-title-font-weight);
	font-style: italic;
	font-size: 1.8em;
	letter-spacing: 2px;
	font-variant: petite-caps;
	margin-left: calc((var(--console-menu-width) - var(--console-menu-item-icon-size)) / 2);
	overflow-x: hidden;
	white-space: nowrap;
`;

export const MenuLogo = (props: {
	title?: string;
}) => {
	const { title = 'Watchmen' } = props;
	return <LogoContainer>
		<TopLogo/>
		<TopTitle>{title}</TopTitle>
	</LogoContainer>;
};