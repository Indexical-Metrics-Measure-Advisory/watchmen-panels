import { faCompressAlt, faExpandAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment } from 'react';
import { ConsoleSpaceSubject } from '../../../../services/console/types';
import { LinkButton } from '../../component/link-button';
import { SubjectMenuBody, SubjectMenuBodyWrapper, SubjectMenuHeader } from './components';

export const SubjectFilters = (props: {
	subject: ConsoleSpaceSubject;
	min: boolean;
	onMinChanged: (min: boolean) => void;
}) => {
	const {
		min, onMinChanged
	} = props;

	return <Fragment>
		<SubjectMenuHeader>
			<div>Filters</div>
			<LinkButton onClick={() => onMinChanged(!min)} ignoreHorizontalPadding={true}
			            tooltip={`${min ? 'Expand' : 'Collapse'} Filters Definition`} center={true}>
				<FontAwesomeIcon icon={min ? faExpandAlt : faCompressAlt}/>
			</LinkButton>
		</SubjectMenuHeader>
		<SubjectMenuBody data-visible={!min}>
			<SubjectMenuBodyWrapper/>
		</SubjectMenuBody>
	</Fragment>;
};