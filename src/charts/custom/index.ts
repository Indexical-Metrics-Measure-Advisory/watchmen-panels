import { Bar } from './bar';
import { Line } from './line';
import { ChartDefinition, ChartKey } from './types';
// import { Pie } from './pie';
// import { Scatter } from './scatter';
// import { Radar } from './radar';
// import { Tree } from './tree';
// import { Sunburst } from './sunburst';
// import { HeatMap } from 'heat-map';

export const ChartDefinitions: Array<ChartDefinition> = [
	Bar,
	Line
];
export const ChartMap = ChartDefinitions.reduce((map, chart) => {
	map[chart.key] = chart;
	return map;
}, {} as { [key in ChartKey]: ChartDefinition });