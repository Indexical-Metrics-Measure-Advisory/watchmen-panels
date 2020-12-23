import { faChartBar } from '@fortawesome/free-regular-svg-icons';
import {
	faCompressAlt,
	faExpandAlt,
	faGlobe,
	faList,
	faPlus,
	faTimes,
	faUsers
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useState } from "react";
import styled from 'styled-components';
import { v4 } from 'uuid';
import TopicBackground from '../../../assets/topic-background.png';
import { fetchTopic, listTopics, saveTopic } from '../../../services/admin/topic';
import { Factor, FactorType, QueriedTopic, Topic, TopicType } from '../../../services/admin/types';
import { TooltipCarvedButton } from '../../component/console/carved-button';
import { LinkButton } from '../../component/console/link-button';
import { DropdownOption } from '../../component/dropdown';
import { PropDropdown } from '../component/prop-dropdown';
import { PropInput } from '../component/prop-input';
import { PropInputLines } from '../component/prop-input-lines';
import { PropLabel } from '../component/prop-label';
import { SearchAndEditPanel } from '../component/search-and-edit-panel';
import { SingleSearchItemCard } from '../component/single-search';
import { PrimaryObjectButton } from '../pipeline/editor/components/object-button';

const FactorsButton = styled.div`
	display: flex;
	align-items: center;
	justify-self: start;
	font-size: 0.8em;
	font-variant: petite-caps;
	font-weight: var(--font-bold);
	height: 24px;
	border-radius: 12px;
	color: var(--invert-color);
	background-color: var(--console-primary-color);
	padding: 0 calc(var(--margin) / 3) 0 calc(var(--margin) / 2);
	cursor: pointer;
	&:hover {
		box-shadow: var(--console-primary-hover-shadow);
	}
	&[data-expanded=true] {
		> svg {
			transform: rotateZ(360deg);
		}
	}
	> span {
		position: relative;;
		padding-right: calc(var(--margin) / 3);
		&:after {
			content: '';
			display: block;
			position: absolute;
			top: 10%;
			right: 0;
			width: 1px;
			height: 80%;
			background-color: var(--invert-color);
			opacity: 0.7;
		}
	}
	> svg {
		margin-left: calc(var(--margin) / 3);
		transition: all 300ms ease-in-out;
	}
`;
const FactorTable = styled.div.attrs<{ expanded: boolean, factorCount: number }>(({ expanded, factorCount }) => {
	return {
		style: {
			height: expanded ? (Math.min(688, factorCount * 32 + 32 + 16 + 28)) : 0
		}
	};
})<{ expanded: boolean, factorCount: number }>`
	grid-column: span 2;
	display: flex;
	flex-direction: column;
	font-size: 0.8em;
	margin: 0 calc(var(--margin) / -2) 24px;
	padding: 0 calc(var(--margin) / 2);
	overflow: hidden;
	transition: all 300ms ease-in-out;
`;
const FactorTableHeader = styled.div`
	display: grid;
	grid-template-columns: 150px 150px 120px 1fr;
	> div {
		display: flex;
		align-items: center;
		height: 28px;
		border-bottom: var(--border);
		padding-left: calc(var(--margin) / 2);
		font-variant: petite-caps;
		font-weight: var(--font-bold);
	}
`;
const FactorTableBody = styled.div`
	display: grid;
	grid-template-columns: 150px 150px 120px 1fr;
	margin: 0 calc(var(--margin) / -2);
	padding: 0 calc(var(--margin) / 2) 32px;
	overflow: hidden;
	> div {
		display: flex;
		align-items: center;
		height: 32px;
		padding-left: calc(var(--margin) / 2);
		&:nth-child(4n) {
			padding-right: calc(var(--margin) / 2);
			border-top-right-radius: var(--border-radius);
			border-bottom-right-radius: var(--border-radius);
			&:hover {
				> div {
					opacity: 1;
					pointer-events: auto;
				}
			}
			> input {
				margin-right: calc(var(--margin) / -2);
				width: calc(100% + var(--input-indent) * 2);
			}
			> div {
				display: block;
				position: absolute;
				opacity: 0;
				pointer-events: none;
				padding: 4px 8px 4px calc(var(--margin) / 4);
				left: 100%;
				height: 32px;
				button {
					width: 24px;
					height: 24px;
					font-size: 1em;
					color: var(--invert-color);
					background-color: var(--console-danger-color);
					border-radius: 12px;
					&:before {
						border-radius: 12px;
					}
				}
			}
		}
		&:nth-child(4n + 1) {
			border-top-left-radius: var(--border-radius);
			border-bottom-left-radius: var(--border-radius);
			&:hover + div + div + div {
				> div {
					opacity: 1;
					pointer-events: auto;
				}
			}
		}
		&:nth-child(4n + 2) {
			&:hover + div + div {
				> div {
					opacity: 1;
					pointer-events: auto;
				}
			}
		}
		&:nth-child(4n + 3) {
			&:hover + div {
				> div {
					opacity: 1;
					pointer-events: auto;
				}
			}
		}
		&:nth-child(8n + 5), &:nth-child(8n + 6), &:nth-child(8n + 7), &:nth-child(8n) {
			background-color: var(--pipeline-bg-color);
		}
		> input {
			height: 26px;
			width: calc(100% + var(--input-indent));
			border-color: transparent;
			margin-left: calc(var(--input-indent) * -1);
			color: var(--console-font-color);
			&:hover {
				border-color: var(--border-color);
				box-shadow: var(--console-hover-shadow);
			}
			&:focus {
				border-color: var(--console-primary-color);
				color: var(--font-color);
				background-color: var(--bg-color);
				box-shadow: var(--console-primary-hover-shadow);
				z-index: 1;
			}
		}
		> div[data-widget=dropdown] {
			height: 26px;
			width: calc(100% + var(--input-indent));
			border-color: transparent;
			margin-left: calc(var(--input-indent) * -1);
			color: var(--console-font-color);
			&:hover {
				border-color: var(--border-color);
				box-shadow: var(--console-hover-shadow);
			}
			&:focus {
				border-color: var(--console-primary-color);
				color: var(--font-color);
				background-color: var(--bg-color);
				box-shadow: var(--console-primary-hover-shadow);
				z-index: 1;
			}
			&[data-options-visible=true] {
				> div {
					border-color: var(--console-primary-color);
				}
			}
		}
	}
`;
const FactorTableFooter = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-end;
	height: 32px;
	border-top: var(--border);
	margin-top: -32px;
	margin-bottom: -32px;
