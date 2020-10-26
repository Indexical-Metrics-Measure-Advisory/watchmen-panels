import { Bar } from './bar';
import { ChartDefinition, ChartKey } from './types';
// import { Line } from './line';
// import { Pie } from './pie';
// import { Scatter } from './scatter';
// import { Radar } from './radar';
// import { Tree } from './tree';
// import { Sunburst } from './sunburst';
// import { HeatMap } from 'heat-map';

export const ChartDefinitions: Array<ChartDefinition> = [
	Bar
];
export const ChartMap = ChartDefinitions.reduce((map, chart) => {
	map[chart.key] = chart;
	return map;
}, {} as { [key in ChartKey]: ChartDefinition });