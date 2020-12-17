import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import {
	faCompressAlt,
	faCompressArrowsAlt,
	faExpandAlt,
	faExpandArrowsAlt,
	faPlus,
	faSortAlphaDown,
	faSortAlphaUp
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useCollapseFixedThing, useForceUpdate } from '../../../../../common/utils';
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
import { FacterValueFinder } from '../components/facter-value-finder';
import { FactorFinder } from '../components/factor-finder';
import { isFactorValue, isMemoryValue } from '../components/utils';
import { PipelineUnitActionEvent, usePipelineUnitActionContext } from '../pipeline-unit-action-context';
import {
	PipelineUnitActionMappingContextProvider,
	PipelineUnitActionMappingEvent,
	usePipelineUnitActionMappingContext
} from '../pipeline-unit-action-mapping-context';
import { asDisplayArithmetic } from '../utils';

interface DropdownRect {
	top: number;
	left: number;
	width: number;
	atTop: boolean;
}

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
	cursor: pointer;
	transition: all 300ms ease-in-out;
	&[data-expanded=true] > span > svg {
		transform: rotateZ(180deg);
	}
	&[data-can-sort=false] {
		> span {
			border-top-right-radius: 11px;
			border-bottom-right-radius: 11px;
		}
		> div:nth-last-child(-n + 2) {
			opacity: 0;
			pointer-events: none;
		}
	}
	> span {
		display: flex;
		align-items: center;
		height: 22px;
		font-variant: petite-caps;
		font-weight: var(--font-demi-bold);
		padding: 0 calc(var(--margin) / 3) 0 calc(var(--margin) / 2);
		border-top-left-radius: 11px;
		border-bottom-left-radius: 11px;
		background-color: var(--pipeline-bg-color);
		box-shadow: 0 0 0 1px var(--border-color);
		&:hover {
			box-shadow: var(--console-primary-hover-shadow);
		}
		> svg {
			font-size: 0.9em;
			margin-left: calc(var(--margin) / 3);
			transition: all 300ms ease-in-out;
		}
	}
	> div:nth-last-child(-n + 2) {
		display: flex;
		align-items: center;
		height: 22px;
		position: relative;
		background-color: var(--pipeline-bg-color);
		box-shadow: 1px 0 0 0 var(--border-color), 0 1px 0 0 var(--border-color), 0 -1px 0 0 var(--border-color);
		opacity: 1;
		pointer-events: auto;
		transition: all 300ms ease-in-out;
		&:hover {
			box-shadow: var(--console-primary-hover-shadow);
		}
	}
	> div:nth-last-child(2) {
		padding: 0 calc(var(--margin) / 3);
	}
	> div:last-child {
		border-top-right-radius: 11px;
		border-bottom-right-radius: 11px;
		padding: 0 calc(var(--margin) / 3);
	}
	//&:hover {
	//	box-shadow: var(--console-primary-hover-shadow);
	//}
	//&[data-expanded=true] > svg {
	//	transform: rotateZ(180deg);
	//}
	//> span {
	//	padding-left: calc(var(--margin) / 2);
	//	font-variant: petite-caps;
	//	font-weight: var(--font-demi-bold);
	//}
	//> svg:nth-child(2) {
	//	font-size: 0.9em;
	//	margin: 0 calc(var(--margin) / 3);
	//	transition: all 300ms ease-in-out;
	//}
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
const MappingRuleContent = styled.div.attrs<{ lines: number }>(({ lines }) => {
	return {
		'data-scrolling': lines > 10
	};
})<{ lines: number }>`
	display: grid;
	position: relative;
	grid-template-columns: 32px calc(100% - 32px);
	grid-auto-rows: 32px;
	flex-grow: 1;
	max-height: 320px;
	overflow-y: auto;
	//padding: 10px 0;
	//margin: 10px 0;
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
const MappingRuleContainer = styled.div`
	display: flex;
	align-items: center;
	justify-self: stretch;
	height: 32px;
