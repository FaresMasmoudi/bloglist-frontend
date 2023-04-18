import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
	let container
	let blog
	let user

	beforeEach(() => {
		blog = {
			title: 'elhob kweni yama xD',
			author: 'cheb samir',
			url: 'elhob.blog',
			likes: 12,
			user: {
				username: 'amirhammami'
			}
		}

		user = {
			username: 'amirhammami'
		}

	})

	test('at start likes and url are not displayed', () => {
		container = render(<Blog blog={blog} user={user}/>).container
		const div = container.querySelector('.fullBlog')
		expect(div).toHaveStyle('display: none')
	})

	test('after clicking the button, the full blog is displayed', async () => {
		container = render(<Blog blog={blog} user={user}/>).container
		const user1 = userEvent.setup()
		const button1 = screen.getByText('view')
		await user1.click(button1)

		const div = container.querySelector('.fullBlog')
		expect(div).not.toHaveStyle('display: none')
	})

	test('clicking the button calls event handler twice', async () => {

		const mockHandler = jest.fn()

		render(<Blog blog={blog} user={user} increaseLikes={mockHandler}/>)

		const user2 = userEvent.setup()
		const button2 = screen.getByText('like')
		await user2.click(button2)
		await user2.click(button2)

		expect(mockHandler.mock.calls).toHaveLength(2)
	})
})
