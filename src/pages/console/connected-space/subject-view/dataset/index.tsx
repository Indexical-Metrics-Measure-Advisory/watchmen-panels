import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import styled from 'styled-components';
import { ConnectedConsoleSpace, ConsoleSpaceSubject } from '../../../../../services/console/types';
import { LinkButton } from '../../../component/link-button';
import { SubjectPanelHeader } from '../components';
import { SubjectColumns } from './columns';
import { SubjectFilters } from './filters';
import { SubjectJoins } from './joins';

interface Collapsed {
	filters: boolean;
	columns: boolean;
	joins: boolean;
}

const DataSetDefinition = styled.div.attrs({
	'data-widget': 'console-subject-view-menu'
})`
	display: flex;
	position: relative;
	flex-direction: column;
	width: 60%;
	min-width: 500px;
	height: 100%;
	border-right: var(--border);
	box-shadow: var(--console-hover-shadow);
	background-color: var(--bg-color);
	transition: all 300ms ease-in-out;
	overflow: hidden;
	&[data-visible=false] {
		opacity: 0;
		width: 0;
		min-width: 0;
		pointer-events: none;
	}
`;

export const DataSet = (props: {
	space: ConnectedConsoleSpace;
	subject: ConsoleSpaceSubject;
	visible: boolean
	onVisibleChanged: (visible: boolean) => void;
}) => {
	const {
		space, subject,
		visible, onVisibleChanged
	} = props;

	const [ collapsed, setCollapsed ] = useState<Collapsed>({ filters: false, columns: false, joins: false });
	const changeCollapsed = (key: keyof Collapsed) => (value: boolean) => setCollapsed({ ...collapsed, [key]: value });

	return <DataSetDefinition data-visible={visible}>
		<SubjectPanelHeader>
			<div>{subject.name}</div>
			<LinkButton onClick={() => onVisibleChanged(false)} ignoreHorizontalPadding={true} tooltip='Minimize'
			            center={true}>
				<FontAwesomeIcon icon={faTimes}/>
			</LinkButton>
		</SubjectPanelHeader>
		<SubjectFilters subject={subject} collapsed={collapsed.filters}
		                onCollapsedChanged={changeCollapsed('filters')}/>
		<SubjectColumns space={space} subject={subject} collapsed={collapsed.columns}
		                onCollapsedChanged={changeCollapsed('columns')}/>
		<SubjectJoins space={space} subject={subject} collapsed={collapsed.joins}
		              onCollapsedChanged={changeCollapsed('joins')}/>
	</DataSetDefinition>;
};