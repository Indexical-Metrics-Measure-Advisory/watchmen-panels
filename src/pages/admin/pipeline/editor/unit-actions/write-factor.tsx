import React, { Fragment, useReducer } from 'react';
import {
	FactorHolder,
	FactorValue,
	FactorValueLikesType,
	UnitAction,
	UnitActionWriteFactor
} from '../../../../../services/admin/pipeline-types';
import { QueriedTopicForPipeline } from '../../../../../services/admin/types';
import { usePipelineContext } from '../../pipeline-context';
import { FactorFinder } from '../components/factor-finder';
import { HorizontalOptions } from '../components/horizontal-options';
import { TopicFinder } from '../components/topic-finder';
import { ActionBody2Columns, ActionBodyItemLabel } from './action-body';

const asDisplayValueType = (type: FactorValueLikesType, source?: QueriedTopicForPipeline): string => {
	switch (type) {
		case FactorValueLikesType.IN_MEMORY:
			return 'Memory Context';
		case FactorValueLikesType.FACTOR:
		default:
			return source ? source.name : 'Source Topic';
	}
};

export const WriteFactor = (props: { action: UnitAction }) => {
	const { action } = props;
	const write = action as UnitActionWriteFactor;
	const { value } = write;
	const { type: valueType = FactorValueLikesType.FACTOR } = value;

	const { store: { selectedPipeline, topics } } = usePipelineContext();
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);

	const { topicId: sourceTopicId } = selectedPipeline!;
	const sourceTopic = topics.find(topic => topic.topicId == sourceTopicId);

	const onValueTypeChanged = (valueType: FactorValueLikesType) => {
		value.type = valueType;
		if (value.type === FactorValueLikesType.FACTOR) {
			(value as FactorValue).topicId = sourceTopicId;
		}
		forceUpdate();
	};

	return <ActionBody2Columns>
		<ActionBodyItemLabel>Value From:</ActionBodyItemLabel>
		<HorizontalOptions label={asDisplayValueType(valueType, sourceTopic)}
		                   options={Object.values(FactorValueLikesType).filter(candidate => candidate !== valueType)}
		                   toLabel={(valueType) => asDisplayValueType(valueType, sourceTopic)}
		                   onSelect={onValueTypeChanged}/>
		{
			valueType === FactorValueLikesType.FACTOR
				? <Fragment>
					<ActionBodyItemLabel>Source Factor:</ActionBodyItemLabel>
					<FactorFinder holder={value as FactorHolder}/>
				</Fragment>
				: null
		}
		<ActionBodyItemLabel>Target Topic:</ActionBodyItemLabel>
		<TopicFinder holder={write}/>
		<ActionBodyItemLabel>Target Factor:</ActionBodyItemLabel>
		<FactorFinder holder={write}/>
	</ActionBody2Columns>;
};