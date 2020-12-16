import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import {
	faCompressAlt,
	faCompressArrowsAlt,
	faExpandAlt,
	faExpandArrowsAlt,
	faPlus
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useForceUpdate } from '../../../../../common/utils';
import {
	FactorValue,
	MappingFactor,
	MappingRow,
	NoArithmetic,
	SomeValueType,
	TopicHolder
} from '../../../../../services/admin/pipeline-types';
import { QueriedTopicForPipeline } from '../../../../../services/admin/types';
import { usePipelineContext } from '../../pipeline-context';
import { isFactorValue, isMemoryValue } from '../components/utils';
import { PipelineUnitActionEvent, usePipelineUnitActionContext } from '../pipeline-unit-action-context';
import { asDisplayArithmetic } from '../utils';

const Container = styled.div`
	display: flex;
	flex-direction: column;
`;
const ToggleLine = styled.div`
	display: flex;
	align-items: center;
	height: 32px;
`;
const ToggleButton = styled.div`
	display: flex;
	align-items: center;
	justify-self: start;
	height: 22px;
	border-radius: 11px;
	background-color: var(--pipeline-bg-color);
	cursor: pointer;
	box-shadow: 0 0 0 1px var(--border-color);
	transition: all 300ms ease-in-out;
	&:hover {
		box-shadow: var(--console-primary-hover-shadow);
	}
	&[data-expanded=true] > svg {
		transform: rotateZ(180deg);
	}
	> span {
		padding-left: calc(var(--margin) / 2);
		font-variant: petite-caps;
		font-weight: var(--font-demi-bold);
	}
	> svg:nth-child(2) {
		font-size: 0.9em;
		margin: 0 calc(var(--margin) / 3);
		transition: all 300ms ease-in-out;
	}
`;
const Body = styled.div.attrs<{ lines: number, expanded: boolean }>(
	({ lines, expanded }) => {
		return {
			style: {
				maxHeight: expanded ? Math.min((lines + 1) * 32, 352) : 0,
				transform: expanded ? 'none' : 'rotateX(90deg)'
			}
		};
	})<{ lines: number, expanded: boolean }>`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	transform-origin: top;
	transition: all 300ms ease-in-out;
`;
const MappingRuleContent = styled.div`
	display: grid;
	position: relative;
	grid-template-columns: 32px calc(100% - 32px);
	grid-auto-rows: 32px;
	flex-grow: 1;
	&::-webkit-scrollbar {
		background-color: transparent;
		width: 4px;
	}
	&::-webkit-scrollbar-track {
		background-color: transparent;
		border-radius: 2px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: var(--console-favorite-color);
		border-radius: 2px;
	}
	> div:nth-child(2n + 1) {
		position: relative;
		height: 32px;
		&:before, &:after {
			content: '';
			display: block;
			position: absolute;
			left: calc(var(--margin) / 2);
			background-color: var(--border-color);
		}
		&:before {
			top: 0;
			width: 1px;
			height: 100%;
		}
		&:after {
			top: calc(var(--margin) / 2);
			width: 10px;
			height: 1px;
		}
	}
`;
const MappingRule = styled.div`
	display: flex;
	position: relative;
	align-self: center;
	justify-self: stretch;
	border-radius: 12px;
	background-color: transparent;
	height: 22px;
	line-height: 22px;
	outline: none;
	appearance: none;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	cursor: pointer;
	transition: all 300ms ease-in-out;
	&[data-expanded=true],
	&:hover {
		background-color: var(--pipeline-bg-color);
		box-shadow: var(--console-primary-hover-shadow);
		> div:first-child {
			padding-left: calc(var(--margin) / 2);
		}
		> div:not(:first-child) {
			opacity: 1;
			pointer-events: auto;
		}
	}
	&[data-expanded=true] > div:nth-child(2) > svg {
		transform: rotateZ(180deg);
	}
	> div:first-child {
		flex-grow: 1;
		position: relative;
		font-weight: var(--font-bold);
		font-variant: petite-caps;
		border-top-left-radius: 12px;
		border-bottom-left-radius: 12px;
		transition: all 300ms ease-in-out;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	> div:not(:first-child) {
		position: relative;
		padding: 0 calc(var(--margin) / 3);
		opacity: 0;
		pointer-events: none;
		transition: all 300ms ease-in-out;
		> svg {
			font-size: 0.8em;
			transition: all 300ms ease-in-out;
		}
		&:not(:nth-child(2)):before {
			content: '';
			display: block;
			position: absolute;
			left: 0;
			top: 20%;
			width: 1px;
			height: 60%;
			background-color: var(--border-color);
		}
	}
`;
const AddButton = styled.div`
	display: flex;
	position: relative;
	align-items: center;
	align-self: flex-start;
	height: 22px;
	font-variant: petite-caps;
	font-weight: var(--font-demi-bold);
	padding: 0 calc(var(--margin) / 2);
	margin: 5px 0 5px 32px;
	background-color: var(--pipeline-bg-color);
	border-radius: 11px;
	box-shadow: 0 0 0 1px var(--border-color);
	cursor: pointer;
	transition: all 300ms ease-in-out;
	&:hover {
		box-shadow: var(--console-primary-hover-shadow);
	}
	&:before, &:after {
		content: '';
		display: block;
		position: absolute;
		left: calc(var(--margin) / -2);
		background-color: var(--border-color);
	}
	&:before {
		top: -5px;
		width: 1px;
		height: calc(50% + 5px);
	}
	&:after {
		top: calc(var(--margin) / 2 - 5px);
		width: 10px;
		height: 1px;
	}
	> svg {
		font-size: 0.8em;
		margin-left: calc(var(--margin) / 3);
	}
`;

