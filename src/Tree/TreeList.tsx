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

const Loader = styled.div<{ height: number }>`
	height: ${p => p.height}px;
	box-sizing: border-box;
	background-color: #2b2e08;
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

const mutationState = {
	listBoxHeight: 0,
	scrollOffset: 0,
	scrollStep: 0,
	listBoxRef: createRef<HTMLDivElement>(),
}

class TreeList extends PureComponent<ITreeListProps, ITreeListState> {
	resizeObserver: ResizeObserver
	scrollingTimeout: NodeJS.Timeout | undefined

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

		this.resizeObserver = new ResizeObserver(
			(entries: ResizeObserverEntry[]) => {
				const entry = entries[0]
				mutationState.listBoxHeight = Math.round(
					entry.contentRect.height
				)
				this.setState({})
			}
		)

		mutationState.scrollOffset = props.scrollOffset + props.loaderUpHeight
	}

	static getDerivedStateFromProps = (
		props: ITreeListProps,
		state: ITreeListState
	) => {
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

		const preLoaderUpTop = props.loaderUpHeight
		const preLoaderDownTop =
			props.loaderUpHeight + dataListHeight - preLoaderDownHeight

		//---

		const { listBoxRef, listBoxHeight } = mutationState

		let scrollTop =
			mutationState.scrollOffset +
			mutationState.scrollStep * props.dataItemHeight * -1

		if (scrollTop < preLoaderUpTop) {
			scrollTop = props.loaderUpHeight
		}

		if (
			scrollTop >
			props.loaderUpHeight +
				dataListHeight +
				extenderHeight -
				listBoxHeight
		) {
			scrollTop =
				props.loaderUpHeight +
				dataListHeight +
				extenderHeight -
				listBoxHeight
		}

		/*if (dataListHeight !== state.dataListHeight)
			scrollTop =
				mutationState.scrollOffset -
				(dataListHeight - state.dataListHeight)*/

		if (listBoxRef.current) listBoxRef.current.scrollTop = scrollTop

		/*if (listBoxRef.current)
			listBoxRef.current.scrollTo({
				top: mutationState.scrollOffset,
				behavior: 'smooth',
			})*/

		mutationState.scrollOffset = scrollTop
		mutationState.scrollStep = 0

		//---

		return {
			dataListHeight: dataListHeight,
			preLoaderUpTop: preLoaderUpTop,
			preLoaderDownTop: preLoaderDownTop,
			preLoaderUpHeight: preLoaderUpHeight,
			preLoaderDownHeight: preLoaderDownHeight,
			extenderHeight: extenderHeight,
		}
	}

	handlerOnScroll = (scrollTop: number) => {
		//console.log('TreeList - handlerOnScrollStop')

		let scroll = mutationState.scrollOffset - scrollTop

		if (scroll > 0) scroll = 1
		if (scroll < 0) scroll = -1
		if (scroll === 0) return

		mutationState.scrollStep += scroll

		this.setState({})
	}

	handlerOnWheel = (deltaY: number) => {
		const { state } = this

		if (mutationState.scrollOffset !== 0 && deltaY < 0) return
		if (
			mutationState.scrollOffset <
				state.dataListHeight - mutationState.listBoxHeight &&
			deltaY > 0
		)
			return

		//console.log('TreeList - handlerOnWheel: ', deltaY)

		if (deltaY > 0) {
			console.log('LOAD DATA: DOWN')
		} else {
			console.log('LOAD DATA: UP')
		}
	}

	render = () => {
		console.log('TreeList - render')

		const { props, state } = this

		const items: ReactNode[] = []

		/*items.push(
			<Loader
				id='loader-up'
				key='loader-up'
				height={props.loaderUpHeight}
			/>
		)*/

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

		/*items.push(
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
		)*/

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

			/*mutationState.listBoxRef.current.scrollTo({
				top: mutationState.scrollOffset,
			})*/

			this.resizeObserver.observe(mutationState.listBoxRef.current)
			this.setState({})
		}
	}

	componentWillUnmount = () => {
		if (mutationState.listBoxRef.current)
			this.resizeObserver.unobserve(mutationState.listBoxRef.current)
	}
}

export default TreeList
