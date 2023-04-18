import { useState } from 'react'

const Blog = ({ blog, user, increaseLikes, deleteBlog }) => {

	const blogStyle = {
		paddingTop: 10,
		paddingLeft: 2,
		border: 'solid',
		borderWidth: 1,
		marginBottom: 5
	}

	const [moreVisible, setMoreVisible] = useState(false)

	const hideWhenVisible = { display: moreVisible ? 'none' : '' }
	const showWhenVisible = { display: moreVisible ? '' : 'none' }



	return (
		<div style = {blogStyle}>
			<div style={hideWhenVisible}>
				{blog.title} {blog.author}
				<button onClick={() => setMoreVisible(true)}>view</button>
			</div>
			<div style={showWhenVisible} className="fullBlog">
				<p>{blog.title} {blog.author}</p>
				<p>{blog.url}</p>
				<p>{blog.likes}<button onClick={() => increaseLikes(blog.id)}>like</button></p>
				<p>{blog.user.username || user.username}</p>
				<button onClick={() => setMoreVisible(false)}>hide</button>
				{user.username === blog.user.username &&
          <button onClick={() => deleteBlog(blog)}>delete</button>
				}
			</div>
		</div>
	)
}

export default Blog