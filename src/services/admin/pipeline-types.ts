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

export enum UnitActionType {
	WRITE_FACTOR = 'write-factor'
}

export interface UnitAction {
	type?: UnitActionType;
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

export interface WriteFactor extends UnitAction {
	type: UnitActionType.WRITE_FACTOR;
	topicId: string;
	factorId: string;
	value?: Value;
}

export interface ProcessUnit {
	on?: Condition;
	do: Array<UnitAction>;
}

export interface Stage {
	units: Array<ProcessUnit>;
}

export enum PipelineTriggerType {
	INSERT = 'insert',
	MERGE = 'merge',
	// insert or merge
	CHANGE = 'change',
	DELETE = 'delete'
}

export interface Pipeline {
	topicId?: string;
	type?: PipelineTriggerType;
	stages: Array<Stage>;
}

export interface PipelineFlow {
	topicId: string;
	consume?: Array<Pipeline>;
	produce?: Array<Pipeline>;
}
