import styled from 'styled-components'

const Item = styled.div`
	height: 30px;
	box-sizing: border-box;
	border: 1px solid #46bd50;
	display: flex;
	justify-content: center;
	align-items: center;
`

export interface ITreeItemProps {
	index: number
	dataItem: { id: number; name: string }
}

interface ITreeItemPrivateProps {
	children: React.ReactNode
}

const TreeItem = (props: ITreeItemPrivateProps) => {
	return <Item id='TreeItem'>{props.children}</Item>
}

export default TreeItem
