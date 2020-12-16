import React from 'react';
import styled from 'styled-components';
import { useForceUpdate } from '../../../../../common/utils';
import { SomeValue, SomeValueType } from '../../../../../services/admin/pipeline-types';
import { QueriedTopicForPipeline } from '../../../../../services/admin/types';
import { usePipelineContext } from '../../pipeline-context';
import { ArithmeticSelect } from '../unit-actions/arithmetic-select';
import { ActionInput } from './action-input';
import { FactorFinder } from './factor-finder';
import { HorizontalOptions } from './horizontal-options';
import { isFactorValue, isMemoryValue } from './utils';

const Container = styled.div`
	display: flex;
	align-items: center;
	> div:first-child {
		font-variant: petite-caps;
		font-weight: var(--font-demi-bold);
		border-radius: var(--border-radius) 0 0 var(--border-radius);
		&[data-expanded=true] {
			> div:last-child {
				padding-right: calc(var(--margin) / 3);
			}
		}
	}
	> div:nth-child(2) {
		flex-grow: 1;
		border-radius: 0;
		box-shadow: 0 1px 0 0 var(--border-color), 0 -1px 0 0 var(--border-color), 1px 0 0 0 var(--border-color);
		&:hover {
			box-shadow: var(--console-primary-hover-shadow);
		}
		> input {
			border-radius: 0;
		}
	}
	> input {
		flex-grow: 1;
		height: 22px;
		border: 0;
		border-radius: 0;
		box-shadow: 0 1px 0 0 var(--border-color), 0 -1px 0 0 var(--border-color), 1px 0 0 0 var(--border-color);
	}
	> div:last-child {
		border-radius: 0 var(--border-radius) var(--border-radius) 0;
		box-shadow: 0 1px 0 0 var(--border-color), 0 -1px 0 0 var(--border-color), 1px 0 0 0 var(--border-color);
		&:hover {
			box-shadow: var(--console-primary-hover-shadow);
		}
	}
`;

const asDisplayValueType = (type: SomeValueType, source?: QueriedTopicForPipeline): string => {
	switch (type) {
		case SomeValueType.IN_MEMORY:
			return 'Memory Context';
		case SomeValueType.FACTOR:
		default:
			return source ? `Topic: ${source.name}` : 'Source Topic';
	}
};

export const FacterValueFinder = (props: {
	holder: SomeValue;
	onTopicChange: () => void;
	onFactorChange: () => void;
	onVariableChange: () => void;
	onArithmeticChange: () => void;
}) => {
	const { holder: value, onTopicChange, onFactorChange, onVariableChange, onArithmeticChange } = props;
	const { type: valueType = SomeValueType.FACTOR } = value;

	const { store: { selectedPipeline, topics } } = usePipelineContext();
	const forceUpdate = useForceUpdate();

	const { topicId: sourceTopicId } = selectedPipeline!;
	// eslint-disable-next-line
	const sourceTopic = topics.find(topic => topic.topicId == sourceTopicId);
	if (isFactorValue(value) && !value.topicId) {
		value.topicId = sourceTopicId;
	}

	const onValueTypeChanged = (valueType: SomeValueType) => {
		value.type = valueType;
		if (isFactorValue(value)) {
			value.topicId = sourceTopicId;
			onTopicChange();
		}
		forceUpdate();
	};
	const onInMemoryVariableNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
		const name = event.target.value;
		if (isMemoryValue(value)) {
			value.name = name;
			onVariableChange();
		}
		forceUpdate();
	};

	return <Container>
		<HorizontalOptions label={asDisplayValueType(valueType, sourceTopic)}
		                   options={Object.values(SomeValueType).filter(candidate => candidate !== valueType)}
		                   toLabel={(valueType) => asDisplayValueType(valueType, sourceTopic)}
		                   onSelect={onValueTypeChanged}/>
		{
			isFactorValue(value)
				? <FactorFinder holder={value} onChange={onFactorChange}/>
				: null
		}
		{
			isMemoryValue(value)
				? <ActionInput value={value.name} onChange={onInMemoryVariableNameChanged}
				               placeholder='Variable name...'/>
				: null
		}
		{
			isFactorValue(value) || isMemoryValue(value)
				? <ArithmeticSelect value={value} right={true} onChange={onArithmeticChange}/>
				: null
		}
	</Container>;
};