const buildFactorValueLabel = (value: FactorValue, topics: Array<QueriedTopicForPipeline>): string => {
	let label = '';
	const topicId = value.topicId;
	// eslint-disable-next-line
	const topic = topicId ? topics.find(topic => topic.topicId == topicId) : null;
	if (topic) {
		label += `${topic.name}.`;
		const factorId = value.factorId;
		// eslint-disable-next-line
		const factor = factorId ? topic.factors.find(factor => factor.factorId == factorId) : null;
		if (factor) {
			label += factor.label;
		} else {
			label += '?';
		}
	} else {
		label += '?.?';
	}
	return label;
};
const buildLabel = (options: {
	mapping: MappingFactor;
	topics: Array<QueriedTopicForPipeline>;
}) => {
	const { mapping, topics } = options;

	let left = '';
	if (isFactorValue(mapping.from)) {
		left = buildFactorValueLabel(mapping.from, topics);
	} else if (isMemoryValue(mapping.from)) {
		left = `Memory Context.${mapping.from.name || '?'}`;
	}
	const arithmetic = asDisplayArithmetic(mapping.from.arithmetic);
	if (arithmetic) {
		left = `${arithmetic}(${left})`;
	}

	let right = '';
	if (isFactorValue(mapping.to)) {
		right = buildFactorValueLabel(mapping.to, topics);
	} else {
		right += `?.?`;
	}

	return `${left} ➾ ${right}`;
};

const FilterLabel = (props: { topic?: QueriedTopicForPipeline, count: number }) => {
	const { topic, count } = props;

	if (topic) {
		if (count === 0) {
			return <span>No Mapping Defined</span>;
		} else if (count === 1) {
			return <span>1 Mapping Rule</span>;
		} else {
			return <span>{count} Mapping Rules</span>;
		}
	} else {
		return <span>Pick Topic First</span>;
	}
};

const Statement = (props: {
	mapping: MappingFactor
}) => {
	const { mapping } = props;

	const { store: { topics } } = usePipelineContext();
	// const { addPropertyChangeListener, removePropertyChangeListener } = usePipelineUnitActionContext();
	// const forceUpdate = useForceUpdate();
	// useEffect(() => {
	// 	addPropertyChangeListener(PipelineUnitActionEvent.FILTER_CHANGED, forceUpdate);
	// 	return () => removePropertyChangeListener(PipelineUnitActionEvent.FILTER_CHANGED, forceUpdate);
	// });

	return <div>{buildLabel({ mapping, topics })}</div>;
};

export const TopicMapper = (props: {
	holder: TopicHolder & MappingRow
}) => {
	const { holder } = props;

	const { store: { topics, selectedPipeline } } = usePipelineContext();
	const { addPropertyChangeListener, removePropertyChangeListener } = usePipelineUnitActionContext();
	const [ expanded, setExpanded ] = useState(false);
	const forceUpdate = useForceUpdate();
	useEffect(() => {
		addPropertyChangeListener(PipelineUnitActionEvent.TOPIC_CHANGED, forceUpdate);
		return () => {
			removePropertyChangeListener(PipelineUnitActionEvent.TOPIC_CHANGED, forceUpdate);
		};
	});

	// eslint-disable-next-line
	const topic = topics.find(topic => topic.topicId == holder.topicId);

	const onToggleFilterSettingsClicked = () => {
		if (topic) {
			setExpanded(!expanded);
		}
	};
	const onAppendMappingRuleClicked = () => {
		if (!holder.mapping) {
			holder.mapping = [];
		}
		holder.mapping.push({
			from: {
				type: SomeValueType.FACTOR,
				topicId: selectedPipeline?.topicId,
				arithmetic: NoArithmetic.NO_FUNC
			} as FactorValue,
			to: { type: SomeValueType.FACTOR, topicId: topic?.topicId, arithmetic: NoArithmetic.NO_FUNC } as FactorValue
		});
		forceUpdate();
	};
	const onRemoveMappingRuleClicked = () => {
	};

	if (!holder.mapping) {
		holder.mapping = [];
	}

	const ruleCount = holder.mapping.length;

	return <Container>
		<ToggleLine>
			<ToggleButton data-expanded={expanded} onClick={onToggleFilterSettingsClicked}>
				<FilterLabel topic={topic} count={ruleCount}/>
				<FontAwesomeIcon icon={expanded ? faCompressArrowsAlt : faExpandArrowsAlt}/>
			</ToggleButton>
		</ToggleLine>
		{topic
			? <Body lines={ruleCount} expanded={expanded}>
				<MappingRuleContent>
					{(holder.mapping || []).map((rule, index) => {
						return <Fragment key={index}>
							<div/>
							<MappingRule>
								<Statement mapping={rule}/>
								<div><FontAwesomeIcon icon={expanded ? faCompressAlt : faExpandAlt}/></div>
								<div onClick={onRemoveMappingRuleClicked}><FontAwesomeIcon icon={faTrashAlt}/></div>
							</MappingRule>
						</Fragment>;
					})}
				</MappingRuleContent>
				<AddButton onClick={onAppendMappingRuleClicked}>
					<span>Append Mapping Rule</span>
					<FontAwesomeIcon icon={faPlus}/>
				</AddButton>
			</Body>
			: null}
	</Container>;
};