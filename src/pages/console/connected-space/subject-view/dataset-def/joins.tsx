import {
	faCompressAlt,
	faExchangeAlt,
	faExpandAlt,
	faPlus,
	faSortAlphaDown,
	faTimes
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useReducer } from 'react';
import styled from 'styled-components';
import {
	ConnectedConsoleSpace,
	ConsoleSpaceSubject,
	ConsoleSpaceSubjectDataSetJoin,
	ConsoleTopic,
	ConsoleTopicFactor
} from '../../../../../services/console/types';
import { LinkButton } from '../../../../component/console/link-button';
import Dropdown, { DropdownOption } from '../../../../component/dropdown';
import { SubjectPanelBody, SubjectPanelBodyWrapper, SubjectPanelHeader } from '../components';
import { useSubjectContext } from '../context';

const JoinRowContainer = styled.div.attrs({
	'data-widget': 'console-subject-view-join-row'
})`
	display: flex;
	position: relative;
	padding: 0 calc(var(--margin) / 2);
	margin-top: calc(var(--margin) / 4);
	&:last-child {
		margin-bottom: calc(var(--margin) / 4);
	}
	> div[data-widget=dropdown] {
		font-size: 0.8em;
		flex-grow: 1;
		max-width: calc(100% - 31px);
		&:first-child {
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		}
		> span:first-child,
		> div:last-child > span {
			> span {
				overflow-x: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				> span:last-child {
					flex-grow: 1;
				}
			}
			> svg {
				min-width: 32px;
			}
		}
	}
	> button {
		min-width: 32px;
		border: var(--border);
		border-left-color: transparent;
		border-top-right-radius: var(--border-radius);
		border-bottom-right-radius: var(--border-radius);
		margin-left: -1px;
		&:hover:before {
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
		}
	}
`;

export const JoinRow = (props: {
	join: ConsoleSpaceSubjectDataSetJoin;
	removeJoin: (join: ConsoleSpaceSubjectDataSetJoin) => void;
}) => {
	const { join, removeJoin } = props;

	const { defs: { relations } } = useSubjectContext();
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);

	const onRelationChanged = async ({ value }: DropdownOption) => {
		join.relationId = value as string;
		forceUpdate();
	};
	const onJoinRemoveClicked = () => removeJoin(join);

	const relationOptions =
		relations.map(({
			               value,
			               source: { topic: sourceTopic, factors: sourceFactors },
			               target: { topic: targetTopic, factors: targetFactors }
		               }) => {
			return {
				value,
				label: <Fragment>
					<span>{sourceTopic.name}[{sourceFactors.map(f => f.label).join(', ')}]</span>
					<FontAwesomeIcon icon={faExchangeAlt}/>
					<span>{targetTopic.name}[{targetFactors.map(f => f.label).join(', ')}]</span>
				</Fragment>
			};
		});

	return <JoinRowContainer>
		<Dropdown options={relationOptions} onChange={onRelationChanged} value={join.relationId}/>
		<LinkButton onClick={onJoinRemoveClicked} ignoreHorizontalPadding={true}
		            tooltip={'Remove Join'} center={true}>
			<FontAwesomeIcon icon={faTimes}/>
		</LinkButton>
	</JoinRowContainer>;
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

	const { defs: { relations } } = useSubjectContext();
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);

	const onSortClicked = () => {
		const asLabel = ({
			                 source: { topic: sourceTopic, factors: sourceFactors },
			                 target: { topic: targetTopic, factors: targetFactors }
		                 }: {
			source: { topic: ConsoleTopic, factors: Array<ConsoleTopicFactor> },
			target: { topic: ConsoleTopic, factors: Array<ConsoleTopicFactor> },
		}) => {
			return `${sourceTopic.name}[${sourceFactors.map(f => f.label).join(', ')}];${targetTopic.name}[${targetFactors.map(f => f.label).join(', ')}]`;
		};
		joins.sort((j1, j2) => {
			if (!j1.relationId) {
				return !j2.relationId ? 0 : 1;
			} else if (!j2.relationId) {
				return -1;
				// eslint-disable-next-line
			} else if (j1.relationId == j2.relationId) {
				return 0;
			}

			// eslint-disable-next-line
			const r1 = relations.find(r => r.value == j1.relationId)!;
			// eslint-disable-next-line
			const r2 = relations.find(r => r.value == j2.relationId)!;
			const l1 = asLabel(r1);
			const l2 = asLabel(r2);
			return l1.localeCompare(l2);
		});
	};
	const onAddJoinClicked = () => {
		const join = {};
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
				{joins.map((join, index) => {
					return <JoinRow join={join} key={`${join.relationId}-${index}`}
					                removeJoin={onRemoveJoin}/>;
				})}
			</SubjectPanelBodyWrapper>
		</SubjectPanelBody>
	</Fragment>;
};