describe('Note ', function () {
	beforeEach(function () {
		cy.visit('')
		cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
		const user = {
			name: 'Racem Cherni',
			username: 'racemcherni',
			password: 'racemracouma'
		}
		const user2 = {
			name: 'Dhiaa Ben Hamadou',
			username: 'dhiaabenhamadou',
			password: 'dhiaadhiaa'
		}
		cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
		cy.request('POST', `${Cypress.env('BACKEND')}/users`, user2)
	})

	it('Login form is shown', function () {
		cy.contains('username')
		cy.contains('password')
		cy.contains('login')
	})

	describe('Login', function () {
		it('succeeds with correct credentials', function () {
			cy.get('#username').type('racemcherni')
			cy.get('#password').type('racemracouma')
			cy.get('#login-button').click()

			cy.contains('Racem Cherni logged in')
		})

		it('fails with wrong credentials', function () {
			cy.get('#username').type('racemcherni')
			cy.get('#password').type('wrongpass')
			cy.get('#login-button').click()

			cy.get('.error')
				.should('contain', 'wrong username or password')
				.and('have.css', 'color', 'rgb(255, 0, 0)')
				.and('have.css', 'border-style', 'solid')

			cy.get('html').should('not.contain', 'Racem Cherni logged in')
		})
	})

	describe('when logged in', function () {
		beforeEach(function () {
			cy.login({ username: 'racemcherni', password: 'racemracouma' })
		})

		it('A blog can be created', function () {
			cy.contains('new blog').click()
			cy.get('#title_input').type('new blog created by cypress')
			cy.get('#author_input').type('cypress team')
			cy.get('#url_input').type('cypress.blog')
			cy.get('#create-button').click()
			cy.contains('new blog created by cypress')
		})

		describe('and several blogs exist (3 by user1, 1 by user2)', function () {
			beforeEach(function () {
				cy.createBlog({ title: 'test blog 1', author: 'no 1', url: 'test1.blog' })
				cy.createBlog({ title: 'test blog 2', author: 'no 2', url: 'test2.blog' })
				cy.createBlog({ title: 'test blog 3', author: 'no 3', url: 'test3.blog' })
			})

			it('one of those can be liked', function () {
				cy.contains('test blog 2').contains('view').click().parent().parent().contains('like').click()
				cy.contains('1 likes')
			})

			it('one of those can be deleted', function () {
				cy.contains('test blog 3').contains('view').click().parent().parent().contains('delete').click()
				cy.get('html').should('not.contain', 'test blog 3')
			})

			it('only blog created by user2 can be deleted', function () {
				cy.contains('logout').click()
				cy.login({ username: 'dhiaabenhamadou', password: 'dhiaadhiaa' })
				cy.createBlog({ title: 'test blog 4', author: 'no 4', url: 'test4.blog' })
				cy.contains('test blog 3').contains('view').click().parent().parent().should('not.contain', 'delete')
				cy.contains('test blog 4').contains('view').click().parent().parent().should('contain', 'delete')
			})

			it('blogs are ordered by likes', function () {

				cy.contains('test blog 1').contains('view').click().parent().parent().contains('like').click()
				cy.contains('test blog 2').contains('view').click().parent().parent().contains('like').click().wait(500).click()
				cy.contains('test blog 3').contains('view').click().parent().parent().contains('like').click().wait(500).click().wait(500).click().wait(500)

				cy.contains('Sort by likes').click()

				cy.get('.blog').eq(0).should('contain', 'test blog 3')
				cy.get('.blog').eq(1).should('contain', 'test blog 2')
				cy.get('.blog').eq(2).should('contain', 'test blog 1')
			})

		})
	})
})