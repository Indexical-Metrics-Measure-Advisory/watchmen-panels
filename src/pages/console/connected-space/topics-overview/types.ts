import { ConsoleTopic, ConsoleTopicRelationship } from '../../../../services/console/types';

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

export interface GraphicsTopicRelation {
	relation: ConsoleTopicRelationship;
	points: TopicRelationCurvePoints
}

export interface GraphicsTopic {
	topic: ConsoleTopic;
	rect: {
		coordinate: TopicCoordinate;
		frame: TopicFrame;
		name: TopicName
	}
}

export interface Graphics {
	topics: Array<GraphicsTopic>;
	topicRelations: Array<GraphicsTopicRelation>;
}
