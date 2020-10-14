import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import Path from '../../common/path';
import Button from './button';
import Logo from './logo';

const Header = styled.header`
	top: 0;
	left: 0;
	position: fixed;
	box-shadow: var(--header-box-shadow);
	width: 100vw;
	background-color: var(--header-bg-color);
	z-index: var(--header-z-index);
	display: flex;
	justify-content: center;
	align-items: center;
	height: 60px;
	padding: 0 var(--margin);
	border-bottom: var(--border);
	& + main {
		margin-top: 60px;
	}
`;
const ProductLogo = styled(Logo)`
	height: 36px;
	width: auto;
`;
const ProductName = styled.span`
	margin-left: 12px;
	pointer-events: none;
	user-select: none;
	font-size: 1.2em;
	font-weight: var(--font-bold);
`;
const Placeholder = styled.div`
	flex-grow: 1;
`;
const HeaderButton = styled(Button)`
	border-radius: 100%;
	height: 40px;
	width: 40px;
	margin-left: 12px;
	@media (min-width: ${({ theme }) => theme.minDeskWidth}px) {
		&:hover {
			background-color: var(--primary-hover-color);
			border-color: var(--primary-hover-color);
			color: var(--invert-color);
			opacity: 1;
			transform: scale(1.1);
		}
	}
`;

export default () => {
	const isHome = useRouteMatch(Path.HOME);

	return <Header>
		<ProductLogo/>
		<ProductName>Watchmen</ProductName>
		<Placeholder/>
		{isHome
			? null
			: <Link to={Path.HOME}>
				<HeaderButton title="Back to Home">
					<FontAwesomeIcon icon={faHome}/>
				</HeaderButton>
			</Link>}
	</Header>;
}