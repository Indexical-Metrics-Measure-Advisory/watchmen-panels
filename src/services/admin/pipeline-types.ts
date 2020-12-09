export interface TopicHolder {
	topicId?: string;
}

export interface FactorHolder extends TopicHolder {
	factorId?: string;
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

export enum FactorValueLikesType {
	IN_MEMORY = 'in-memory',
	FACTOR = 'factor'
}

export interface FactorValueLikes {
	type?: FactorValueLikesType;
}

export interface SimpleFuncFactorValue extends FactorValueLikes {
	arithmetic: SimpleFuncArithmetic
}

export interface InMemoryValue extends SimpleFuncFactorValue {
	type: FactorValueLikesType.IN_MEMORY;
	name: string;
}

export interface FactorValue extends TopicHolder, FactorHolder, SimpleFuncFactorValue {
	type: FactorValueLikesType.FACTOR;
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
	unique: any;
}

export interface UnitActionWriteFactor extends FactorHolder, UnitActionWriteTopic {
	type: WriteTopicActionType.WRITE_FACTOR;
	value: FactorValueLikes;
}

export interface UnitActionFindRow extends TopicHolder, UnitAction {
	type: ReadTopicActionType.FIND_ROW;
}

export interface UnitActionExists extends TopicHolder, UnitAction {
	type: ReadTopicActionType.EXISTS;
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
