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

	let data = _.slice(dataList, dataOffset, dataOffset + dataLimit)

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
					dataLimit={dataLimit}
					scrollOffset={scrollOffset}
					onLoadUp={(dataOffset: number, dataLimit: number) => {
						console.debug(
							`LOAD DATA: UP [dataOffset = ${dataOffset}, dataLimit = ${dataLimit}, dataLength = ${data.length}]`
						)
						setDataOffset(dataOffset)
						setDataLimit(dataLimit)
					}}
					onLoadDown={(dataOffset: number, dataLimit: number) => {
						console.debug(
							`LOAD DATA: DOWN [dataOffset = ${dataOffset}, dataLimit = ${dataLimit}, dataLength = ${data.length}]`
						)
						let _dataOffset = dataOffset
						if (dataList.length < dataOffset + dataLimit)
							_dataOffset = dataList.length - dataLimit
						setDataOffset(_dataOffset)
						setDataLimit(dataLimit)
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
