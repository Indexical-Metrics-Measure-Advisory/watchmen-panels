import React, { useState } from 'react';
import styled from 'styled-components';
import { ProcessUnit } from '../../../../services/admin/pipeline-types';
import { HorizontalOptions } from './horizontal-options';

const UnitContainer = styled.div`
	display: flex;
	position: relative;
	flex-direction: column;
	font-size: 0.8em;
	&:before {
		content: '';
		display: block;
		position: absolute;
		left: calc(var(--margin) / 2);
		bottom: 0;
		width: calc(100% - var(--margin));
		height: 1px;
		border-bottom: 1px dashed var(--border-color);
		z-index: -1;
	}
`;
const UnitCondition = styled.div`
	display: grid;
	grid-template-columns: 120px 1fr;
	align-items: center;
	padding: 0 calc(var(--margin) / 2);
	height: 36px;
	> div:first-child {
		white-space: nowrap;
		font-weight: var(--font-demi-bold);
	}
`;

export const PipelineUnit = (props: { unit: ProcessUnit }) => {
	const { unit } = props;

	const [ conditional, setConditional ] = useState(!!unit.on);
	const toLabel = (withCondition: boolean) => withCondition ? 'Conditional' : 'Anyway';
	const onTypeChanged = (withCondition: boolean) => setConditional(withCondition);

	const conditionLabel = toLabel(conditional);

	return <UnitContainer>
		<UnitCondition>
			<div>When:</div>
			<HorizontalOptions label={conditionLabel}
			                   options={[ !conditional ]} toLabel={toLabel}
			                   onSelect={onTypeChanged}/>
		</UnitCondition>
	</UnitContainer>;
};