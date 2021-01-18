export interface ConsoleMessage {
	id: string;
	subject: string;
	body: string;
	image?: string;
	sender: string;
	createDate: string;
}

export enum ConsoleNotificationCategory {
	CHART_TYPE_PUSHED = "CHART_TYPE_PUSHED",

	SPACE_PUSHED = "SPACE_PUSHED",
	TOPIC_PUSHED = "TOPIC_PUSHED",
	FACTOR_PUSHED = "FACTOR_PUSHED",

	REPORT_PUSHED = "REPORT_PUSHED",

	GROUP_JOINED = "GROUP_JOINED",
	GROUP_LEFT = "GROUP_LEFT",

	SPACE_JOINED = "SPACE_JOINED",
	SPACE_LEFT = "SPACE_LEFT",

	SUBSCRIBE_REPORT_CHANGED = "SUBSCRIBE_REPORT_CHANGED",
	SUBSCRIBE_REPORT_DELETED = "SUBSCRIBE_REPORT_DELETED",
}

export interface ConsoleNotification extends ConsoleMessage {
	category: ConsoleNotificationCategory;
}

export type ConsoleNotifications = Array<ConsoleNotification>;

export interface ConsoleMail extends ConsoleMessage {}

export type ConsoleMails = Array<ConsoleMail>;

export enum ConsoleTopicFactorType {
	SEQUENCE = "sequence",
	NUMBER = "number",
	TEXT = "text",
	DATETIME = "datetime",
	BOOLEAN = "boolean",
	ENUM = "enum",
}

export interface ConsoleTopicFactor {
	factorId: string;
	name: string;
	label: string;
	type: ConsoleTopicFactorType;
	enum?: string;
}

export interface ConsoleTopic {
	topicId: string;
	code: string;
	name: string;
	factors: Array<ConsoleTopicFactor>;
}

export enum ConsoleTopicRelationshipType {
	ONE_2_ONE = "one-2-one",
	ONE_2_MANY = "one-2-many",
	MANY_2_ONE = "many-2-one",
}

export interface ConsoleTopicRelationship {
	relationId: string;
	sourceTopicId: string;
	sourceFactorNames: Array<string>;
	targetTopicId: string;
	targetFactorNames: Array<string>;
	type: ConsoleTopicRelationshipType;
	/** target must have data on source has data when strict is true */
	strictToTarget: boolean;
	/** source must have data on target has data when strict is true */
	strictToSource: boolean;
}

export enum ConsoleSpaceType {
	/** public for all authorized users */
	PUBLIC = "public",
	/** create by user himself/herself, base on one public space */
	PRIVATE = "private",
}

export interface ConsoleSpace {
	spaceId: string;
	name: string;
	topics: Array<ConsoleTopic>;
	topicRelations?: Array<ConsoleTopicRelationship>;
}

export interface ConsoleSpaceSubjectDataSetFilter {}

export enum FilterJointType {
	AND = "and",
	OR = "or",
}

export interface ConsoleSpaceSubjectDataSetFilterJoint extends ConsoleSpaceSubjectDataSetFilter {
	jointType: FilterJointType;
	filters: Array<ConsoleSpaceSubjectDataSetFilter>;
}

export enum FilterExpressionOperator {
	EQUALS = "equals",
	NOT_EQUALS = "not-equals",
	LESS = "less",
	LESS_EQUALS = "less-equals",
	MORE = "more",
	MORE_EQUALS = "more-equals",
	IN = "in",
	NOT_IN = "not-in",
	// for date time
	YEAR_OF = "year-of",
	HALF_YEAR_OF = "half-year-of",
	QUARTER_OF = "quarter-of",
	MONTH_OF = "month-of",
	WEEK_OF_YEAR = "week-of-year",
	WEEK_OF_MONTH = "week-of-month",
	WEEKDAYS = "weekdays",
	TILL_NOW = "till-now",
}

