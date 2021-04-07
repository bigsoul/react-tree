import {
	createElement,
	cloneElement,
	Component,
	ReactNode,
	ReactChild,
	ReactInstance,
	ReactText,
	ReactChildren,
	ReactElement,
	ReactComponentElement,
	ReactHTML,
	FunctionComponent,
	ReactFragment,
	ReactPortal,
	createRef,
	RefObject,
} from 'react'
import { ReactElementType } from 'react-window'
import styled from 'styled-components'
import { IDataItem } from '../Application'
import TreeItem, { ITreeItemProps } from './TreeItem'

const ListBox = styled.div`
	width: 400px;
	height: 500px;
	border: 1px solid white;
	box-sizing: border-box;
	overflow-y: scroll;
	&::-webkit-scrollbar {
		width: 0px;
	}
	scrollbar-width: none;
`

const Loader = styled.div`
	height: 150px;
	box-sizing: border-box;
	background-color: #bfc564;
	display: flex;
	justify-content: center;
	align-items: center;
`

interface ITreeListProps {
	children: FunctionComponent<ITreeItemProps>
	dataList: IDataItem[]
	dataOffset: number
	scrollOffset: number
}

interface ITreeListState {
	dataOffset: number
}

class TreeList extends Component<ITreeListProps, ITreeListState> {
	constructor(props: ITreeListProps) {
		super(props)

		this.state = { ...this.state, dataOffset: 0 }

		this.listBoxRef = createRef()
	}

	listBoxRef: RefObject<HTMLDivElement>

	render = () => {
		const items: ReactNode[] = []

		items.push(<Loader />)

		for (let i = 0; i < this.props.dataList.length; i++) {
			const dataItem = this.props.dataList[i]
			items.push(
				createElement<ITreeItemProps>(this.props.children, {
					key: dataItem.id,
					index: i,
					dataItem: dataItem,
				})
			)
		}

		items.push(<Loader />)

		return (
			<ListBox ref={this.listBoxRef} id='TreeList'>
				{items}
			</ListBox>
		)
	}

	componentDidMount = () => {
		if (this.listBoxRef.current)
			this.listBoxRef.current.scrollTop = this.props.scrollOffset
	}
}

export default TreeList