`;

const TopicTypeOptions = [
	{ value: TopicType.RAW, label: 'Raw' },
	{ value: TopicType.DISTINCT, label: 'Distinct' },
	{ value: TopicType.AGGREGATE, label: 'Aggregate' },
	{ value: TopicType.TIME, label: 'Time Aggregate' },
	{ value: TopicType.RATIO, label: 'Ratio' },
	{ value: TopicType.NOT_DEFINED, label: 'Not Defined' }
];
const FactorTypeOptions = [
	{ value: FactorType.TEXT, label: 'Text' },
	{ value: FactorType.NUMBER, label: 'Number' },
	{ value: FactorType.BOOLEAN, label: 'Boolean' },
	{ value: FactorType.DATETIME, label: 'DateTime' },
	{ value: FactorType.ENUM, label: 'Enumeration' },
	{ value: FactorType.SEQUENCE, label: 'Sequence' }
];

const Factors = (props: { topic: Topic, onDataChanged: () => void }) => {
	const { topic, onDataChanged } = props;

	const [ expanded, setExpanded ] = useState(false);

	const onExpandToggleClicked = () => setExpanded(!expanded);
	const onFactorPropChange = (factor: Factor, prop: 'name' | 'label' | 'description') => (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.value === factor[prop]) {
			return;
		}
		factor[prop] = event.target.value;
		onDataChanged();
	};
	const onFactorTypeChange = (factor: Factor) => async (option: DropdownOption) => {
		factor.type = option.value as FactorType;
		onDataChanged();
	};
	const onFactorDeleteClicked = (factor: Factor) => () => {
		topic.factors = topic.factors.filter(exists => exists !== factor);
		onDataChanged();
	};
	const onFactorAddClicked = () => {
		topic.factors.push({ type: FactorType.TEXT });
		onDataChanged();
	};

	const factorCount = topic.factors.length;
	const buttonLabel = factorCount === 0 ? 'No Factor Defined' : (factorCount === 1 ? '1 Factor' : `${factorCount} Factors`);

	return <Fragment>
		<FactorsButton onClick={onExpandToggleClicked} data-expanded={expanded}>
			<span>{buttonLabel}</span>
			<FontAwesomeIcon icon={expanded ? faCompressAlt : faExpandAlt}/>
		</FactorsButton>
		<FactorTable expanded={expanded} factorCount={factorCount}>
			<FactorTableHeader>
				<div>Name</div>
				<div>Label</div>
				<div>Type</div>
				<div>Description</div>
			</FactorTableHeader>
			<FactorTableBody>
				{topic.factors.map(factor => {
					return <Fragment key={factor.factorId || v4()}>
						<div><PropInput value={factor.name} onChange={onFactorPropChange(factor, 'name')}/></div>
						<div><PropInput value={factor.label} onChange={onFactorPropChange(factor, 'label')}/></div>
						<div>
							<PropDropdown value={factor.type} options={FactorTypeOptions}
							              onChange={onFactorTypeChange(factor)}/>
						</div>
						<div>
							<PropInput value={factor.description} onChange={onFactorPropChange(factor, 'description')}/>
							<div>
								<LinkButton ignoreHorizontalPadding={true} tooltip='Delete Factor' center={true}
								            onClick={onFactorDeleteClicked(factor)}>
									<FontAwesomeIcon icon={faTimes}/>
								</LinkButton>
							</div>
						</div>
					</Fragment>;
				})}
			</FactorTableBody>
			<FactorTableFooter>
				<PrimaryObjectButton onClick={onFactorAddClicked}>
					<FontAwesomeIcon icon={faPlus}/>
					<span>Add Factor</span>
				</PrimaryObjectButton>
			</FactorTableFooter>
		</FactorTable>
	</Fragment>;
};

const renderEditContent = (topic: Topic, onDataChanged: () => void) => {

	const onPropChange = (prop: 'code' | 'name' | 'description') => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		if (topic[prop] !== event.target.value) {
			topic[prop] = event.target.value;
			onDataChanged();
		}
	};
	const onTypeChange = async (option: DropdownOption) => {
		topic.type = option.value as TopicType;
		onDataChanged();
	};

	return <Fragment>
		<PropLabel>Topic Code:</PropLabel>
		<PropInput value={topic.code || ''} onChange={onPropChange('code')}/>
		<PropLabel>Topic Name:</PropLabel>
		<PropInput value={topic.name || ''} onChange={onPropChange('name')}/>
		<PropLabel>Topic Type:</PropLabel>
		<PropDropdown value={topic.type} options={TopicTypeOptions} onChange={onTypeChange}/>
		<PropLabel>Description:</PropLabel>
		<PropInputLines value={topic.description || ''} onChange={onPropChange('description')}/>
		<PropLabel>Factors:</PropLabel>
		<Factors topic={topic} onDataChanged={onDataChanged}/>
	</Fragment>;
};

export const Topics = () => {
	const createEntity = () => {
		return { type: TopicType.DISTINCT, factors: [] } as Topic;
	};
	const fetchEntityAndCodes = async (queriedTopic: QueriedTopic) => {
		const { topic } = await fetchTopic(queriedTopic.topicId);
		return { entity: topic };
	};
	const fetchEntityList = listTopics;
	const saveEntity = saveTopic;
	const isEntityOnCreate = (topic: Topic) => !topic.topicId;
	const renderItemInList = (topic: QueriedTopic, onEdit: (topic: QueriedTopic) => (() => void)) => {
		return <SingleSearchItemCard key={topic.topicId} onClick={onEdit(topic)}>
			<div>{topic.name}</div>
			<div>{topic.description}</div>
			<div>
				<TooltipCarvedButton tooltip='Factors Count' center={true}>
					<FontAwesomeIcon icon={faList}/>
					<span>{topic.factorCount}</span>
				</TooltipCarvedButton>
				<TooltipCarvedButton tooltip='In User Groups' center={true}>
					<FontAwesomeIcon icon={faUsers}/>
					<span>{topic.groupCount}</span>
				</TooltipCarvedButton>
				<TooltipCarvedButton tooltip='In Spaces' center={true}>
					<FontAwesomeIcon icon={faGlobe}/>
					<span>{topic.spaceCount}</span>
				</TooltipCarvedButton>
				<TooltipCarvedButton tooltip='In Reports' center={true}>
					<FontAwesomeIcon icon={faChartBar}/>
					<span>{topic.reportCount}</span>
				</TooltipCarvedButton>
			</div>
		</SingleSearchItemCard>;
	};
	const getKeyOfEntity = (item: QueriedTopic) => item.topicId;

	return <SearchAndEditPanel title='Topics'
	                           searchPlaceholder='Search by topic name, factor name, description, etc.'
	                           createButtonLabel='Create Topic'
	                           entityLabel='Topic'
	                           entityImage={TopicBackground}
	                           createEntity={createEntity}
	                           fetchEntityAndCodes={fetchEntityAndCodes}
	                           fetchEntityList={fetchEntityList}
	                           saveEntity={saveEntity}
	                           isEntityOnCreate={isEntityOnCreate}
	                           renderEntityInList={renderItemInList}
	                           getKeyOfEntity={getKeyOfEntity}
	                           renderEditContent={renderEditContent}/>;
};