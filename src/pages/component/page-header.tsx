import React from 'react';
import styled from 'styled-components';
import Logo from './logo';

const Header = styled.header`
	top: 0;
	left: 0;
	position: fixed;
	box-shadow: var(--header-box-shadow);
	width: 100%;
	background-color: var(--header-bg-color);
	z-index: var(--header-z-index);
	display: flex;
	justify-content: center;
	align-items: center;
	height: 60px;
	padding: 0 var(--page-margin);
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

export default () => {
	return <Header>
		<ProductLogo/>
		<ProductName>Watchmen</ProductName>
		<Placeholder/>
	</Header>;
}