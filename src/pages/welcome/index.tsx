import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Path from '../../common/path';
import Logo from '../component/logo';

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
	> p {
		margin-top: var(--margin);
	}
`;
const Image = styled(Logo)`
    height: 40vmin;
`;
const Href = styled(Link)`
	margin-top: var(--margin);
	color: var(--invert-color);
	text-transform: uppercase;
	&:visited {
		color: var(--invert-color);
	}
`;

const WelcomeIndex = () => {
	return <WelcomeContainer>
		<Header>
			<div>
				<Image/>
			</div>
			<p>Welcome to Watchmen.</p>
			<Href to={Path.HOME}>
				Start
			</Href>
		</Header>
	</WelcomeContainer>;
};
export default WelcomeIndex;