import { faCompressAlt, faExpandAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment } from 'react';
import { ConsoleSpaceSubject } from '../../../../../services/console/types';
import { LinkButton } from '../../../component/link-button';
import { SubjectPanelBody, SubjectPanelBodyWrapper, SubjectPanelHeader } from '../components';

export const SubjectFilters = (props: {
	subject: ConsoleSpaceSubject;
	collapsed: boolean;
	onCollapsedChanged: (collapsed: boolean) => void;
}) => {
	const {
		collapsed, onCollapsedChanged
	} = props;

	return <Fragment>
		<SubjectPanelHeader>
			<div>Filters</div>
			<LinkButton onClick={() => onCollapsedChanged(!collapsed)} ignoreHorizontalPadding={true}
			            tooltip={`${collapsed ? 'Expand' : 'Collapse'} Filters Definition`} center={true}>
				<FontAwesomeIcon icon={collapsed ? faExpandAlt : faCompressAlt}/>
			</LinkButton>
		</SubjectPanelHeader>
		<SubjectPanelBody data-visible={!collapsed}>
			<SubjectPanelBodyWrapper/>
		</SubjectPanelBody>
	</Fragment>;
};