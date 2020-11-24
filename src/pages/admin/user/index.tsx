import React from "react";
import { NarrowPageTitle } from '../../component/console/narrow-page-title';
import { PlainNarrowContainer } from '../../component/console/page-container';

export const Users = () => {
	return <PlainNarrowContainer>
		<NarrowPageTitle title='Users'/>
		<div style={{ marginTop: 50, fontSize: '2em', opacity: 0.5 }}>
			Coming soon...
		</div>
	</PlainNarrowContainer>;
};