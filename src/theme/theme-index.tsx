import React, { Fragment } from 'react';
import { RouteChildrenProps } from 'react-router';
import { createGlobalStyle } from "styled-components";
import { Theme } from './types';

const GlobalStyle = createGlobalStyle<{ theme: Theme }>`
	html {
		--primary-color: ${({ theme }) => theme.primaryColor};
	}
	body {
	    margin: 0;
	    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
	    -webkit-font-smoothing: antialiased;
	    -moz-osx-font-smoothing: grayscale;
	    position: relative;
	}
	code {
	    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
	}
`;

export default (props: { children: ((props: RouteChildrenProps<any>) => React.ReactNode) | React.ReactNode }) => {
	const { children } = props;

	return <Fragment>
		<GlobalStyle/>
		{children}
	</Fragment>;
}

