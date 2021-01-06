import {
	ConsoleSpaceSubjectChart,
	ConsoleSpaceSubjectChartDataSet,
	ConsoleSpaceSubjectChartDataSetGrid
} from '../../../services/console/types';
import { ChartTypeDefinition, Validator } from './types';

interface IntermediateTreeNode {
	name: string,
	children: ConsoleSpaceSubjectChartDataSetGrid
}

interface TreeNode {
	name: string;
}

interface NonLeafTreeNode extends TreeNode {
	children: Array<TreeNode>;
}

interface LeafTreeNode extends TreeNode {
	value: number;
}

export const getDimensionColumnIndexOffset = (chart: ConsoleSpaceSubjectChart) => {
	return chart.indicators.length;
};

export const buildDescartesByDimensions = (chart: ConsoleSpaceSubjectChart, dataset: ConsoleSpaceSubjectChartDataSet) => {
	const { data } = dataset;
	const { dimensions } = chart;

	const columnIndexOffset = getDimensionColumnIndexOffset(chart);
	const dimensionIndexes = new Array(dimensions.length).fill(1).map((v, index) => index + columnIndexOffset);
	return data.map(row => {
		return { value: dimensionIndexes.map(index => row[index]).join(','), row };
	});
};

/**
 * multiple roots are allowed, depends on data.
 * each branch has same depth.
 */
export const buildTreeData = (chart: ConsoleSpaceSubjectChart, dataset: ConsoleSpaceSubjectChartDataSet) => {
	const { dimensions } = chart;
	const dimensionColumnIndexOffset = getDimensionColumnIndexOffset(chart);
	const buildData = (dimensionIndex: number, grid: ConsoleSpaceSubjectChartDataSetGrid): Array<NonLeafTreeNode> => {
		const dimensionValueMap = new Map<string, number>();
		return grid.reduce<Array<IntermediateTreeNode>>((data, row) => {
			const dimensionValue = `${row[dimensionIndex + dimensionColumnIndexOffset] || ''}`;
			const dimensionValueIndex = dimensionValueMap.get(dimensionValue);
			if (!dimensionValueIndex) {
				data.push({ name: dimensionValue, children: [ row ] });
				dimensionValueMap.set(dimensionValue, data.length);
			} else {
				data[dimensionValueIndex].children.push(row);
			}
			return data;
		}, [] as Array<IntermediateTreeNode>).map(({ name, children }) => {
			if (dimensionIndex === dimensions.length - 2) {
				// non-leaf nodes done, start to process indicator
				return {
					name,
					children: children.map(row => {
						return {
							name: `${row[dimensionIndex + 1 + dimensionColumnIndexOffset]}`,
							value: row[0]
						} as LeafTreeNode;
					})
				};
			} else {
				// next dimension
				return { name, children: buildData(dimensionIndex + 1, children) };
			}
		});
	};
	return buildData(0, dataset.data);
};

export const validateIndicatorCount: Validator = (chart: ConsoleSpaceSubjectChart, def: ChartTypeDefinition) => {
	const indicatorCount = chart.indicators.length;
	if (!chart.indicators || indicatorCount === 0) {
		return { pass: false, error: 'No indicator defined.' };
	}
	if (def.minIndicatorCount && indicatorCount < def.minIndicatorCount) {
		return { pass: false, error: `At least ${def.minIndicatorCount} indicators, current has ${indicatorCount}.` };
	}
	if (def.maxIndicatorCount && indicatorCount > def.maxIndicatorCount) {
		return { pass: false, error: `At most ${def.maxIndicatorCount} indicators, current has ${indicatorCount}.` };
	}
	return { pass: true };
};

export const validateDimensionCount: Validator = (chart: ConsoleSpaceSubjectChart, def: ChartTypeDefinition) => {
	const dimensionCount = chart.dimensions.length;
	if (!chart.dimensions || dimensionCount === 0) {
		return { pass: false, error: 'No dimensions defined.' };
	}
	if (def.minDimensionCount && dimensionCount < def.minDimensionCount) {
		return { pass: false, error: `At least ${def.minDimensionCount} dimensions, current has ${dimensionCount}.` };
	}
	if (def.maxDimensionCount && dimensionCount > def.maxDimensionCount) {
		return { pass: false, error: `At most ${def.maxDimensionCount} dimensions, current has ${dimensionCount}.` };
	}
	return { pass: true };
};