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

export enum SystemActionType {
	ALARM = 'alarm',
	COPY_TO_MEMORY = 'copy-to-memory'
}

export enum ReadTopicActionType {
	FIND_ROW = 'find-row',
	EXISTS = 'exists'
}

export enum WriteTopicActionType {
	MERGE_ROW = 'merge-row',
	INSERT_ROW = 'insert-row',
	INSERT_OR_MERGE_ROW = 'insert-or-merge-row',
	WRITE_FACTOR = 'write-factor'
}

export type UnitActionType = WriteTopicActionType | ReadTopicActionType | SystemActionType;

export interface UnitAction {
	type: UnitActionType;
}

export enum DatePartArithmetic {
	YEAR_OF = 'year-of',
	MONTH_OF = 'month-of',
	WEEK_OF = 'week-of'
}

export type SimpleFuncArithmetic = DatePartArithmetic;

export enum ValueType {
	IN_MEMORY = 'in-memory',
	FACTOR = 'factor'
}

export interface AValue {
	type?: ValueType;
}

export interface InMemoryValue extends AValue {
	type: ValueType.IN_MEMORY;
	name: string;
}

export interface FactorValue extends AValue {
	type: ValueType.FACTOR;
	topicId: string;
	factorId: string;
}

export interface SimpleFuncFactorValue extends FactorValue {
	arithmetic: SimpleFuncArithmetic
}

export interface ComputedDatePartFactorValue extends SimpleFuncFactorValue {
	arithmetic: DatePartArithmetic;
}

export interface UnitActionWriteTopic extends UnitAction {
	type: WriteTopicActionType;
	topicId: string;
}

export interface UnitActionInsertRow extends UnitActionWriteTopic {
	type: WriteTopicActionType.INSERT_ROW;
	// TODO
	mapping: any;
}

export interface UnitActionMergeRow extends UnitActionWriteTopic {
	type: WriteTopicActionType.MERGE_ROW | WriteTopicActionType.INSERT_OR_MERGE_ROW;
	// TODO
	mapping: any;
	unique: any;
}

export interface UnitActionWriteFactor extends UnitActionWriteTopic {
	type: WriteTopicActionType.WRITE_FACTOR;
	topicId: string;
	factorId: string;
	value: AValue;
}

export enum UnitActionAlarmSeverity {
	LOW = 'low',
	MEDIUM = 'medium',
	HIGH = 'high',
	CRITICAL = 'critical'
}

export interface UnitActionAlarm extends UnitAction {
	severity: UnitActionAlarmSeverity;
	message?: string;
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
