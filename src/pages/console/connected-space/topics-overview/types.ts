import { ConsoleTopic, ConsoleTopicRelationship } from '../../../../services/console/types';

export enum GraphicsRole {
	TOPIC = 'topic',
	TOPIC_FRAME = 'topic-frame',
	TOPIC_NAME = 'topic-name',
	TOPIC_RELATION = 'topic-relation',
	TOPIC_RELATION_LINK = 'topic-relation-link',
	TOPIC_SELECTION = 'topic-selection',
}

export interface GraphicsPosition {
	x: number;
	y: number;
}

export interface GraphicsSize {
	width: number;
	height: number;
}

export interface TopicCoordinate extends GraphicsPosition {
}

export interface TopicFrame extends GraphicsPosition, GraphicsSize {
}

export interface TopicName extends GraphicsPosition {
}

export interface TopicRelationCurvePoints {
	startX: number;
	startY: number;
	firstControlX: number;
	firstControlY: number;
	secondControlX: number;
	secondControlY: number;
	centerX: number;
	centerY: number;
	thirdControlX: number;
	thirdControlY: number;
	endX: number;
	endY: number;
}

export interface TopicRelationGraphics {
	relation: ConsoleTopicRelationship;
	points: TopicRelationCurvePoints
}

export interface TopicGraphics {
	topic: ConsoleTopic;
	rect: {
		coordinate: TopicCoordinate;
		frame: TopicFrame;
		name: TopicName
	}
}

export interface TopicSelectionGraphics {
	visible: boolean;
	topicId?: string;
	rect: GraphicsPosition & GraphicsSize;
}

export interface Graphics {
	topics: Array<TopicGraphics>;
	topicRelations: Array<TopicRelationGraphics>;
	topicSelection: TopicSelectionGraphics
}
