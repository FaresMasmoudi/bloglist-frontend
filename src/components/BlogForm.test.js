import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
	const addBlog = jest.fn()
	const user = userEvent.setup()

	const { container } = render(<BlogForm createBlog={addBlog} />)

	const title_input = container.querySelector('#title_input')
	const author_input = container.querySelector('#author_input')
	const url_input = container.querySelector('#url_input')

	const sendButton = screen.getByText('create')

	await user.type(title_input, 'adding title')
	await user.type(author_input, 'adding author')
	await user.type(url_input, 'adding url')

	await user.click(sendButton)
	console.log(addBlog.mock.calls)
	expect(addBlog.mock.calls).toHaveLength(1)
	expect(addBlog.mock.calls[0][0].title).toBe('adding title')
	expect(addBlog.mock.calls[0][0].author).toBe('adding author')
	expect(addBlog.mock.calls[0][0].url).toBe('adding url')
})