`;
const MappingRule = styled.div`
	display: flex;
	position: relative;
	align-self: center;
	justify-self: start;
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
const DropdownHeight = 120;
const Dropdown = styled.div.attrs<DropdownRect>(({ top, left, width, atTop }) => {
	return {
		style: {
			top, left, minWidth: Math.max(width, 600),
			transformOrigin: atTop ? 'bottom' : 'top'
		}
	};
})<DropdownRect>`
	display: flex;
	position: fixed;
	flex-direction: column;
	z-index: 1000;
	height: ${DropdownHeight}px;
	padding: 0 calc(var(--margin) / 2);
	transform: scaleY(0);
	transition: transform 300ms ease-in-out;
	pointer-events: none;
	background-color: var(--bg-color);
	border-radius: calc(var(--border-radius) * 3);
	box-shadow: var(--console-primary-hover-shadow);
	&[data-expanded=true] {
		transform: none;
		pointer-events: auto;
	}
	> div {
		height: 28px;
		&:first-child {
			display: flex;
			align-items: center;
			height: 32px;
			background-color: var(--pipeline-bg-color);
			margin: 0 calc(var(--margin) / -2) 2px;
			padding: 0 calc(var(--margin) / 2);
			font-weight: var(--font-bold);
		}
		&:last-child {
			margin-bottom: 2px;
		}
	}
`;
const FactorContainer = styled.div`
	display: flex;
	align-items: center;
	> div:first-child {
		display: flex;
		align-items: center;
		height: 22px;
		padding: 0 calc(var(--margin) / 2);
		font-variant: petite-caps;
		font-weight: var(--font-demi-bold);
		background-color: var(--pipeline-bg-color);
		box-shadow: 0 0 0 1px var(--border-color);
		border-top-left-radius: var(--border-radius);
		border-bottom-left-radius: var(--border-radius);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	> div:nth-child(2) {
		flex-grow: 1;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		box-shadow: 0 1px 0 0 var(--border-color), 0 -1px 0 0 var(--border-color), 1px 0 0 0 var(--border-color);
		&:hover {
			box-shadow: var(--console-primary-hover-shadow);
		}
		> input {
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
		}
	}
`;
const OperatorAndRightContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`;
const AddButton = styled.div`
	display: flex;
	position: relative;
	align-items: center;
	align-self: flex-start;
	height: 22px;
	font-variant: petite-caps;
	font-weight: var(--font-demi-bold);
	margin: 5px 0 5px 32px;
	border-radius: 11px;
	cursor: pointer;
	transition: all 300ms ease-in-out;
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
	&[data-can-sort=false] {
		> span {
			border-top-right-radius: 11px;
			border-bottom-right-radius: 11px;
		}
		> div:nth-last-child(-n + 2) {
			opacity: 0;
			pointer-events: none;
		}
	}
	> span {
		display: flex;
		align-items: center;
		height: 22px;
		padding: 0 calc(var(--margin) / 3) 0 calc(var(--margin) / 2);
		border-top-left-radius: 11px;
		border-bottom-left-radius: 11px;
		background-color: var(--pipeline-bg-color);
		box-shadow: 0 0 0 1px var(--border-color);
		&:hover {
			box-shadow: var(--console-primary-hover-shadow);
		}
		> svg {
			font-size: 0.8em;
			margin-left: calc(var(--margin) / 3);
		}
	}
	> div:nth-last-child(-n + 2) {
		display: flex;
		align-items: center;
		height: 22px;
		position: relative;
		background-color: var(--pipeline-bg-color);
		box-shadow: 1px 0 0 0 var(--border-color), 0 1px 0 0 var(--border-color), 0 -1px 0 0 var(--border-color);
		opacity: 1;
		pointer-events: auto;
		transition: all 300ms ease-in-out;
		&:hover {
			box-shadow: var(--console-primary-hover-shadow);
		}
	}
	> div:nth-last-child(2) {
		padding: 0 calc(var(--margin) / 3);
	}
	> div:last-child {
		border-top-right-radius: 11px;
		border-bottom-right-radius: 11px;
		padding: 0 calc(var(--margin) / 3);
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

const FilterLabel = (props: {
	topic?: QueriedTopicForPipeline;
	count: number;
	children?: ((props: any) => React.ReactNode) | React.ReactNode;
}) => {
	const { topic, count, children } = props;

	if (topic) {
		if (count === 0) {
			return <span><span>No Mapping Defined</span>{children}</span>;
		} else if (count === 1) {
			return <span><span>1 Mapping Rule</span>{children}</span>;
		} else {
			return <span><span>{count} Mapping Rules</span>{children}</span>;
		}
	} else {
		return <span><span>Pick Topic First</span>{children}</span>;
	}
};

const Statement = (props: {
	mapping: MappingFactor
}) => {
	const { mapping } = props;

	const { store: { topics } } = usePipelineContext();
	const { addPropertyChangeListener, removePropertyChangeListener } = usePipelineUnitActionMappingContext();
	const forceUpdate = useForceUpdate();
	useEffect(() => {
		addPropertyChangeListener(PipelineUnitActionMappingEvent.FROM_CHANGED, forceUpdate);
		addPropertyChangeListener(PipelineUnitActionMappingEvent.TO_CHANGED, forceUpdate);
		return () => {
			removePropertyChangeListener(PipelineUnitActionMappingEvent.FROM_CHANGED, forceUpdate);
			removePropertyChangeListener(PipelineUnitActionMappingEvent.TO_CHANGED, forceUpdate);
		};
	});

	return <div>{buildLabel({ mapping, topics })}</div>;
};

const RuleNode = (props: {
	holder: MappingRow;
	rule: MappingFactor;
	onRemove: (rule: MappingFactor) => void;
}) => {
	const { rule, onRemove } = props;

	const { store: { topics } } = usePipelineContext();
	const { firePropertyChange } = usePipelineUnitActionMappingContext();
	const topContainerRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const [ expanded, setExpanded ] = useState(false);
	const [ dropdownRect, setDropdownRect ] = useState<DropdownRect>({ top: 0, left: 0, width: 0, atTop: false });
	useCollapseFixedThing(topContainerRef, () => setExpanded(false));

	const onExpandClick = () => {
		if (!expanded) {
			const rect = containerRef.current!.getBoundingClientRect();
			const top = rect.top + rect.height + 2;
			const bottom = top + DropdownHeight;
			if (bottom > window.innerHeight) {
				setDropdownRect({
					top: rect.top - DropdownHeight - 2,
					left: rect.left,
					width: rect.width,
					atTop: true
				});
			} else {
				setDropdownRect({ top, left: rect.left, width: rect.width, atTop: false });
			}
			setExpanded(true);
		}
	};
	const onRemoveMappingRuleClicked = (event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		onRemove(rule);
	};
	const onFromChanged = () => firePropertyChange(PipelineUnitActionMappingEvent.FROM_CHANGED);
	const onToChanged = () => firePropertyChange(PipelineUnitActionMappingEvent.TO_CHANGED);

	// eslint-disable-next-line
	const topic = topics.find(topic => topic.topicId == (rule.to as FactorValue).topicId);

	return <MappingRuleContainer ref={topContainerRef}>
		<MappingRule ref={containerRef} tabIndex={0} data-expanded={expanded}
		             onClick={onExpandClick}>
			<Statement mapping={rule}/>
			<div><FontAwesomeIcon icon={expanded ? faCompressAlt : faExpandAlt}/></div>
			<div onClick={onRemoveMappingRuleClicked}><FontAwesomeIcon icon={faTrashAlt}/></div>
		</MappingRule>
		<Dropdown ref={dropdownRef} data-expanded={expanded} {...dropdownRect}>
			<div>Mapping Setting</div>
			<FacterValueFinder holder={rule.from}
			                   onTopicChange={onFromChanged} onFactorChange={onFromChanged}
			                   onVariableChange={onFromChanged}
			                   onArithmeticChange={onFromChanged}/>
			<OperatorAndRightContainer>⤋</OperatorAndRightContainer>
			<FactorContainer>
				<div>Topic: {topic?.name}</div>
				<FactorFinder holder={rule.to as FactorValue} onChange={onToChanged}/>
			</FactorContainer>
		</Dropdown>
	</MappingRuleContainer>;
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
	const onRuleRemove = (rule: MappingFactor) => {
		const index = holder.mapping.findIndex(child => child === rule);
		holder.mapping.splice(index, 1);
		forceUpdate();
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
	const onSortAlphaDown = (event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		holder.mapping.sort((r1, r2) => {
			return buildLabel({ mapping: r1, topics }).localeCompare(buildLabel({ mapping: r2, topics }));
		});
		forceUpdate();
	};
	const onSortAlphaUp = (event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		holder.mapping.sort((r1, r2) => {
			return buildLabel({ mapping: r2, topics }).localeCompare(buildLabel({ mapping: r1, topics }));
		});
		forceUpdate();
	};

	if (!holder.mapping) {
		holder.mapping = [];
	}

	const ruleCount = holder.mapping.length;
	const canSort = expanded && ruleCount >= 2;

	return <Container>
		<ToggleLine>
			<ToggleButton data-expanded={expanded} data-can-sort={canSort} onClick={onToggleFilterSettingsClicked}>
				<FilterLabel topic={topic} count={ruleCount}>
					<FontAwesomeIcon icon={expanded ? faCompressArrowsAlt : faExpandArrowsAlt}/>
				</FilterLabel>
				<div onClick={onSortAlphaDown}><FontAwesomeIcon icon={faSortAlphaDown}/></div>
				<div onClick={onSortAlphaUp}><FontAwesomeIcon icon={faSortAlphaUp}/></div>
			</ToggleButton>
		</ToggleLine>
		{topic
			? <Body lines={ruleCount} expanded={expanded}>
				<MappingRuleContent lines={ruleCount}>
					{(holder.mapping || []).map((rule, index) => {
						return <PipelineUnitActionMappingContextProvider key={index}>
							<div/>
							<RuleNode holder={holder} rule={rule} onRemove={onRuleRemove}/>
						</PipelineUnitActionMappingContextProvider>;
					})}
				</MappingRuleContent>
				<AddButton data-can-sort={canSort}>
					<span onClick={onAppendMappingRuleClicked}>
						<span>Append Mapping Rule</span>
						<FontAwesomeIcon icon={faPlus}/>
					</span>
					<div onClick={onSortAlphaDown}><FontAwesomeIcon icon={faSortAlphaDown}/></div>
					<div onClick={onSortAlphaUp}><FontAwesomeIcon icon={faSortAlphaUp}/></div>
				</AddButton>
			</Body>
			: null}
	</Container>;
};