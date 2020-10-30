import { Bar } from './bar';
import { Line } from './line';
import { Scatter } from './scatter';
import { ChartDefinition, ChartKey } from './types';
// import { Pie } from './pie';
// import { Tree } from './tree';
// import { TreeMap } from './tree-map';
// import { Sunburst } from './sunburst';
// import { HeatMap } from 'heat-map';

export const ChartDefinitions: Array<ChartDefinition> = [
	Bar,
	Line,
	Scatter
];
export const ChartMap = ChartDefinitions.reduce((map, chart) => {
	map[chart.key] = chart;
	return map;
}, {} as { [key in ChartKey]: ChartDefinition });