import {
	createElement,
	ReactNode,
	FunctionComponent,
	createRef,
	PureComponent,
} from 'react'
import styled from 'styled-components'
import { IDataItem } from '../Application'
import { ITreeItemProps } from './TreeItem'

const ListBox = styled.div`
	position: absolute;
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
	pointer-events: none;
`

interface ITreeListProps {
	children: FunctionComponent<ITreeItemProps>
	dataList: IDataItem[]
	dataOffset: number
	dataItemHeight: number
	scrollOffset: number
	preLoaderUpMaxHeight: number
	preLoaderDownMaxHeight: number
	onLoadUp?: (dataOffset: number, isPreload: boolean) => void
	onLoadDown?: (dataOffset: number, isPreload: boolean) => void
	onScroll?: (scrollOffset: number) => void
}

interface ITreeListState {
	dataListHeight: number
	preLoaderUpTop: number
	preLoaderDownTop: number
	preLoaderUpHeight: number
	preLoaderDownHeight: number
}

const mutationState = {
	listBoxHeight: 0,
	scrollOffset: 0,
	scrollStep: 0,
	listBoxRef: createRef<HTMLDivElement>(),
}

class TreeList extends PureComponent<ITreeListProps, ITreeListState> {
	resizeObserver: ResizeObserver

	constructor(props: ITreeListProps) {
		super(props)

		this.state = {
			dataListHeight: 0,
			preLoaderUpTop: 0,
			preLoaderDownTop: 0,
			preLoaderUpHeight: 0,
			preLoaderDownHeight: 0,
		}

		this.resizeObserver = new ResizeObserver(
			(entries: ResizeObserverEntry[]) => {
				const entry = entries[0]
				mutationState.listBoxHeight = Math.round(
					entry.contentRect.height
				)
				this.setState({})
			}
		)

		mutationState.scrollOffset = props.scrollOffset
	}

	static getDerivedStateFromProps = (
		props: ITreeListProps,
		state: ITreeListState
	) => {
		console.log('TreeList - getDerivedStateFromProps')

		const dataListHeight = props.dataItemHeight * props.dataList.length

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

		const preLoaderUpTop = 0
		const preLoaderDownTop = dataListHeight - preLoaderDownHeight

		const { listBoxRef, listBoxHeight } = mutationState

		let scrollTop =
			mutationState.scrollOffset +
			mutationState.scrollStep * props.dataItemHeight * -1

		if (scrollTop < 0) {
			scrollTop = props.scrollOffset
		}

		if (scrollTop >= dataListHeight - listBoxHeight) {
			scrollTop = dataListHeight - listBoxHeight
			if (scrollTop < 0) scrollTop = 0
		}

		if (
			scrollTop > preLoaderUpTop &&
			scrollTop < dataListHeight - listBoxHeight
		) {
			const residual = scrollTop % props.dataItemHeight
			if (residual)
				scrollTop = scrollTop - residual + props.dataItemHeight
		}

		if (dataListHeight === state.dataListHeight) {
			if (scrollTop >= preLoaderUpTop && scrollTop < preLoaderUpHeight) {
				if (mutationState.scrollOffset - scrollTop > 0) {
					if (props.onLoadUp)
						setTimeout(props.onLoadUp, 0, props.dataOffset, true)
				}
			}

			if (
				scrollTop + mutationState.listBoxHeight > preLoaderDownTop &&
				scrollTop + mutationState.listBoxHeight <=
					preLoaderDownTop + preLoaderDownHeight
			)
				if (mutationState.scrollOffset - scrollTop < 0) {
					if (props.onLoadDown)
						setTimeout(props.onLoadDown, 0, props.dataOffset, true)
				}
		}

		if (listBoxRef.current) listBoxRef.current.scrollTop = scrollTop

		mutationState.scrollOffset = scrollTop
		mutationState.scrollStep = 0

		return {
			dataListHeight: dataListHeight,
			preLoaderUpTop: preLoaderUpTop,
			preLoaderDownTop: preLoaderDownTop,
			preLoaderUpHeight: preLoaderUpHeight,
			preLoaderDownHeight: preLoaderDownHeight,
		}
	}

	handlerOnScroll = (scrollTop: number) => {
		//console.log('TreeList - handlerOnScrollStop')

		let scroll = mutationState.scrollOffset - scrollTop

		if (scroll === 0) return
		if (scroll > 0) scroll = 1
		if (scroll < 0) scroll = -1

		mutationState.scrollStep += scroll

		this.setState({})
	}

	handlerOnWheel = (deltaY: number) => {
		//console.log('TreeList - handlerOnWheel: ', deltaY)

		const { props, state } = this

		if (mutationState.scrollOffset === 0 && deltaY < 0)
			if (props.onLoadUp)
				setTimeout(props.onLoadUp, 0, props.dataOffset, false)

		if (
			mutationState.scrollOffset >=
				state.dataListHeight - mutationState.listBoxHeight &&
			deltaY > 0
		)
			if (props.onLoadDown)
				setTimeout(props.onLoadDown, 0, props.dataOffset, false)
	}

	render = () => {
		console.log('TreeList - render')

		const { props, state } = this

		const items: ReactNode[] = []

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
				onWheel={e => this.handlerOnWheel(e.deltaY)}
				ref={mutationState.listBoxRef}
				id='tree-list'
			>
				{items}
			</ListBox>
		)
	}

	componentDidMount = () => {
		if (mutationState.listBoxRef.current) {
			mutationState.listBoxHeight = Math.round(
				mutationState.listBoxRef.current.clientHeight
			)

			mutationState.listBoxRef.current.scrollTop =
				mutationState.scrollOffset

			this.resizeObserver.observe(mutationState.listBoxRef.current)
			this.setState({})
		}
	}

	componentWillUnmount = () => {
		if (mutationState.listBoxRef.current)
			this.resizeObserver.unobserve(mutationState.listBoxRef.current)
		if (this.props.onScroll)
			setTimeout(this.props.onScroll, 0, mutationState.scrollOffset)
	}
}

export default TreeList
