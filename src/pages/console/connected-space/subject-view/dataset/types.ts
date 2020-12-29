import { ConsoleTopic, ConsoleTopicFactor } from '../../../../../services/console/types';

export type FactorMap = Map<string, { topic: ConsoleTopic, factor: ConsoleTopicFactor }>;

export interface ColumnDef {
	fixed: boolean;
	width: number;
	index: number;
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

	column: number;
	columnLeft: number;
	columnWidth: number;

	verticalScroll: number;
	horizontalScroll: number;
}