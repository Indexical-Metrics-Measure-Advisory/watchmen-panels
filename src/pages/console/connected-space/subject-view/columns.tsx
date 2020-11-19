import { faCompressAlt, faExpandAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment } from 'react';
import { LinkButton } from '../../component/link-button';
import { SubjectMenuBody, SubjectMenuBodyWrapper, SubjectMenuHeader } from './components';

export const SubjectColumns = (props: {
	min: boolean;
	onMinChanged: (min: boolean) => void;
}) => {
	const {
		min, onMinChanged
	} = props;

	return <Fragment>
		<SubjectMenuHeader>
			<div>Columns</div>
			<LinkButton onClick={() => onMinChanged(!min)} ignoreHorizontalPadding={true}
			            tooltip={`${min ? 'Expand' : 'Collapse'} Columns Definition`} center={true}>
				<FontAwesomeIcon icon={min ? faExpandAlt : faCompressAlt}/>
			</LinkButton>
		</SubjectMenuHeader>
		<SubjectMenuBody data-visible={!min}>
			<SubjectMenuBodyWrapper/>
		</SubjectMenuBody>
	</Fragment>;
};