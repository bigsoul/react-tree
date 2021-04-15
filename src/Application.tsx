import _ from 'lodash'
import React, { useState } from 'react'
import styled from 'styled-components'
import Tools from './Tools'
import Tree from './Tree/Tree'

export interface IDataItem {
	id: number
	name: string
}

const Dummy = styled.div`
	width: 400px;
	height: 40%;
	box-sizing: border-box;
	display: flex;
	justify-content: center;
	align-items: center;
`

const initDataList = () => {
	const result: IDataItem[] = []
	for (let i = 0; i < 1000; i++) result.push({ id: i, name: 'Name #' + i })
	return result
}

const Application = () => {
	console.log('Application - render')

	const [isMounted, setIsMounted] = useState(true)
	const [dataList] = useState<IDataItem[]>(initDataList)
	const [dataOffset, setDataOffset] = useState(0)
	const [dataLimit, setDataLimit] = useState(50)
	const [scrollOffset, setScrollOffset] = useState(150)

	const data = _.slice(dataList, dataOffset, dataOffset + dataLimit)

	return (
		<>
			<Tools
				dataOffset={dataOffset}
				dataLimit={dataLimit}
				onClickMount={() => setIsMounted(true)}
				onClickUnmount={() => setIsMounted(false)}
				onChangeDataOffset={setDataOffset}
				onChangeDataLimit={setDataLimit}
			/>
			{isMounted ? (
				<Tree
					dataList={data}
					dataOffset={dataOffset}
					scrollOffset={scrollOffset}
					onLoadUp={(dataOffset, isPreload) => {
						console.log(
							`LOAD DATA: UP [dataOffset = ${dataOffset}, isPreload = ${isPreload}]`
						)
						setDataOffset(dataOffset - 30)
					}}
					onLoadDown={(dataOffset, isPreload) => {
						console.log(
							`LOAD DATA: DOWN [dataOffset = ${dataOffset}, isPreload = ${isPreload}]`
						)
						setDataOffset(dataOffset + 30)
					}}
					onScroll={setScrollOffset}
				/>
			) : (
				<Dummy>UNMOUNTED</Dummy>
			)}
		</>
	)
}

export default Application
