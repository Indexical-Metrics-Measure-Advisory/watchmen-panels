import { faWrench } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';
import { ProcessUnit } from '../../../../services/admin/pipeline-types';

const UnitContainer = styled.div`
	display: grid;
	grid-template-columns: 120px 1fr;
	align-items: center;
	padding: 0 calc(var(--margin) / 4);
	height: 36px;
	font-size: 0.8em;
	border-bottom: var(--border);
	border-color: var(--pipeline-border-color);
	> div:first-child {
		display: flex;
		white-space: nowrap;
		font-weight: var(--font-demi-bold);
		> div:first-child {
			margin-right: calc(var(--margin) / 3);
		}
	}
`;
export const PipelineUnit = (props: { unit: ProcessUnit }) => {
	return <UnitContainer>
		<div>
			<div><FontAwesomeIcon icon={faWrench}/></div>
			<div>Process Unit</div>
		</div>
	</UnitContainer>;
};