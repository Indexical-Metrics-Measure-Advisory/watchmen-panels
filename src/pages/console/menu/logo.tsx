import React from 'react';
import styled from 'styled-components';
import Logo from '../../component/logo';

const LogoContainer = styled.div.attrs({ 'data-widget': 'console-logo-container' })`
	display: flex;
	padding: calc(var(--margin) / 2) calc((var(--console-menu-width) - 32px) / 2) \
			 calc(var(--margin) / 2) calc(var(--margin) / 4);
	align-items: center;
`;
const TopLogo = styled(Logo)`
	width: 32px;
	height: 32px;
`;
const TopTitle = styled.div`
	font-weight: var(--font-bold);
	font-size: 1.2em;
	margin-left: calc((var(--console-menu-width) - 32px) / 2);
`;

export const MenuLogo = () => {
	return <LogoContainer>
		<TopLogo/>
		<TopTitle>Watchmen</TopTitle>
	</LogoContainer>;
};