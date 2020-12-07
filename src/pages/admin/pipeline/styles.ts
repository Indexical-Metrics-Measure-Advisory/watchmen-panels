import { TopicType } from '../../../services/admin/types';

const TopicTypeStyles: { [key in TopicType]: string } = {
	[TopicType.RAW]: '--console-raw-topic-color',
	[TopicType.DISTINCT]: '--console-distinct-topic-color',
	[TopicType.AGGREGATE]: '--console-aggregate-topic-color',
	[TopicType.TIME]: '--console-time-topic-color',
	[TopicType.RATIO]: '--console-ratio-topic-color',
	[TopicType.NOT_DEFINED]: '--console-undefined-topic-color'
};

export const buildPipelineCanvasTopicStyles = () => {
	return Object.keys(TopicTypeStyles).map(topicType => {
		const type = topicType as TopicType;
		return `&[data-topic-type=${type}] {
			border-color: var(${TopicTypeStyles[type]});
			> div[data-widget-type='corner'] {
				background-color: var(${TopicTypeStyles[type]});
			}
		}`;
	}).join('\n');
};

// export const buildEditorTitleStyles = () => {
// 	return Object.keys(TopicTypeStyles).map(topicType => {
// 		const type = topicType as TopicType;
// 		return `&[data-topic-type=${type}] {
// 			border-bottom-color: var(${TopicTypeStyles[type]});
// 		}`;
// 	}).join('\n');
// };
// export const buildEditorTitleStylesForIO = () => {
// 	return Object.keys(TopicTypeStyles).map(topicType => {
// 		const type = topicType as TopicType;
// 		return `&[data-topic-type=${type}] > span {
// 			background-color: var(${TopicTypeStyles[type]});
// 		}`;
// 	}).join('\n');
// };