export interface ConsoleSpaceSubjectDataSetFilterExpression extends ConsoleSpaceSubjectDataSetFilter {
	topicId?: string;
	factorId?: string;
	operator?: FilterExpressionOperator;
	value?: string;
}

export interface ConsoleSpaceSubjectDataSetColumn {
	topicId?: string;
	factorId?: string;
}

export interface ConsoleSpaceSubjectDataSetJoin {
	relationId?: string;
}

export enum ConsoleSpaceSubjectChartType {
	COUNT = "count",
	BAR = "bar",
	LINE = "line",
	SCATTER = "scatter",
	PIE = "pie",
	DOUGHNUT = "doughnut",
	NIGHTINGALE = "nightingale",
	SUNBURST = "sunburst",
	TREE = "tree",
	TREEMAP = "treemap",
}

export enum ConsoleSpaceSubjectChartIndicatorAggregator {
	NONE = "none",
	COUNT = "count",
	SUMMARY = "sum",
	AVERAGE = "avg",
	MEDIAN = "med",
	MAXIMUM = "max",
	MINIMUM = "min",
}

export interface ConsoleSpaceSubjectChartIndicator extends ConsoleSpaceSubjectDataSetColumn {
	aggregator: ConsoleSpaceSubjectChartIndicatorAggregator;
}

export interface ConsoleSpaceSubjectChartDimension extends ConsoleSpaceSubjectDataSetColumn {}

export type ConsoleSpaceSubjectChartDataSetRow = Array<any>;
export type ConsoleSpaceSubjectChartDataSetGrid = Array<ConsoleSpaceSubjectChartDataSetRow>;

export interface ConsoleSpaceSubjectChartDataSetColumn {
	topicId: string;
	factorId: string;
}

export interface ConsoleSpaceSubjectChartDataSet {
	meta?: Array<ConsoleSpaceSubjectChartDataSetColumn>;
	data: ConsoleSpaceSubjectChartDataSetGrid;
}

export interface ConsoleSpaceSubjectChart {
	chartId?: string;
	name?: string;
	type?: ConsoleSpaceSubjectChartType;
	indicators: Array<ConsoleSpaceSubjectChartIndicator>;
	dimensions: Array<ConsoleSpaceSubjectChartDimension>;
	// for subject chart view
	rect?: {
		top: number;
		left: number;
		width: number;
		height: number;
	};
	predefined?: boolean;
	colors?: string | Array<string>;
}

export interface ConsoleSpaceSubject {
	subjectId: string;
	name: string;
	topicCount: number;
	graphicsCount: number;
	lastVisitTime: string;
	createdAt: string;
	dataset?: {
		filters?: Array<ConsoleSpaceSubjectDataSetFilter>;
		columns?: Array<ConsoleSpaceSubjectDataSetColumn>;
		joins?: Array<ConsoleSpaceSubjectDataSetJoin>;
	};
	graphics?: Array<ConsoleSpaceSubjectChart>;
}

export interface ConsoleSpaceGroup {
	groupId: string;
	name: string;
	subjects: Array<ConsoleSpaceSubject>;
}

export interface ConnectedConsoleSpace extends ConsoleSpace {
	connectId: string;
	type: ConsoleSpaceType;
	lastVisitTime: string;
	groups: Array<ConsoleSpaceGroup>;
	subjects: Array<ConsoleSpaceSubject>;
}

export interface ConsoleDashboard {
	dashboardId: string;
	name: string;
	lastVisitTime: string;
	current?: boolean;
}

export enum ConsoleFavoriteType {
	SPACE = "space",
	DASHBOARD = "dashboard",
}

export interface ConsoleFavorite {
	type: ConsoleFavoriteType;
}

export interface ConsoleFavoriteSpace extends ConsoleFavorite {
	type: ConsoleFavoriteType.SPACE;
	connectId: string;
}

export interface ConsoleFavoriteDashboard extends ConsoleFavorite {
	type: ConsoleFavoriteType.DASHBOARD;
	dashboardId: string;
}
