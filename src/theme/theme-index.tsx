import React, { Fragment } from 'react';
import { createGlobalStyle } from "styled-components";
import { Theme } from './types';

const GlobalStyle = createGlobalStyle<{ theme: Theme }>`
	* {
		box-sizing: border-box;
	}
	
	html {
		--primary-color: ${({ theme }) => theme.primaryColor};
		--primary-hover-color: ${({ theme }) => theme.primaryHoverColor};
		--invert-color: ${({ theme }) => theme.invertColor};
		--bg-color:  ${({ theme }) => theme.bgColor};
		--invert-bg-color: ${({ theme }) => theme.invertBgColor};
		
		--font-family: ${({ theme }) => theme.fontFamily};
		--code-font-family: ${({ theme }) => theme.codeFontFamily};
		--font-size: ${({ theme }) => theme.fontSize}px;
		--line-height: ${({ theme }) => theme.lineHeight}px;
		--font-color: ${({ theme }) => theme.fontColor};
		--font-bold: ${({ theme }) => theme.fontBold};
		--font-boldest: ${({ theme }) => theme.fontBoldest};
		--title-font-size: ${({ theme }) => theme.titleFontSize}px;
		--title-line-height: ${({ theme }) => theme.titleLineHeight}px;
		
		--border-color: ${({ theme }) => theme.borderColor};
		--border: ${({ theme }) => theme.border};
		--border-radius: ${({ theme }) => theme.borderRadius}px;
		
		--header-bg-color: ${({ theme }) => theme.headerBgColor};
		--header-box-shadow: ${({ theme }) => theme.headerBoxShadow};
		--header-z-index: ${({ theme }) => theme.headerZIndex};
		
		--footer-bg-color: ${({ theme }) => theme.footerBgColor};
		--footer-color: ${({ theme }) => theme.footerColor};
		
		--page-margin: ${({ theme }) => theme.deskPageMargin}px;
	}
	
	@media (max-width: ${({ theme }) => theme.maxMobileWidth}px) {
		html {
			--page-margin: ${({ theme }) => theme.mobilePageMargin}px;
		}
	}
	
	body {
	    margin: 0;
	    font-family: var(--font-family);
	    font-size: var(--font-size);
	    color: var(--font-color);
	    -webkit-font-smoothing: antialiased;
	    -moz-osx-font-smoothing: grayscale;
	    position: relative;
	    background-color: var(--bg-color);
	}
	
	code {
	    font-family: var(--code-font-family);
	}
`;

export default (props: { children: ((props: any) => React.ReactNode) | React.ReactNode }) => {
	const { children } = props;

	return <Fragment>
		<GlobalStyle/>
		{children}
	</Fragment>;
}

