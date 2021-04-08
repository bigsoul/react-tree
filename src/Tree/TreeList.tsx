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
	PureComponent,
} from 'react'
import { ReactElementType } from 'react-window'
import styled from 'styled-components'
import { IDataItem } from '../Application'
import TreeItem, { ITreeItemProps } from './TreeItem'

const ListBox = styled.div`
	position: relative;
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

const Loader = styled.div<{ height: number }>`
	height: ${p => p.height}px;
	box-sizing: border-box;
	background-color: #2b2e08;
	display: flex;
	justify-content: center;
	align-items: center;
`

const PreLoader = styled.div<{ top: number; height: number }>`
	position: absolute;
	top: ${p => p.top}px;
	left: 0px;
	height: ${p => p.height}px;
	width: 100%;
	background: rgba(166, 89, 160, 0.2);
	display: flex;
	justify-content: center;
	align-items: center;
`

interface ITreeListProps {
	children: FunctionComponent<ITreeItemProps>
	dataList: IDataItem[]
	dataOffset: number
	dataItemHeight: number
	scrollOffset: number
	loaderUpHeight: number
	loaderDownHeight: number
	preLoaderUpMaxHeight: number
	preLoaderDownMaxHeight: number
}

interface ITreeListState {
	dataListHeight: number
	preLoaderUpTop: number
	preLoaderDownTop: number
	preLoaderUpHeight: number
	preLoaderDownHeight: number
}

const MutationState = { listBoxHeight: 0, scrollOffset: 0 }

class TreeList extends PureComponent<ITreeListProps, ITreeListState> {
	listBoxRef: RefObject<HTMLDivElement>
	listBoxHeight: number
	scrollOffset: number

	constructor(props: ITreeListProps) {
		super(props)

		this.state = {
			dataListHeight: 0,
			preLoaderUpTop: 0,
			preLoaderDownTop: 0,
			preLoaderUpHeight: 0,
			preLoaderDownHeight: 0,
		}

		this.listBoxRef = createRef()
		this.listBoxHeight = 0
		this.scrollOffset = props.scrollOffset + props.loaderUpHeight
	}

	static getDerivedStateFromProps = (props: ITreeListProps) => {
		console.log('TreeList - getDerivedStateFromProps')

		const dataListHeight = props.dataItemHeight * props.dataList.length

		return {
			dataListHeight: dataListHeight,
			preLoaderUpTop: props.loaderUpHeight,
			preLoaderDownTop:
				props.loaderUpHeight +
				dataListHeight -
				props.preLoaderDownMaxHeight,
			preLoaderUpHeight: props.preLoaderUpMaxHeight,
			preLoaderDownHeight: props.preLoaderDownMaxHeight,
		}
	}

	handlerOnScroll = (scrollTop: number) => {
		console.log('TreeList - handlerOnScroll')

		this.scrollOffset = scrollTop + this.props.loaderUpHeight
		this.setState({})
	}

	handlerOnResize = (height: number) => {
		console.log('TreeList - handlerOnResize')

		this.setState({})
	}

	render = () => {
		console.log('TreeList - render')

		const { props, state } = this

		const items: ReactNode[] = []

		items.push(<Loader key='loader-up' height={props.loaderUpHeight} />)

		for (let i = 0; i < props.dataList.length; i++) {
			const dataItem = props.dataList[i]
			items.push(
				createElement<ITreeItemProps>(props.children, {
					key: dataItem.id,
					index: i,
					dataItem: dataItem,
				})
			)
		}

		items.push(<Loader key='loader-down' height={props.loaderDownHeight} />)

		items.push(
			<PreLoader
				key='pre-loader-up'
				height={state.preLoaderUpHeight}
				top={state.preLoaderUpTop}
			/>
		)
		items.push(
			<PreLoader
				key='pre-loader-down'
				height={state.preLoaderDownHeight}
				top={state.preLoaderDownTop}
			/>
		)

		return (
			<ListBox
				onScroll={e => this.handlerOnScroll(e.currentTarget.scrollTop)}
				ref={this.listBoxRef}
				id='TreeList'
			>
				{items}
			</ListBox>
		)
	}

	componentDidMount = () => {
		if (this.listBoxRef.current) {
			this.listBoxHeight = this.listBoxRef.current.clientHeight
			this.listBoxRef.current.scrollTop = this.scrollOffset
		}
		this.setState({})
	}
}

export default TreeList
