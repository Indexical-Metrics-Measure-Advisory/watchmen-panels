import React, { useReducer } from 'react';
import styled from 'styled-components';
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

const Container = styled(ActionBody2Columns)`
	> div:nth-child(2),
	> div:nth-child(4) {
		display: flex;
		align-items: center;
		> div:not(:first-child) {
			margin-left: calc(var(--margin) / 2);
		}
	}
	> div:nth-child(2) > div:nth-child(2) {
		flex-grow: 1;
	}
	> div:nth-child(4) > div {
		width: calc(50% - var(--margin) / 4);
	}
`;

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
	// eslint-disable-next-line
	const sourceTopic = topics.find(topic => topic.topicId == sourceTopicId);

	const onValueTypeChanged = (valueType: FactorValueLikesType) => {
		value.type = valueType;
		if (value.type === FactorValueLikesType.FACTOR) {
			(value as FactorValue).topicId = sourceTopicId;
		}
		forceUpdate();
	};

	return <Container>
		<ActionBodyItemLabel>From:</ActionBodyItemLabel>
		<div>
			<HorizontalOptions label={asDisplayValueType(valueType, sourceTopic)}
			                   options={Object.values(FactorValueLikesType).filter(candidate => candidate !== valueType)}
			                   toLabel={(valueType) => asDisplayValueType(valueType, sourceTopic)}
			                   onSelect={onValueTypeChanged}/>
			{
				valueType === FactorValueLikesType.FACTOR
					? <FactorFinder holder={value as FactorHolder}/>
					: null
			}
		</div>
		<ActionBodyItemLabel>To:</ActionBodyItemLabel>
		<div>
			<TopicFinder holder={write}/>
			<FactorFinder holder={write}/>
		</div>
	</Container>;
};