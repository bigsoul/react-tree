import React from 'react'
import TreeList from './TreeList'
import TreeItem, { ITreeItemProps } from './TreeItem'
import TreeBranch from './TreeBranch'
import styled from 'styled-components'

const TreeStyled = styled.div`
	position: relative;
	height: 50%;
`

interface ITreeProps {
	dataList: { id: number; name: string }[]
	dataOffset: number
	scrollOffset: number
	onScroll: (scrollOffset: number) => void
}

const Tree = (props: ITreeProps) => {
	console.log('Tree - render')

	return (
		<TreeStyled id='tree'>
			<TreeBranch open={true} />
			<TreeList
				dataList={props.dataList}
				dataOffset={props.dataOffset}
				scrollOffset={props.scrollOffset}
				dataItemHeight={30}
				preLoaderUpMaxHeight={150}
				preLoaderDownMaxHeight={150}
				onLoadUp={(dataOffset, isPreload) =>
					console.log(
						`LOAD DATA: UP [dataOffset = ${dataOffset}, isPreload = ${isPreload}]`
					)
				}
				onLoadDown={(dataOffset, isPreload) =>
					console.log(
						`LOAD DATA: DOWN [dataOffset = ${dataOffset}, isPreload = ${isPreload}]`
					)
				}
				onScroll={props.onScroll}
			>
				{(props: ITreeItemProps) => (
					<TreeItem>
						<div id='my-content'>{props.dataItem.name}</div>

						<button>1</button>
						<button>2</button>
					</TreeItem>
				)}
			</TreeList>
		</TreeStyled>
	)
}

export default Tree
