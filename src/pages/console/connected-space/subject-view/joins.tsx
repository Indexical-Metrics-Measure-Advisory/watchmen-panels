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
	ConsoleSpaceSubjectDataSetJoin
} from '../../../../services/console/types';
import Dropdown, { DropdownOption } from '../../../component/dropdown';
import { LinkButton } from '../../component/link-button';
import { SubjectPanelBody, SubjectPanelBodyWrapper, SubjectPanelHeader } from './components';
import { useSubjectContext } from './context';

const JoinRowContainer = styled.div`
	display: flex;
	position: relative;
	font-size: 0.8em;
	padding: calc(var(--margin) / 4) 0;
	margin: 0 calc(var(--margin) / 2);
	> div[data-widget=dropdown] {
		font-size: 0.8em;
		flex-grow: 1;
		> span:first-child,
		> div:last-child > span {
			> span {
				//width: calc(50% - 16px);
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
		margin-left: calc(var(--margin) / 4);
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

	const { defs: { space: spaceDef } } = useSubjectContext();
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);

	const onSortClicked = () => {
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