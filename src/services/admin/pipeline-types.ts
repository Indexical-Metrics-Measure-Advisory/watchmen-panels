export interface TopicHolder {
	topicId?: string;
}

export interface FactorHolder extends TopicHolder {
	factorId?: string;
}

export interface FactorValueHolder {
	value: SomeValue;
}

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

// value used in unit actions
export enum DatePartArithmetic {
	YEAR_OF = 'year-of',
	MONTH_OF = 'month-of',
	WEEK_OF = 'week-of',
	WEEKDAY = 'weekday'
}

export enum NumericArithmetic {
	PERCENTAGE = 'percentage',
	ABSOLUTE_VALUE = 'abs',
	LOGARITHM = 'log',
}

export type SimpleFuncArithmetic = DatePartArithmetic | NumericArithmetic;

export enum SomeValueType {
	IN_MEMORY = 'in-memory',
	FACTOR = 'factor'
}

export interface SomeValue {
	type?: SomeValueType;
}

export interface SimpleFuncValue extends SomeValue {
	arithmetic: SimpleFuncArithmetic
}

export interface InMemoryValue extends SimpleFuncValue {
	type: SomeValueType.IN_MEMORY;
	name: string;
}

export interface FactorValue extends TopicHolder, FactorHolder, SimpleFuncValue {
	type: SomeValueType.FACTOR;
}

// unit actions
export enum SystemActionType {
	ALARM = 'alarm',
	COPY_TO_MEMORY = 'copy-to-memory'
}

export enum ReadTopicActionType {
	READ_ROW = 'read-row',
	READ_FACTOR = 'read-factor',
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

export interface MemoryWriter extends UnitAction {
	targetName: string;
}

export interface UnitActionWriteTopic extends TopicHolder, UnitAction {
	type: WriteTopicActionType;
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
	by: any;
}

export interface UnitActionWriteFactor extends FactorHolder, FactorValueHolder, UnitActionWriteTopic {
	type: WriteTopicActionType.WRITE_FACTOR;
}

export interface UnitActionReadRow extends TopicHolder, MemoryWriter {
	type: ReadTopicActionType.READ_ROW;
	by: any;
}

export interface UnitActionReadFactor extends TopicHolder, FactorHolder, MemoryWriter {
	type: ReadTopicActionType.READ_FACTOR;
	by: any;
}

export interface UnitActionExists extends TopicHolder, MemoryWriter {
	type: ReadTopicActionType.EXISTS;
	by: any;
}

export enum UnitActionAlarmSeverity {
	LOW = 'low',
	MEDIUM = 'medium',
	HIGH = 'high',
	CRITICAL = 'critical'
}

export interface UnitActionAlarm extends UnitAction {
	type: SystemActionType.ALARM;
	severity: UnitActionAlarmSeverity;
	message?: string;
}

export interface UnitActionCopyToMemory extends FactorValueHolder, MemoryWriter {
	type: SystemActionType.COPY_TO_MEMORY;
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
