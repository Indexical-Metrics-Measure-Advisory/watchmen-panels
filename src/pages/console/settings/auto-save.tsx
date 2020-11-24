import React, { Fragment, useState } from "react";
import Dropdown, { DropdownOption } from '../../component/dropdown';
import { Frequency, FrequencyOptions } from '../context/console-settings';
import { DropdownItemBody, ItemContainer, ItemTitle } from './components';

export const AutoSave = () => {
	const [ frequency, setFrequency ] = useState<Frequency>(Frequency.MIN_5);
	const onFrequencyChanged = async (option: DropdownOption) => {
		setFrequency(option.value as Frequency);
	};

	return <Fragment>
		<ItemContainer>
			<ItemTitle>Auto Save</ItemTitle>
			<DropdownItemBody>
				<span>Every</span>
				<Dropdown options={FrequencyOptions} onChange={onFrequencyChanged} value={frequency}/>
			</DropdownItemBody>
		</ItemContainer>
	</Fragment>;
};