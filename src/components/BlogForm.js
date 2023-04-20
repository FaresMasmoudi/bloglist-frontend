import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
	const [title, setTitle] = useState('')
	const [author, setAuthor] = useState('')
	const [url, setUrl] = useState('')

	const addBlog = (event) => {
		event.preventDefault()
		createBlog({
			title: title,
			author: author,
			url: url
		})

		setTitle('')
		setAuthor('')
		setUrl('')
	}

	return (
		<div className="formDiv">
			<form onSubmit={addBlog}>
				<div>
					title:
					<input
						type="text"
						value={title}
						name="title"
						onChange={({ target }) => setTitle(target.value)}
						id='title_input'
					/>
				</div>
				<div>
					author:
					<input
						type="text"
						value={author}
						name="author"
						onChange={({ target }) => setAuthor(target.value)}
						id='author_input'
					/>
				</div>
				<div>
					url:
					<input
						type="text"
						value={url}
						name="url"
						onChange={({ target }) => setUrl(target.value)}
						id='url_input'
					/>
				</div>
				<button id="create-button" type="submit">create</button>
			</form>
		</div>

	)
}

export default BlogForm