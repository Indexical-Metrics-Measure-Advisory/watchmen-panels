import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';

const Footer = styled.footer`
	background-color: var(--footer-bg-color);
	color: var(--footer-color);
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 0 var(--margin);
	width: 100vw;
	> * {
		width: 100%;
	}
	// @media (min-width: ${({ theme }) => theme.minDeskWidth}px) {
	//     padding-top: 120px;
	// }
`;
const LastLine = styled.div`
	display: flex;
	flex-wrap: wrap;
	padding: 11px 0;
	align-items: center;
	justify-content: space-between;
	
	> span:first-child {
		pointer-events: none;
		user-select: none;
	}
`;
const SocialIcons = styled.div`
	display: flex;
	> a {
		font-size: 1.4em;
		color: var(--footer-color);
		padding: 0 4px;
		&:hover {
			opacity: 0.8;
		}
		&:visited {
			color: var(--footer-color);
		}
		&:first-child {
			padding-left: 0;
		}
		&:last-child {
			padding-right: 0;
		}
	}
`;

export default () => {
	return <Footer>
		<LastLine>
			<span>© IMMA Team. All rights reserved.</span>
			<SocialIcons>
				<a href={process.env.REACT_APP_GITHUB} target="_blank"
				   rel="noopener noreferrer"
				   title="IMMA in Github">
					<FontAwesomeIcon icon={faGithub}/>
				</a>
			</SocialIcons>
		</LastLine>
	</Footer>;
}