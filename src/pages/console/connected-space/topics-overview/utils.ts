import { Graphics, TopicFrame, TopicGraphics, TopicRelationCurvePoints } from './types';

export const findSvgRoot = (element: SVGGraphicsElement): SVGSVGElement => {
	let parent = element.parentElement!;
	while (parent.tagName.toUpperCase() !== 'SVG') {
		parent = parent.parentElement!;
	}
	return parent as unknown as SVGSVGElement;
};

export const TopicWidthMin = 150;
export const TopicHeightMin = 32;
const PaddingVertical = 8;
const FullPaddingVertical = PaddingVertical * 2;
const PaddingHorizontal = 16;
const FullPaddingHorizontal = PaddingHorizontal * 2;
const TitleOffsetY = 6.2;
/** topic frame size */
export const computeTopicFrameSize = (topicNameRect: DOMRect) => {
	return {
		width: Math.max(topicNameRect.width + FullPaddingHorizontal, TopicWidthMin),
		height: topicNameRect.height + FullPaddingVertical
	};
};
/** topic name position relative to topic rect */
export const computeTopicNamePosition = (topicFrame: TopicFrame) => {
	return { x: topicFrame.width / 2, y: topicFrame.height / 2 + TitleOffsetY };
};

const computeTopicFramePoints = (topic: TopicGraphics) => {
	const { rect: { coordinate, frame } } = topic;
	return {
		top: { x: coordinate.x + frame.x + frame.width / 2, y: coordinate.y + frame.y },
		right: { x: coordinate.x + frame.x + frame.width, y: coordinate.y + frame.y + frame.height / 2 },
		bottom: { x: coordinate.x + frame.x + frame.width / 2, y: coordinate.y + frame.y + frame.height },
		left: { x: coordinate.x + frame.x, y: coordinate.y + frame.y + frame.height / 2 }
	};
};

export const findTopicGraphics = (graphics: Graphics, topicId: string): TopicGraphics => {
	// eslint-disable-next-line
	return graphics.topics.find(({ topic }) => topic.topicId == topicId)!;
};
export const computeTopicRelationPoints = (options: {
	graphics: Graphics;
	sourceTopicId: string;
	targetTopicId: string;
}): TopicRelationCurvePoints => {
	const { graphics, sourceTopicId, targetTopicId } = options;

	// to find the start and end point position
	const sourcePoints = computeTopicFramePoints(findTopicGraphics(graphics, sourceTopicId));
	const targetPoints = computeTopicFramePoints(findTopicGraphics(graphics, targetTopicId));

	const [ startX, startY ] = [ sourcePoints.right.x, sourcePoints.right.y ];
	const [ endX, endY ] = [ targetPoints.left.x, targetPoints.right.y ];
	const [ centerX, centerY ] = [ (startX + endX) / 2, (startY + endY) / 2 ];
	const [ firstControlX, firstControlY ] = [ startX + (centerX - startX) / 4, startY + (centerY - startY) / 4 ];
	const [ secondControlX, secondControlY ] = [ startX + (centerX - startX) / 4 * 3, startY + (centerY - startY) / 4 ];
	const [ thirdControlX, thirdControlY ] = [ centerX + (endX - centerX) / 4 * 3, centerY + (endY - centerY) / 4 ];

	return {
		startX, startY,
		firstControlX, firstControlY,
		secondControlX, secondControlY,
		centerX, centerY,
		thirdControlX, thirdControlY,
		endX, endY
	};
};

export const computeTopicSelection = (options: { topicId: string; graphics: Graphics }) => {
	const { graphics, topicId } = options;

	const topicGraphics = findTopicGraphics(graphics, topicId);
	return {
		x: topicGraphics.rect.coordinate.x - 6,
		y: topicGraphics.rect.coordinate.y - 6,
		width: topicGraphics.rect.frame.width + 12,
		height: topicGraphics.rect.frame.height + 12
	};
};