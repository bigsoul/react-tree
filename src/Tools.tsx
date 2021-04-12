import { ChangeEvent, FormEvent, useState } from 'react'
import styled from 'styled-components'

const ToolsStyled = styled.div`
	width: 400px;
	height: 100px;
	margin-bottom: 100px;
	border: 1px solid white;
	box-sizing: border-box;
	display: flex;
	justify-content: center;
	align-items: center;
`
const ButtonMount = styled.button`
	margin-left: 10px;
	margin-right: 10px;
`
const Column = styled.div`
	width: 50%;
`
const ButtonUnmount = styled.button``
const InputDataOffset = styled.input``
const InputDataLimit = styled.input``

interface IToolsProps {
	dataOffset: number
	dataLimit: number
	onClickMount: () => void
	onClickUnmount: () => void
	onChangeDataOffset: (value: number) => void
	onChangeDataLimit: (value: number) => void
}

const Tools = (props: IToolsProps) => {
	console.log('Tools - render')

	const [dataOffset, setDataOffset] = useState(props.dataOffset)
	const [dataLimit, setDataLimit] = useState(props.dataLimit)

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		props.onChangeDataOffset(dataOffset)
		props.onChangeDataLimit(dataLimit)
	}

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const name = event.target.name
		const value = +event.target.value || 0

		if (name === 'data-offset') setDataOffset(value)
		if (name === 'data-limit') setDataLimit(value)
	}

	return (
		<ToolsStyled id='tools'>
			<Column>
				<ButtonMount onClick={props.onClickMount}>MOUNT</ButtonMount>
				<ButtonUnmount onClick={props.onClickUnmount}>
					UNMOUNT
				</ButtonUnmount>
			</Column>
			<Column>
				<form onSubmit={handleSubmit}>
					<InputDataOffset
						name='data-offset'
						placeholder='Offset data'
						value={dataOffset}
						onChange={handleChange}
					/>
					<InputDataLimit
						name='data-limit'
						placeholder='Limit data'
						value={dataLimit}
						onChange={handleChange}
					/>
					<input type='submit' value='Apply' />
				</form>
			</Column>
		</ToolsStyled>
	)
}

export default Tools
