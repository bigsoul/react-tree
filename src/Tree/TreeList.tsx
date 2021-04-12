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
import ReactResizeDetector from 'react-resize-detector'

const ListBox = styled.div`
	position: relative;
	width: 400px;
	height: 50%;
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

const Extender = styled.div<{ height: number }>`
	height: ${p => p.height}px;
	background-color: #002e36;
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
	extenderHeight: number
}

const mutationState = { listBoxHeight: 0, scrollOffset: 0 }

class TreeList extends PureComponent<ITreeListProps, ITreeListState> {
	listBoxRef: RefObject<HTMLDivElement>
	resizeObserver: ResizeObserver

	constructor(props: ITreeListProps) {
		super(props)

		this.state = {
			dataListHeight: 0,
			preLoaderUpTop: 0,
			preLoaderDownTop: 0,
			preLoaderUpHeight: 0,
			preLoaderDownHeight: 0,
			extenderHeight: 0,
		}

		this.listBoxRef = createRef()
		this.resizeObserver = new ResizeObserver(
			(entries: ResizeObserverEntry[]) => {
				const entry = entries[0]
				//mutationState.listBoxHeight = entry.contentRect.height
				//this.setState({})
			}
		)

		mutationState.listBoxHeight = 0
		mutationState.scrollOffset = props.scrollOffset + props.loaderUpHeight
	}

	static getDerivedStateFromProps = (props: ITreeListProps) => {
		console.log('TreeList - getDerivedStateFromProps')

		const dataListHeight = props.dataItemHeight * props.dataList.length

		// extender size calculation

		let extenderHeight = 0

		if (dataListHeight < mutationState.listBoxHeight)
			extenderHeight = mutationState.listBoxHeight - dataListHeight

		// preloaders size calculation

		let preLoaderUpHeight = 0
		let preLoaderDownHeight = 0

		if (dataListHeight > mutationState.listBoxHeight) {
			const availableHeights =
				dataListHeight - mutationState.listBoxHeight
			const halfHeight = Math.floor(availableHeights / 2)
			preLoaderUpHeight =
				halfHeight > props.preLoaderUpMaxHeight
					? props.preLoaderUpMaxHeight
					: halfHeight
			preLoaderDownHeight =
				halfHeight > props.preLoaderDownMaxHeight
					? props.preLoaderDownMaxHeight
					: halfHeight
		}

		return {
			dataListHeight: dataListHeight,
			preLoaderUpTop: props.loaderUpHeight,
			preLoaderDownTop:
				props.loaderUpHeight + dataListHeight - preLoaderDownHeight,
			preLoaderUpHeight: preLoaderUpHeight,
			preLoaderDownHeight: preLoaderDownHeight,
			extenderHeight: extenderHeight,
		}
	}

	handlerOnScroll = (scrollTop: number) => {
		console.log('TreeList - handlerOnScroll - ' + scrollTop)

		const { props, state, listBoxRef } = this

		if (scrollTop < state.preLoaderUpTop)
			listBoxRef.current?.scrollTo({
				top: props.loaderUpHeight,
				behavior: 'smooth',
			})

		if (
			scrollTop >
			props.loaderUpHeight +
				state.dataListHeight +
				state.extenderHeight -
				mutationState.listBoxHeight
		)
			listBoxRef.current?.scrollTo({
				top:
					props.loaderUpHeight +
					state.dataListHeight +
					state.extenderHeight -
					mutationState.listBoxHeight,
				behavior: 'smooth',
			})

		mutationState.scrollOffset = scrollTop + props.loaderUpHeight
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

		items.push(
			<Loader
				id='loader-up'
				key='loader-up'
				height={props.loaderUpHeight}
			/>
		)

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

		items.push(
			<Extender
				id='extender'
				key='extender'
				height={state.extenderHeight}
			/>
		)
		items.push(
			<Loader
				id='loader-down'
				key='loader-down'
				height={props.loaderDownHeight}
			/>
		)
		items.push(
			<PreLoader
				id='pre-loader-up'
				key='pre-loader-up'
				height={state.preLoaderUpHeight}
				top={state.preLoaderUpTop}
			/>
		)
		items.push(
			<PreLoader
				id='pre-loader-down'
				key='pre-loader-down'
				height={state.preLoaderDownHeight}
				top={state.preLoaderDownTop}
			/>
		)

		return (
			<ListBox
				onScroll={e => this.handlerOnScroll(e.currentTarget.scrollTop)}
				ref={this.listBoxRef}
				id='tree-list'
			>
				{items}
			</ListBox>
		)
	}

	componentDidMount = () => {
		if (this.listBoxRef.current) {
			mutationState.listBoxHeight = this.listBoxRef.current.clientHeight
			this.listBoxRef.current.scrollTop = mutationState.scrollOffset
			this.resizeObserver.observe(this.listBoxRef.current)
			this.setState({})
		}
	}

	componentWillUnmount = () => {
		if (this.listBoxRef.current)
			this.resizeObserver.unobserve(this.listBoxRef.current)
	}
}

export default TreeList
