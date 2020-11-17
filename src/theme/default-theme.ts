const DefaultTheme = {
	// color
	primaryColor: 'rgba(43,80,174,1)',
	primaryHoverColor: 'rgba(3,51,141,1)',
	dangerColor: 'rgba(246,31,81,1)',
	dangerHoverColor: 'rgba(214,30,72,1)',
	successColor: 'rgba(30,207,10,1)',
	successHoverColor: 'rgba(22,160,7,1)',
	invertColor: '#fff',
	bgColor: '#f9fafc',
	bgColorOpacity: 'rgba(249,250,252,0.95)',
	bgColorOpacity7: 'rgba(249,250,252,0.7)',
	hoverColor: '#d3dce6',
	activeColor: 'rgba(43,80,174,0.5)',
	invertBgColor: 'rgb(1,34,96,0.9)',

	// font
	fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	codeFontFamily: "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace",
	fontSize: 14,
	lineHeight: 20,
	fontColor: '#25265e',
	fontDemiBold: 500,
	fontBold: 600,
	fontBoldest: 900,
	titleFontSize: 36,
	titleLineHeight: 54,
	letterGap: 4,

	// input
	height: 32,

	// border
	borderColor: '#d3dce6',
	border: '1px solid var(--border-color)',
	borderRadius: 4,

	// page
	maxMobileWidth: 599,
	minDeskWidth: 600,
	mobilePageMargin: 16,
	deskPageMargin: 32,

	// scroll
	scrollbarBgColor: 'rgba(229,229,229,0.5)',
	scrollbarThumbBgColor: 'rgba(198,198,198,1)',
	scrollbarBorderColor: 'transparent',

	// input
	inputIndent: 10,

	// dialog
	dialogBoxShadow: '0 4px 12px rgba(37, 38, 94, 0.3),' +
		'4px 0 12px rgba(37, 38, 94, 0.3),' +
		'-4px 0 12px rgba(37, 38, 94, 0.3),' +
		'0 -4px 12px rgba(37, 38, 94, 0.3)',

	// header
	headerBgColor: '#fff',
	headerBoxShadow: '0 4px 12px rgba(37, 38, 94, 0.06)',
	headerZIndex: 10001,

	// footer
	footerBgColor: 'rgba(3,51,141,1)',
	footerColor: 'var(--bg-color)',

	// chart
	chartBgColorLight: 'rgba(249,250,252,0.7)',
	chartBgColorDark: '#333333',
	chartZoomSliderBgColor: 'rgba(211,220,230,0.7)',
	chartZoomSliderShadowColor: 'rgba(211,220,230,0.2)',
	chartZoomHandlerIcon: 'M96 496V16c0-8.8-7.2-16-16-16H48c-8.8 0-16 7.2-16 16v480c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16zm128 0V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v480c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16z',

	// console
	consoleFontColor: '#666666',
	consoleHoverColor: 'rgb(102,132,195)',
	consolePrimaryColor: 'rgb(94,119,171)',
	consoleDangerColor: 'rgb(246,52,27)',
	consoleSuccessColor: 'rgb(33,157,79)',
	consoleWarnColor: 'rgb(255,161,0)',
	consoleInfoColor: 'rgb(138,53,193)',
	consoleWaiveColor: 'rgb(191,191,191)',
	consoleShadow: '0 0 11px 0 rgba(0, 0, 0, 0.06)',
	consoleHoverShadow: '0 0 11px 0 rgba(0, 0, 0, 0.2)',
	consolePrimaryShadow: '0 0 11px 0 rgba(94,119,171, 0.6)',
	consolePrimaryHoverShadow: '0 0 11px 0 rgba(94,119,171, 1)',

	// console menu
	consoleMenuWidth: 51,
	consoleMenuHeight: 40,
	consoleMenuMaxWidth: 321,
	consoleMenuItemIconSize: 32,
	consoleMenuSeparatorColor: 'rgb(227,227,229)',

	// console tooltip
	consoleTooltipBgColor: '#333333',
	consoleTooltipMinHeight: 20,

	// console title
	consoleTitleFontFamily: "Oswald, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	consoleTitleFontWeight: 900,

	// console favorite
	consoleFavoriteColor: 'rgba(255,142,43, 0.9)',
	consoleFavoritePinnedHeight: 36,

	// console home
	consoleHomeSectionBodyBgColor: 'rgba(233,235,240,.7)',

	// console messages
	consoleMessageHeaderBgColor: 'rgba(255,255,255,0.08)',
	consoleMailColor: 'rgba(150,171,219,0.08)',
	consoleNotificationColor1: 'rgba(150,171,219,0.08)',
	consoleNotificationColor2: 'rgba(191,243,204,0.08)',
	consoleNotificationColor3: 'rgba(255,145,145,0.08)',
	consoleNotificationColor4: 'rgba(255,204,150,0.08)',
	consoleNotificationDotColor1: 'rgba(150,171,219,1)',
	consoleNotificationDotColor2: 'rgba(191,243,204,1)',
	consoleNotificationDotColor3: 'rgba(255,145,145,1)',
	consoleNotificationDotColor4: 'rgba(255,204,150,1)',

	// console group
	consoleGroupBgColor: 'rgba(181,188,194,0.2)',
	consoleGroupQuoteColor: 'rgba(181,188,194)',
	consoleBgColorUngroup: 'rgba(119,177,127,0.2)',
	consoleColorUngroup: 'rgb(119,177,127)',

	// console subject
	consoleSubjectHeight: 40,

	// console visit colors
	consoleBgColorRecent: 'rgba(119,177,127,0.2)',
	consoleColorRecent: 'rgb(119,177,127)',
	consoleBgColorWeek: 'rgba(53,149,193,0.1)',
	consoleColorWeek: 'rgb(53,149,193)',
	consoleBgColorMonth: 'rgba(138,53,193,0.1)',
	consoleColorMonth: 'rgb(138,53,193)',
	consoleBgColorYear: 'rgba(255,161,0,0.1)',
	consoleColorYear: 'rgb(255,161,0)',
	consoleBgColorAncient: 'rgba(246,52,27, 0.1)',
	consoleColorAncient: 'rgb(246,52,27)'
};

export default DefaultTheme;