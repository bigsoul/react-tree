import React from 'react'
import styled from 'styled-components'

const BranchBox = styled.div`
	width: 400px;
	height: 30px;
	border: 1px solid #ffffff;
	box-sizing: border-box;
	display: flex;
	justify-content: center;
	align-items: center;
`

interface ITreeBranchProps {
	open: boolean
}

const TreeBranch = (props: ITreeBranchProps) => {
	console.log('TreeBranch - render')

	return <BranchBox id='TreeBranch'>branch box</BranchBox>
}

export default TreeBranch
