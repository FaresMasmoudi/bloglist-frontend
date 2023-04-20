/* eslint-disable no-unused-vars */
/* eslint-disable no-mixed-spaces-and-tabs */
import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const Notification = ({ message, notifType }) => {
	if (message === null) {
		return null
	}

	else if (notifType === 'success')
		return (
			<div className='success'>
				{message}
			</div>
		)
	else
		return (
			<div className='error'>
				{message}
			</div>
		)
}

const App = () => {
	const [blogs, setBlogs] = useState([])
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [user, setUser] = useState(null)
	const [notifMessage, setNotifMessage] = useState(null)
	const [notifType, setNotifType] = useState('')

	const blogFormRef = useRef()

	useEffect(() => {
		blogService.getAll().then(blogs =>
			setBlogs( blogs )
		)
	}, [])

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			setUser(user)
			blogService.setToken(user.token)
		}
	}, [])

	const handleLogin = async (event) => {
		event.preventDefault()

		try {
			const user = await loginService.login({
				username, password,
			})

			window.localStorage.setItem(
				'loggedBlogappUser', JSON.stringify(user)
			)

			blogService.setToken(user.token)
			setUser(user)
			setUsername('')
			setPassword('')
		} catch (exception) {
			setNotifMessage('wrong username or password')
			setNotifType('error')
			setTimeout(() => {
				setNotifMessage(null)
				setNotifType('')
			}, 5000)
		}
	}

	const handleLogout = () => {
		setUser(null)
		window.localStorage.removeItem('loggedNoteappUser')
	}

	const loginForm = () => (
		<form onSubmit={handleLogin}>
			<div>
        username
				<input
					id='username'
					type="text"
					value={username}
					name="Username"
					onChange={({ target }) => setUsername(target.value)}
				/>
			</div>
			<div>
        password
				<input
					id='password'
					type="password"
					value={password}
					name="Password"
					onChange={({ target }) => setPassword(target.value)}
				/>
			</div>
			<button id="login-button" type="submit">login</button>
		</form>
	)

	const addBlog = (blogObject) => {
		blogFormRef.current.toggleVisibility()
		blogService
			.create(blogObject)
			.then(returnedBlog => {
				console.log(returnedBlog)
				console.log(returnedBlog.user.username)
				setBlogs(blogs.concat(returnedBlog))
				setNotifMessage(`A new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
				setNotifType('success')
				setTimeout(() => {
					setNotifMessage(null)
					setNotifType('')
				}, 5000)
			})
	}

	const increaseLikes = id => {
		const blog = blogs.find(n => n.id === id)
		const changedBLog = { ...blog, likes: blog.likes+1 }

		blogService
			.update(id, changedBLog).then(returnedBlog => {
				setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
			})
			.catch(error => {
				setNotifMessage(
					`Blog '${blog.id}' was already removed from server`
				)
				setNotifType('error')
				setTimeout(() => {
					setNotifMessage(null)
				}, 5000)
				setBlogs(blogs.filter(b => b.id !== id))
			})
	}

	const deleteBlog = blog => {
		if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
			blogService
				.remove(blog.id).then(response => {
					setBlogs(blogs.filter(n => n.id !== blog.id))
				})
				.catch(error => {
					setNotifMessage(
						'Removal unsuccessful'
					)
					setNotifType('error')
					setTimeout(() => {
						setNotifMessage(null)
					}, 5000)
				})
		}
	}

	const sortByLikes = (blogs) => {
		const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
		console.log(sortedBlogs)
		setBlogs(sortedBlogs)
	}
	return (
		<div>
			<h2>blogs</h2>
			<Notification message={notifMessage} notifType = {notifType} />
			{!user && loginForm()}
			{user &&
      <div>
      	<p>{user.name} logged in</p>
      	<button onClick={handleLogout}>logout</button>
      	<h2>create new</h2>
      	<Togglable buttonLabel='new blog' ref={blogFormRef}>
      		<BlogForm createBlog={addBlog} />
      	</Togglable>
      	<button onClick={() => sortByLikes(blogs)}>Sort by likes</button>
      	{blogs.map(blog => <Blog key={blog.id} blog={blog} user={user} increaseLikes={increaseLikes} deleteBlog={deleteBlog} />)}
      </div>
			}
		</div>
	)
}

export default App