import { DataSet } from '../data/types';

export type ChartElement = (options: {
	className?: string,
	data: DataSet,
	options?: any
}) => JSX.Element