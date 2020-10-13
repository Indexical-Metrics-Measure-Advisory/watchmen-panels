import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../../assets/logo.svg';
import Path from '../../common/path';

const WelcomeContainer = styled.div`
	text-align: center;
`;
const Header = styled.div`
    background-color: var(--invert-bg-color);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
    color: var(--invert-color);
`;
const Image = styled.img`
    height: 40vmin;
`;
const Href = styled(Link)`
	color: var(--invert-color);
	text-transform: uppercase;
`;

export default () => {
	return <WelcomeContainer>
		<Header>
			<Image src={logo} alt="Welcome to WATCHMEN"/>
			<p>Welcome to Watchmen.</p>
			<Href to={Path.HOME}>
				Start
			</Href>
		</Header>
	</WelcomeContainer>;
}