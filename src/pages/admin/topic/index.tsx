import React, { useEffect, useRef } from "react";
import styled from 'styled-components';
import { NarrowPageTitle } from '../../component/console/narrow-page-title';
import { PlainNarrowContainer } from '../../component/console/page-container';
import Input from '../../component/input';

const Main = styled.div`
	display: flex;
	flex-direction: column;
	margin-top: 50px;
`;
const Search = styled(Input)`
	border-radius: 0;
	border-top: 0;
	border-left: 0;
	border-right: 0;
	padding-left: 0;
	padding-right: 0;
	font-size: 1.4em;
`;

export const Topics = () => {
	const searchRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (searchRef.current) {
			searchRef.current.focus();
		}
	}, [ searchRef ]);

	return <PlainNarrowContainer>
		<NarrowPageTitle title='Topics'/>
		<Main>
			<Search placeholder='Search by topic name, factor name, description, etc.'
			        ref={searchRef}/>
		</Main>
	</PlainNarrowContainer>;
};