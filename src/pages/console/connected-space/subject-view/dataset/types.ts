import { ConsoleTopic, ConsoleTopicFactor } from '../../../../../services/console/types';

export type FactorMap = Map<string, { topic: ConsoleTopic, factor: ConsoleTopicFactor }>;

export enum ColumnSortBy {
	ASC = 'asc',
	DESC = 'desc'
}

export interface ColumnDef {
	fixed: boolean;
	width: number;
	index: number;
	sort?: ColumnSortBy;
}

export interface FactorColumnDef extends ColumnDef {
	topic: ConsoleTopic;
	factor: ConsoleTopicFactor;
}

export interface SequenceColumnDef extends ColumnDef {
}

export interface DataSetTableProps {
	columns: Array<ColumnDef>,
	autoFill: boolean
}

export interface ColumnDefs {
	fixed: Array<FactorColumnDef>;
	data: Array<FactorColumnDef>;
}

export interface TableSelection {
	inFixTable: boolean;
	row: number;
	rowTop: number;
	rowHeight: number;

	column: number;
	columnLeft: number;
	columnWidth: number;
	columnHeight: number;

	verticalScroll: number;
	horizontalScroll: number;
}