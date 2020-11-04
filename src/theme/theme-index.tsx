import React, { Fragment } from 'react';
import { createGlobalStyle } from 'styled-components';
import '../assets/fonts/oswald/oswald.css';
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
		--bg-color-opacity7:  ${({ theme }) => theme.bgColorOpacity7};
		--hover-color: ${({ theme }) => theme.hoverColor};
		--active-color: ${({ theme }) => theme.activeColor};
		--invert-bg-color: ${({ theme }) => theme.invertBgColor};
		
		--font-family: ${({ theme }) => theme.fontFamily};
		--code-font-family: ${({ theme }) => theme.codeFontFamily};
		--font-size: ${({ theme }) => theme.fontSize}px;
		--line-height: ${({ theme }) => theme.lineHeight}px;
		--font-color: ${({ theme }) => theme.fontColor};
		--font-demi-bold: ${({ theme }) => theme.fontDemiBold};
		--font-bold: ${({ theme }) => theme.fontBold};
		--font-boldest: ${({ theme }) => theme.fontBoldest};
		--title-font-size: ${({ theme }) => theme.titleFontSize}px;
		--title-line-height: ${({ theme }) => theme.titleLineHeight}px;
		--letter-gap: ${({ theme }) => theme.letterGap}px;
		
		--height: ${({ theme }) => theme.height}px;
		
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
		
		--console-font-color: ${({ theme }) => theme.consoleFontColor};
		--console-hover-color: ${({ theme }) => theme.consoleHoverColor};
		
		--console-menu-width: ${({ theme }) => theme.consoleMenuWidth}px;
		--console-menu-height: ${({ theme }) => theme.consoleMenuHeight}px;
		--console-menu-max-width: ${({ theme }) => theme.consoleMenuMaxWidth}px;
		--console-menu-item-icon-size: ${({ theme }) => theme.consoleMenuItemIconSize}px;
		--console-menu-separator-color: ${({ theme }) => theme.consoleMenuSeparatorColor};
		
		--console-tooltip-bg-color: ${({ theme }) => theme.consoleTooltipBgColor};
		--console-tooltip-min-height: ${({ theme }) => theme.consoleTooltipMinHeight};
		
		--console-title-font-family: ${({ theme }) => theme.consoleTitleFontFamily};
		--console-title-font-weight: ${({ theme }) => theme.consoleTitleFontWeight};
		
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
		
		&[data-on-print='true'] {
			body {
				background-color: transparent;
			}
			header[data-widget='page-header'],
			footer[data-widget='page-footer'] {
				display: none;
			}
			header[data-widget='page-header'] + main[data-widget='page-body'] {
				margin-top: 0;
				&:before {
					display: none;
				}
				div[data-widget='guide-steps'],
				div[data-widget='guide-operation-bar'] {
					display: none;
				}
				div[data-widget='metrics-container'][data-rnd=true] {
					&:before,
					&:after {
						display: none;
					}
					div[data-widget='chart-header'] {
						button {
							display: none;
						}
					}
					~ button[data-widget='chart-hide-on-print-btn'],
					~ button[data-widget='chart-add-paragraph-btn'],
					~ button[data-widget='chart-print-pdf-btn'],
					~ button[data-widget='chart-quit-export-btn'] {
						display: none;
					}
				}
			}
		}
	}
	.react-draggable {
		> div[data-widget='chart-container'] {
			height: 100%;
		}
		div[data-widget='chart-header'] {
			button:not([data-role=rnd]) {
				display: none;
			}
		}
		div[data-widget='chart'] {
			height: calc(100% - 40px);
			@media (min-width: 800px) {
				height: calc(100% - 48px);
			}
		}
	}
	
	.ql-editor .ql-font-Microsoft-YaHei {
  		font-family: Microsoft YaHei;
	}
	.ql-editor .ql-font-SimHei {
	  	font-family: SimHei;
	}
	.ql-editor .ql-font-Arial {
	  	font-family: Arial;
	}
	.ql-editor .ql-font-Times-New-Roman {
	  	font-family: Times New Roman;
	}
	.ql-editor .ql-font-Tahoma {
	  	font-family: Tahoma;
	}
	.ql-editor .ql-font-Verdana {
	  	font-family: Verdana;
	}
	.ql-snow .ql-picker.ql-font .ql-picker-label::before,
	.ql-snow .ql-picker.ql-font .ql-picker-item::before {
		content: 'Arial';
	}
	.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=Microsoft-YaHei]::before,
	.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=Microsoft-YaHei]::before {
		content: "Microsoft-YaHei";
	}
	.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=SimHei]::before,
	.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=SimHei]::before {
		content: "Sim Hei";
	}
	.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=Arial]::before,
	.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=Arial]::before {
		content: "Arial";
	}
	.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=Times-New-Roman]::before,
	.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=Times-New-Roman]::before {
		content: "Times New Roman";
	}
	.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=Tahoma]::before,
	.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=Tahoma]::before {
		content: "Tahoma";
	}
	.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=Verdana]::before,
	.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=Verdana]::before {
		content: "Verdana";
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

