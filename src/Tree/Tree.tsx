import React from 'react'
import TreeList from './TreeList'
import TreeItem, { ITreeItemProps } from './TreeItem'
import TreeBranch from './TreeBranch'

interface ITreeProps {
	dataList: { id: number; name: string }[]
	dataOffset: number
	scrollOffset: number
	onScroll: (scrollOffset: number) => void
}

const Tree = (props: ITreeProps) => {
	console.log('Tree render')

	return (
		<div id='Tree'>
			<TreeBranch open={true} />
			<TreeList
				dataList={props.dataList}
				dataOffset={props.dataOffset}
				scrollOffset={props.scrollOffset}
			>
				{(props: ITreeItemProps) => (
					<TreeItem>
						<div id='my-content'>{props.dataItem.name}</div>
					</TreeItem>
				)}
			</TreeList>
		</div>
	)
}

export default Tree
