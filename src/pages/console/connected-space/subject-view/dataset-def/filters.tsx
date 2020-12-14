import { faCompressAlt, faExpandAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment } from 'react';
import { useForceUpdate } from '../../../../../common/utils';
import {
	ConsoleSpaceSubject,
	ConsoleSpaceSubjectDataSetFilter,
	ConsoleSpaceSubjectDataSetFilterJoint
} from '../../../../../services/console/types';
import { LinkButton } from '../../../../component/console/link-button';
import { SubjectPanelBody, SubjectPanelBodyWrapper, SubjectPanelHeader } from '../components';
import { FilterJoint } from './filter-joint';
import { isJointFilter } from './utils';

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
	const forceUpdate = useForceUpdate();

	const onAddFilterClicked = () => {
		const filter = {};
		(filters[0] as ConsoleSpaceSubjectDataSetFilterJoint).filters.push(filter);
		onCollapsedChanged(false);
		forceUpdate();
	};
	const onRemoveFilter = () => forceUpdate();

	const countFilters = (filters: Array<ConsoleSpaceSubjectDataSetFilter>): number => {
		return filters.reduce((count: number, filter) => {
			if (isJointFilter(filter)) {
				count += countFilters(filter.filters);
			} else {
				count += 1;
			}
			return count;
		}, 0);
	};
	const filterCount = countFilters(filters);

	return <Fragment>
		<SubjectPanelHeader>
			<div>
				<span>Filters</span>
				<span>{filterCount}</span>
			</div>
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
			<SubjectPanelBodyWrapper>
				<FilterJoint joint={filters[0] as ConsoleSpaceSubjectDataSetFilterJoint}
				             removeFilter={onRemoveFilter} childrenFiltersChanged={forceUpdate}
				             level={0}/>
			</SubjectPanelBodyWrapper>
		</SubjectPanelBody>
	</Fragment>;
};