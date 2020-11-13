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

	let drawn = `M${sourcePoints.top.x},${(sourcePoints.top.y + sourcePoints.bottom.y) / 2} L${targetPoints.top.x},${(targetPoints.top.y + targetPoints.bottom.y) / 2}`;
	// noinspection DuplicatedCode
	switch (true) {
		case targetPoints.left.x - sourcePoints.right.x <= 200 && targetPoints.left.x - sourcePoints.right.x >= 0:
			// target on right of source, no overlap, small distance
			switch (true) {
				case  sourcePoints.bottom.y <= targetPoints.top.y:
					// target on bottom right, no overlap
					drawn = `M${sourcePoints.bottom.x},${sourcePoints.bottom.y} Q${sourcePoints.bottom.x},${targetPoints.left.y} ${targetPoints.left.x},${targetPoints.left.y}`;
					break;
				case sourcePoints.top.y >= targetPoints.bottom.y:
					// target on bottom top, no overlap
					drawn = `M${sourcePoints.top.x},${sourcePoints.top.y} Q${sourcePoints.top.x},${targetPoints.left.y} ${targetPoints.left.x},${targetPoints.left.y}`;
					break;
				default:
				// vertical has overlap
			}
			break;
		case targetPoints.left.x - sourcePoints.right.x > 200:
			// target on right of source, no overlap, large distance
			switch (true) {
				case sourcePoints.bottom.y <= targetPoints.top.y:
				case sourcePoints.top.y >= targetPoints.bottom.y:
					// target on bottom/top right, no overlap
					drawn = [
						`M${sourcePoints.right.x},${sourcePoints.right.y}`,
						`C${sourcePoints.right.x + (targetPoints.left.x - sourcePoints.right.x) / 6},${sourcePoints.right.y}`,
						`${sourcePoints.right.x + (targetPoints.left.x - sourcePoints.right.x) / 3},${sourcePoints.right.y}`,
						`${sourcePoints.right.x + (targetPoints.left.x - sourcePoints.right.x) / 2},${(sourcePoints.right.y + targetPoints.left.y) / 2}`,
						`C${sourcePoints.right.x + (targetPoints.left.x - sourcePoints.right.x) / 3 * 2},${targetPoints.left.y}`,
						`${sourcePoints.right.x + (targetPoints.left.x - sourcePoints.right.x) / 6 * 5},${targetPoints.left.y}`,
						`${targetPoints.left.x},${targetPoints.left.y}`
					].join(' ');
					break;
				default:
					// vertical has overlap
					drawn = `M${sourcePoints.right.x},${sourcePoints.right.y} L${targetPoints.left.x},${targetPoints.left.y}`;
			}
			break;
		case sourcePoints.left.x - targetPoints.right.x <= 200 && sourcePoints.left.x - targetPoints.right.x >= 0:
			// target on left of source, no overlap, small distance
			switch (true) {
				case  sourcePoints.bottom.y <= targetPoints.top.y:
					// target on bottom left, no overlap
					drawn = `M${sourcePoints.bottom.x},${sourcePoints.bottom.y} Q${sourcePoints.bottom.x},${targetPoints.right.y} ${targetPoints.right.x},${targetPoints.right.y}`;
					break;
				case sourcePoints.top.y >= targetPoints.bottom.y:
					// target on bottom top, no overlap
					drawn = `M${sourcePoints.top.x},${sourcePoints.top.y} Q${sourcePoints.top.x},${targetPoints.right.y} ${targetPoints.right.x},${targetPoints.right.y}`;
					break;
				default:
				// vertical has overlap
			}
			break;
		case sourcePoints.left.x - targetPoints.right.x > 200:
			// target on left of source, no overlap, large distance
			switch (true) {
				case sourcePoints.bottom.y <= targetPoints.top.y:
				case sourcePoints.top.y >= targetPoints.bottom.y:
					// target on bottom/top right, no overlap
					drawn = [
						`M${sourcePoints.left.x},${sourcePoints.left.y}`,
						`C${targetPoints.right.x + (sourcePoints.left.x - targetPoints.right.x) / 6 * 5},${sourcePoints.left.y}`,
						`${targetPoints.right.x + (sourcePoints.left.x - targetPoints.right.x) / 3 * 2},${sourcePoints.left.y}`,
						`${targetPoints.right.x + (sourcePoints.left.x - targetPoints.right.x) / 2},${(sourcePoints.left.y + targetPoints.right.y) / 2}`,
						`C${targetPoints.right.x + (sourcePoints.left.x - targetPoints.right.x) / 3},${targetPoints.right.y}`,
						`${targetPoints.right.x + (sourcePoints.left.x - targetPoints.right.x) / 6},${targetPoints.right.y}`,
						`${targetPoints.right.x},${targetPoints.right.y}`
					].join(' ');
					break;
				default:
					// vertical has overlap
					drawn = `M${sourcePoints.left.x},${sourcePoints.left.y} L${targetPoints.right.x},${targetPoints.right.y}`;
			}
			break;
	}
	// console.log(drawn);
	return { drawn };
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