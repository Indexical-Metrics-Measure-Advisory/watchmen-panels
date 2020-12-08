export interface Condition {
}

export interface PlainCondition extends Condition {
}

export enum CompositeMode {
	AND = 'and',
	OR = 'or'
}

export interface CompositeCondition extends Condition {
	mode: CompositeMode;
	children: Array<Condition>;
}

export enum WriteTopicActionType {
	MERGE_ROW = 'write-row',
	INSERT_ROW = 'insert-row',
	INSERT_OR_MERGE_ROW = 'insert-or-merge-row',
	WRITE_FACTOR = 'write-factor'
}

export type UnitActionType = WriteTopicActionType;

export interface UnitAction {
	type?: UnitActionType;
}

export enum FactorValueArithmetic {
	YEAR_OF = 'year-of',
	MONTH_OF = 'month-of',
	WEEK_OF = 'week-of'
}

export enum ValueType {
	IN_MEMORY = 'in-memory',
	FACTOR = 'factor'
}

export interface Value {
	type?: ValueType;
}

export interface InMemoryValue {
	type: ValueType.IN_MEMORY;
	name: string;
}

export interface FactorValue {
	type: ValueType.FACTOR;
	topicId: string;
	factorId: string;
}

export interface ComputedFactorValue extends FactorValue {
	arithmetic: FactorValueArithmetic.YEAR_OF;
}

export interface WriteTopic extends UnitAction {
	type: WriteTopicActionType;
	topicId: string;
}

export interface WriteFactor extends WriteTopic {
	type: WriteTopicActionType.WRITE_FACTOR;
	topicId: string;
	factorId: string;
	value: Value;
}

export interface ProcessUnit {
	on?: Condition;
	do: Array<UnitAction>;
}

export interface Stage {
	name?: string;
	units: Array<ProcessUnit>;
}

export enum PipelineTriggerType {
	INSERT = 'insert',
	MERGE = 'merge',
	// insert or merge
	INSERT_OR_MERGE = 'insert-or-merge',
	DELETE = 'delete'
}

export interface Pipeline {
	topicId: string;
	name?: string;
	type: PipelineTriggerType;
	stages: Array<Stage>;
}

export interface PipelineFlow {
	topicId: string;
	consume: Array<Pipeline>;
	produce: Array<Pipeline>;
}
