import { faCompressAlt, faExchangeAlt, faExpandAlt, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useReducer } from 'react';
import styled from 'styled-components';
import {
	ConnectedConsoleSpace,
	ConsoleSpace,
	ConsoleSpaceSubject,
	ConsoleTopicRelationship
} from '../../../../services/console/types';
import Dropdown from '../../../component/dropdown';
import { LinkButton } from '../../component/link-button';
import { SubjectMenuBody, SubjectMenuBodyWrapper, SubjectMenuHeader } from './components';
import { useSubjectContext } from './context';

const JoinRowContainer = styled.div`
	display: grid;
	position: relative;
	grid-template-columns: calc(50% - 32px) 32px calc(50% - 32px) 32px;
	grid-row-gap: 2px;
	font-size: 0.8em;
	padding: calc(var(--margin) / 4) 0;
	margin: 0 calc(var(--margin) / 2);
	&:after {
		content: '';
		display: block;
		position: absolute;
		width: 100%;
		height: 1px;
		left: 0;
		bottom: 0;
		background-color: var(--border-color);
		opacity: 0.6;
	}
	&:last-child {
		margin-bottom: calc(var(--margin) / 4);
		&:after {
			display: none;
		}
	}
	> div:nth-child(2),
	> div:nth-child(4) {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	> div:nth-child(1),
	> div:nth-child(3) {
		display: flex;
		align-items: center;
		height: 32px;
		> div[data-widget=dropdown] {
			font-size: 0.8em;
			color: var(--console-font-color);
			border-color: transparent;
			transition: all 300ms ease-in-out;
			&:hover,
			&:focus {
				border-color: var(--border-color);
			}
		}
	}
`;

const convertRelationTopic = (options: { spaceDef: ConsoleSpace, topicId: string, factorNames: Array<string> }) => {
	const { spaceDef, topicId, factorNames } = options;
	// eslint-disable-next-line
	const topic = spaceDef.topics.find(t => t.topicId == topicId)!;
	const factorLabels = factorNames.map(name => topic.factors.find(factor => factor.name === name)!.label);
	const factorLabel = factorLabels.length === 1 ? factorLabels[0] : `${factorLabels[0]}, and ${factorLabels.length - 1} more...`;
	return {
		topic,
		factorLabel: `${topic.name}, ${factorLabel}`,
		factorLabels: factorLabels.map((label, index) => ({
			label: `${index + 1}: ${topic.name}, ${label}`,
			value: 'label'
		}))
	};
};

export const JoinRow = (props: {
	relation: ConsoleTopicRelationship;
	removeJoin: (relationId: string) => void;
}) => {
	const { relation, removeJoin } = props;

	const { defs: { space: spaceDef } } = useSubjectContext();

	const { sourceTopicId, sourceFactorNames, targetTopicId, targetFactorNames } = relation;
	const { factorLabel: sourceFactorLabel, factorLabels: sourceFactorLabels } = convertRelationTopic({
		spaceDef,
		topicId: sourceTopicId,
		factorNames: sourceFactorNames
	});
	const { factorLabel: targetFactorLabel, factorLabels: targetFactorLabels } = convertRelationTopic({
		spaceDef,
		topicId: targetTopicId,
		factorNames: targetFactorNames
	});
	const nothing = async () => {
	};
	const onJoinRemoveClicked = () => removeJoin(relation.relationId);

	return <JoinRowContainer>
		<div>
			<Dropdown options={sourceFactorLabels} onChange={nothing} please={sourceFactorLabel}/>
		</div>
		<div>
			<FontAwesomeIcon icon={faExchangeAlt}/>
		</div>
		<div>
			<Dropdown options={targetFactorLabels} onChange={nothing} please={targetFactorLabel}/>
		</div>
		<div>
			<LinkButton onClick={onJoinRemoveClicked} ignoreHorizontalPadding={true}
			            tooltip={'Remove Join'} center={true}>
				<FontAwesomeIcon icon={faTimes}/>
			</LinkButton>
		</div>
	</JoinRowContainer>;
};

export const SubjectJoins = (props: {
	space: ConnectedConsoleSpace;
	subject: ConsoleSpaceSubject;
	min: boolean;
	onMinChanged: (min: boolean) => void;
}) => {
	const {
		subject,
		min, onMinChanged
	} = props;

	const { dataset = {} } = subject;
	const { joins = [] } = dataset;

	const { defs: { space: spaceDef } } = useSubjectContext();
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);

	const { topicRelations = [] } = spaceDef;

	const onAddJoinClicked = () => {
	};
	const onRemoveJoin = (relationId: string) => {
		const index = joins.findIndex(join => join.relationId == relationId);
		joins.splice(index, 1);
		forceUpdate();
	};

	return <Fragment>
		<SubjectMenuHeader>
			<div>
				<span>Joins</span>
				<span>{joins.length}</span>
			</div>
			<LinkButton onClick={onAddJoinClicked} ignoreHorizontalPadding={true}
			            tooltip='Add Join' center={true}>
				<FontAwesomeIcon icon={faPlus}/>
			</LinkButton>
			<LinkButton onClick={() => onMinChanged(!min)} ignoreHorizontalPadding={true}
			            tooltip={`${min ? 'Expand' : 'Collapse'} Joins Definition`} center={true}>
				<FontAwesomeIcon icon={min ? faExpandAlt : faCompressAlt}/>
			</LinkButton>
		</SubjectMenuHeader>
		<SubjectMenuBody data-visible={!min}>
			<SubjectMenuBodyWrapper>
				{joins.map(({ relationId }) => {
					// eslint-disable-next-line
					const relation = topicRelations.find(relation => relation.relationId == relationId)!;
					return <JoinRow relation={relation} key={relation.relationId}
					                removeJoin={onRemoveJoin}/>;
				})}
			</SubjectMenuBodyWrapper>
		</SubjectMenuBody>
	</Fragment>;
};