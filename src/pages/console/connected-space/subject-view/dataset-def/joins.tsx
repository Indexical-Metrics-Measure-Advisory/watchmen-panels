import { faCompressAlt, faExpandAlt, faPlus, faSortAlphaDown, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { v4 } from 'uuid';
import { useForceUpdate } from '../../../../../common/utils';
import {
	ConnectedConsoleSpace,
	ConsoleSpaceSubject,
	ConsoleSpaceSubjectDataSetJoin,
	ConsoleTopic,
	ConsoleTopicFactor,
	TopicJoinType
} from '../../../../../services/console/types';
import { LinkButton } from '../../../../component/console/link-button';
import Dropdown, { DropdownOption } from '../../../../component/dropdown';
import { SubjectPanelBody, SubjectPanelBodyWrapper, SubjectPanelHeader } from '../components';
import { useSubjectContext } from '../context';
import { ColumnFactor } from './column-factor';
import { ColumnTopic } from './column-topic';

const JoinRowContainer = styled.div.attrs({
	'data-widget': 'console-subject-view-join-row'
})`
	display    : flex;
	position   : relative;
	padding    : 0 calc(var(--margin) / 2);
	margin-top : calc(var(--margin) / 4);
	&:last-child {
		margin-bottom : calc(var(--margin) / 4);
	}
	> div[data-widget=dropdown] {
		font-size     : 0.8em;
		max-width     : 130px;
		border-radius : 0;
		margin-left   : -1px;
		> span:first-child,
		> div:last-child > span {
			> span {
				overflow-x    : hidden;
				white-space   : nowrap;
				text-overflow : ellipsis;
				> span:last-child {
					flex-grow : 1;
				}
			}
			> svg {
				min-width : 32px;
			}
		}
	}
	> button {
		min-width                  : 32px;
		border                     : var(--border);
		border-left-color          : transparent;
		border-top-right-radius    : var(--border-radius);
		border-bottom-right-radius : var(--border-radius);
		margin-left                : -1px;
		&:hover:before {
			border-top-left-radius    : 0;
			border-bottom-left-radius : 0;
		}
	}
`;

const JoinTypes = [
	{ value: TopicJoinType.INNER, label: 'Complete Match' },
	{ value: TopicJoinType.RIGHT, label: 'Right First' },
	{ value: TopicJoinType.LEFT, label: 'Left First' }
];

export const JoinRow = (props: {
	join: ConsoleSpaceSubjectDataSetJoin;
	removeJoin: (join: ConsoleSpaceSubjectDataSetJoin) => void;
}) => {
	const { join, removeJoin } = props;

	const forceUpdate = useForceUpdate();

	const onTypeChanged = async (option: DropdownOption) => {
		join.type = option.value as TopicJoinType;
		forceUpdate();
	};
	const onJoinRemoveClicked = () => removeJoin(join);

	if (!join.type) {
		join.type = TopicJoinType.INNER;
	}

	return <JoinRowContainer>
		<ColumnTopic column={join} propNames={[ 'topicId', 'factorId' ]}
		             onTopicChanged={forceUpdate}/>
		<ColumnFactor column={join} propNames={[ 'topicId', 'factorId' ]}
		              onFactorChanged={forceUpdate}/>
		<Dropdown value={join.type || TopicJoinType.INNER} options={JoinTypes}
		          onChange={onTypeChanged}/>
		<ColumnTopic column={join} propNames={[ 'secondaryTopicId', 'secondaryFactorId' ]}
		             onTopicChanged={forceUpdate}/>
		<ColumnFactor column={join} propNames={[ 'secondaryTopicId', 'secondaryFactorId' ]}
		              onFactorChanged={forceUpdate}/>
		<LinkButton onClick={onJoinRemoveClicked} ignoreHorizontalPadding={true}
		            tooltip={'Remove Join'} center={true}>
			<FontAwesomeIcon icon={faTimes}/>
		</LinkButton>
	</JoinRowContainer>;
};

const asLabel = (
	join: ConsoleSpaceSubjectDataSetJoin,
	factors: { [key in string]: Array<DropdownOption & { topic: ConsoleTopic, factor: ConsoleTopicFactor }> }
) => {
	const { topicId, factorId, type, secondaryTopicId, secondaryFactorId } = join;
	let topicName = '?', factorName = '?', typeName, secondaryTopicName = '?', secondaryFactorName = '?';
	if (topicId) {
		const factorsOfTopic = factors[topicId] || [];
		if (factorsOfTopic.length > 0) {
			topicName = factorsOfTopic[0].topic.name;
		} else if (factorId) {
			// eslint-disable-next-line
			const { factor } = factorsOfTopic.find(({ factor }) => factor.factorId == factorId) || {};
			if (factor) {
				factorName = factor.label || factor.name;
			}
		}
	}
	typeName = type || TopicJoinType.INNER;
	if (secondaryTopicId) {
		const factorsOfTopic = factors[secondaryTopicId] || [];
		if (factorsOfTopic.length > 0) {
			secondaryTopicName = factorsOfTopic[0].topic.name;
		} else if (factorId) {
			// eslint-disable-next-line
			const { factor } = factorsOfTopic.find(({ factor }) => factor.factorId == secondaryFactorId) || {};
			if (factor) {
				secondaryFactorName = factor.label || factor.name;
			}
		}
	}

	return `${topicName}.${factorName}${typeName}${secondaryTopicName}.${secondaryFactorName}`;
};

export const SubjectJoins = (props: {
	space: ConnectedConsoleSpace;
	subject: ConsoleSpaceSubject;
	collapsed: boolean;
	onCollapsedChanged: (collapsed: boolean) => void;
}) => {
	const {
		subject,
		collapsed, onCollapsedChanged
	} = props;

	const { dataset = {} } = subject;
	const { joins = [] } = dataset;

	const { defs: { factors } } = useSubjectContext();
	const forceUpdate = useForceUpdate();

	const onSortClicked = () => {
		joins.sort((j1, j2) => asLabel(j1, factors).toLowerCase().localeCompare(asLabel(j2, factors).toLowerCase()));
	};
	const onAddJoinClicked = () => {
		const join = { type: TopicJoinType.INNER };
		joins.push(join);
		onCollapsedChanged(false);
		forceUpdate();
	};
	const onRemoveJoin = (join: ConsoleSpaceSubjectDataSetJoin) => {
		const index = joins.indexOf(join);
		joins.splice(index, 1);
		forceUpdate();
	};

	return <Fragment>
		<SubjectPanelHeader>
			<div>
				<span>Joins</span>
				<span>{joins.length}</span>
			</div>
			<LinkButton onClick={onAddJoinClicked} ignoreHorizontalPadding={true}
			            tooltip='Add Join' center={true}>
				<FontAwesomeIcon icon={faPlus}/>
			</LinkButton>
			<LinkButton onClick={onSortClicked} ignoreHorizontalPadding={true}
			            tooltip='Sort' center={true}>
				<FontAwesomeIcon icon={faSortAlphaDown}/>
			</LinkButton>
			<LinkButton onClick={() => onCollapsedChanged(!collapsed)} ignoreHorizontalPadding={true}
			            tooltip={`${collapsed ? 'Expand' : 'Collapse'} Joins Definition`} center={true}>
				<FontAwesomeIcon icon={collapsed ? faExpandAlt : faCompressAlt}/>
			</LinkButton>
		</SubjectPanelHeader>
		<SubjectPanelBody data-visible={!collapsed}>
			<SubjectPanelBodyWrapper>
				{joins.map((join) => {
					return <JoinRow join={join} key={v4()} removeJoin={onRemoveJoin}/>;
				})}
			</SubjectPanelBodyWrapper>
		</SubjectPanelBody>
	</Fragment>;
};