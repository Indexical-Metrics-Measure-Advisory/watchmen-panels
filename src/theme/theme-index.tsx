import React, { Fragment } from 'react';
import { createGlobalStyle } from "styled-components";
import { Theme } from './types';

const GlobalStyle = createGlobalStyle<{ theme: Theme }>`
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
	
	html {
		--primary-color: ${({ theme }) => theme.primaryColor};
		--primary-hover-color: ${({ theme }) => theme.primaryHoverColor};
		--danger-color: ${({ theme }) => theme.dangerColor};
		--danger-hover-color: ${({ theme }) => theme.dangerHoverColor};
		--success-color: ${({ theme }) => theme.successColor};
		--success-hover-color: ${({ theme }) => theme.successHoverColor};
		--invert-color: ${({ theme }) => theme.invertColor};
		--bg-color:  ${({ theme }) => theme.bgColor};
		--bg-color-opacity:  ${({ theme }) => theme.bgColorOpacity};
		--hover-color: ${({ theme }) => theme.hoverColor};
		--active-color: ${({ theme }) => theme.activeColor};
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
		--letter-gap: ${({ theme }) => theme.letterGap}px;
		
		--border-color: ${({ theme }) => theme.borderColor};
		--border: ${({ theme }) => theme.border};
		--border-radius: ${({ theme }) => theme.borderRadius}px;
		
		--scrollbar-background-color: ${({ theme }) => theme.scrollbarBgColor};
		--scrollbar-thumb-background-color: ${({ theme }) => theme.scrollbarThumbBgColor};
		--scrollbar-border-color: ${({ theme }) => theme.scrollbarBorderColor};
		
		--input-indent: ${({ theme }) => theme.inputIndent}px;
		
		--dialog-box-shadow: ${({ theme }) => theme.dialogBoxShadow};
		
		--header-bg-color: ${({ theme }) => theme.headerBgColor};
		--header-box-shadow: ${({ theme }) => theme.headerBoxShadow};
		--header-z-index: ${({ theme }) => theme.headerZIndex};
		
		--footer-bg-color: ${({ theme }) => theme.footerBgColor};
		--footer-color: ${({ theme }) => theme.footerColor};
		
		--margin: ${({ theme }) => theme.deskPageMargin}px;
		
		width: 100%;
		
		//&::-webkit-scrollbar {
		//	background-color: var(--scrollbar-background-color);
		//	width: 15px;
		//	height: 15px;
		//}
		//&::-webkit-scrollbar-thumb {
		//	background-color: var(--scrollbar-thumb-background-color);
		//	border: 1px solid var(--scrollbar-border-color);
		//}
		//&::-webkit-scrollbar-corner {
		//	background-color: var(--scrollbar-background-color);
		//}
	}
	
	@media (max-width: ${({ theme }) => theme.maxMobileWidth}px) {
		html {
			--margin: ${({ theme }) => theme.mobilePageMargin}px;
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
	    overflow-x: hidden;
	    width: 100%;
	}
	
	a,
	a:visited {
		color: var(--font-color);
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

