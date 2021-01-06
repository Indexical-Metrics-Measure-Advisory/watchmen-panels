export const CHART_MARGIN = 32;
export const CHART_COLUMN_GAP = 32;
export const INIT_TOP = CHART_MARGIN;
export const INIT_LEFT = CHART_MARGIN;
export const INIT_MIN_WIDTH = 300;
export const CHART_HEADER_HEIGHT = 40;
export const CHART_ASPECT_RATIO = 3 / 4;
export const CHART_MIN_HEIGHT = 200 + CHART_HEADER_HEIGHT;
export const CHART_MIN_WIDTH = CHART_MIN_HEIGHT / CHART_ASPECT_RATIO + CHART_HEADER_HEIGHT;

export const generateChartRect = (container: HTMLDivElement) => {
	const { clientWidth } = container;
	const width = Math.max(INIT_MIN_WIDTH, (clientWidth - CHART_MARGIN * 2 - CHART_COLUMN_GAP * 2) / 3);
	const height = (width - CHART_HEADER_HEIGHT) * CHART_ASPECT_RATIO;
	return { top: INIT_TOP, left: INIT_LEFT, width, height, max: false };
};
