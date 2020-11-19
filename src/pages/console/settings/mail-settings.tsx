import React, { Fragment, useState } from "react";
import Dropdown, { DropdownOption } from '../../component/dropdown';
import { FrequencyOptions } from '../context/console-settings';
import { DropdownItemBody, ItemContainer, ItemTitle } from './components';

export const MailSettings = () => {
	const [ frequency, setFrequency ] = useState<string>('4');
	const onFrequencyChanged = async (option: DropdownOption) => {
		setFrequency(option.value as string);
	};

	return <Fragment>
		<ItemContainer>
			<ItemTitle>Mail Check Frequency</ItemTitle>
			<DropdownItemBody>
				<span>Every</span>
				<Dropdown options={FrequencyOptions} onChange={onFrequencyChanged} value={frequency}/>
			</DropdownItemBody>
		</ItemContainer>
	</Fragment>;
};