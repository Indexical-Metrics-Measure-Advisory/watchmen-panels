import { faCompressAlt, faExpandAlt, faPlus, faSortAlphaDown, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useReducer } from 'react';
import styled from 'styled-components';
import {
	ConnectedConsoleSpace,
	ConsoleSpaceSubject,
	ConsoleSpaceSubjectDataSetColumn
} from '../../../../../services/console/types';
import Dropdown, { DropdownOption } from '../../../../component/dropdown';
import { LinkButton } from '../../../component/link-button';
import { SubjectPanelBody, SubjectPanelBodyWrapper, SubjectPanelHeader } from '../components';
import { useSubjectContext } from '../context';

const ColumnRowContainer = styled.div.attrs({
	'data-widget': 'console-subject-view-column-row'
})`
	display: flex;
	padding: 0 calc(var(--margin) / 2);
	margin-top: calc(var(--margin) / 4);
	&:last-child {
		margin-bottom: calc(var(--margin) / 4);
	}
	> div[data-widget=dropdown] {
		font-size: 0.8em;
		flex-grow: 1;
		&:first-child {
			background-color: var(--console-subject-topic-bg-color);
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		}
		&:nth-child(2) {
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
			border-left: 0;
		}
	}
	> button {
		min-width: 32px;
		margin-left: calc(var(--margin) / 4);
	}
`;

const ColumnRow = (props: {
	column: ConsoleSpaceSubjectDataSetColumn;
	removeColumn: (column: ConsoleSpaceSubjectDataSetColumn) => void;
}) => {
	const {
		column,
		removeColumn
	} = props;

	const { defs: { topics: topicOptions, factors: factorOptions } } = useSubjectContext();
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);

	const onColumnTopicChanged = (column: ConsoleSpaceSubjectDataSetColumn) => async ({ value }: DropdownOption) => {
		const originTopicId = column.topicId;
		column.topicId = value as string;
		// eslint-disable-next-line
		if (originTopicId != column.topicId) {
			delete column.factorId;
			forceUpdate();
		}
	};
	const onColumnFactorChanged = (column: ConsoleSpaceSubjectDataSetColumn) => async ({ value }: DropdownOption) => {
		column.factorId = value as string;
		forceUpdate();
	};
	const onColumnRemoveClicked = () => removeColumn(column);

	return <ColumnRowContainer>
		<Dropdown options={topicOptions} please='Topic'
		          value={column.topicId} onChange={onColumnTopicChanged(column)}/>
		<Dropdown options={factorOptions[column.topicId || ''] || []}
		          value={column.factorId} onChange={onColumnFactorChanged(column)}/>
		<LinkButton onClick={onColumnRemoveClicked} ignoreHorizontalPadding={true}
		            tooltip={'Remove Column'} center={true}>
			<FontAwesomeIcon icon={faTimes}/>
		</LinkButton>
	</ColumnRowContainer>;
};


export const SubjectColumns = (props: {
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
	const { columns = [] } = dataset;

	const { defs: { space: spaceDef } } = useSubjectContext();
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);

	const onSortClicked = () => {
		columns.sort((c1, c2) => {
			if (!c1.topicId) {
				return !c2.topicId ? 0 : 1;
			} else if (!c2.topicId) {
				return -1;
				// eslint-disable-next-line
			} else if (c1.topicId == c2.topicId) {
				if (!c1.factorId) {
					return !c2.factorId ? 0 : 1;
				} else if (!c2.factorId) {
					return -1;
					// eslint-disable-next-line
				} else if (c1.factorId == c2.factorId) {
					return 0;
				}
				// eslint-disable-next-line
				const topic = spaceDef.topics.find(t => t.topicId == c1.topicId)!;
				// eslint-disable-next-line
				const factor1 = topic.factors.find(f => f.factorId == c1.factorId)!;
				// eslint-disable-next-line
				const factor2 = topic.factors.find(f => f.factorId == c2.factorId)!;
				return factor1.label.toUpperCase().localeCompare(factor2.label.toUpperCase());
			} else {
				// eslint-disable-next-line
				const topic1 = spaceDef.topics.find(t => t.topicId == c1.topicId)!;
				// eslint-disable-next-line
				const topic2 = spaceDef.topics.find(t => t.topicId == c2.topicId)!;
				return topic1.name.toUpperCase().localeCompare(topic2.name.toUpperCase());
			}
		});
		forceUpdate();
	};
	const onAddColumnClicked = () => {
		const column = {};
		columns.push(column);
		onCollapsedChanged(false);
		forceUpdate();
	};
	const onRemoveColumn = (column: ConsoleSpaceSubjectDataSetColumn) => {
		const index = columns.indexOf(column);
		columns.splice(index, 1);
		forceUpdate();
	};

	return <Fragment>
		<SubjectPanelHeader>
			<div>
				<span>Columns</span>
				<span>{columns.length}</span>
			</div>
			<LinkButton onClick={onAddColumnClicked} ignoreHorizontalPadding={true}
			            tooltip='Add Column' center={true}>
				<FontAwesomeIcon icon={faPlus}/>
			</LinkButton>
			<LinkButton onClick={onSortClicked} ignoreHorizontalPadding={true}
			            tooltip='Sort' center={true}>
				<FontAwesomeIcon icon={faSortAlphaDown}/>
			</LinkButton>
			<LinkButton onClick={() => onCollapsedChanged(!collapsed)} ignoreHorizontalPadding={true}
			            tooltip={`${collapsed ? 'Expand' : 'Collapse'} Columns Definition`} center={true}>
				<FontAwesomeIcon icon={collapsed ? faExpandAlt : faCompressAlt}/>
			</LinkButton>
		</SubjectPanelHeader>
		<SubjectPanelBody data-visible={!collapsed}>
			<SubjectPanelBodyWrapper>
				{columns.map((column, index) => {
					const { topicId, factorId } = column;
					return <ColumnRow key={`${topicId}-${factorId}-${index}`}
					                  column={column}
					                  removeColumn={onRemoveColumn}/>;
				})}
			</SubjectPanelBodyWrapper>
		</SubjectPanelBody>
	</Fragment>;
};