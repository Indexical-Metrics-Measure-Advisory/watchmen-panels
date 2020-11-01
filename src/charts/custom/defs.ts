import { Bar } from './bar';
import { Doughnut } from './doughnut';
import { Line } from './line';
import { Nightingale } from './nightingale';
import { Pie } from './pie';
import { Scatter } from './scatter';
import { Sunburst } from './sunburst';
import { Tree } from './tree';
import { ChartDefinition, ChartKey } from './types';
// import { Tree } from './tree';
// import { TreeMap } from './tree-map';
// import { HeatMap } from 'heat-map';

export const ChartDefinitions: Array<ChartDefinition> = [
	Bar,
	Line,
	Scatter,
	Pie,
	Doughnut,
	Nightingale,
	Sunburst,
	Tree
];
export const ChartMap = ChartDefinitions.reduce((map, chart) => {
	map[chart.key] = chart;
	return map;
}, {} as { [key in ChartKey]: ChartDefinition });