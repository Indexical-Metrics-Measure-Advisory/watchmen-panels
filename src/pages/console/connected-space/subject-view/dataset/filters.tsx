import { faCompressAlt, faExpandAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useReducer } from 'react';
import { ConsoleSpaceSubject } from '../../../../../services/console/types';
import { LinkButton } from '../../../component/link-button';
import { SubjectPanelBody, SubjectPanelBodyWrapper, SubjectPanelHeader } from '../components';

export const SubjectFilters = (props: {
	subject: ConsoleSpaceSubject;
	collapsed: boolean;
	onCollapsedChanged: (collapsed: boolean) => void;
}) => {
	const {
		subject,
		collapsed, onCollapsedChanged
	} = props;

	const { dataset = {} } = subject;
	const { filters = [] } = dataset;

	// const { defs: { space: spaceDef } } = useSubjectContext();
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);

	const onAddFilterClicked = () => {
		const filter = {};
		filters.push(filter);
		onCollapsedChanged(false);
		forceUpdate();
	};
	// const onRemoveFilter = (filter: ConsoleSpaceSubjectDataSetFilter) => {
	// 	const index = filters.indexOf(filter);
	// 	filters.splice(index, 1);
	// 	forceUpdate();
	// };

	return <Fragment>
		<SubjectPanelHeader>
			<div>Filters</div>
			<LinkButton onClick={onAddFilterClicked} ignoreHorizontalPadding={true}
			            tooltip='Add Filter' center={true}>
				<FontAwesomeIcon icon={faPlus}/>
			</LinkButton>
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