describe('Blog app', function() {

  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Akos Dabasi',
      username: 'akosdabasi',
      password: 'root'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user) 
    cy.visit('http://localhost:5173')
  })

  it('front page can be opened', function() {
    cy.contains('Hello there!')
  })

  it('user can log in', function() {
    cy.contains('sign in').click()
    cy.get('#username').type('akosdabasi')
    cy.get('#password').type('root')
    cy.get('#signin').click()

    cy.contains('Akos Dabasi')
  })

  it('login fails with wrong credentials', function() {
    cy.contains('sign in').click()
    cy.get('#username').type('akosdabasi')
    cy.get('#password').type('root1')
    cy.get('#signin').click()

    cy.get('.error')
    .should('contain', 'wrong password or username')
    .and('have.css', 'color', 'rgb(255, 0, 0)')
    .and('have.css', 'border-style', 'solid')

    cy.get('html').should('not.contain', 'Hello Akos Dabasi!')
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({username: 'akosdabasi', password: 'root'});
    })

    it('a new blog can be created', function() {
      cy.get('button').contains('new blog').click()
      cy.get('#title-input').type('a blog created by cypress')
      cy.get('#url-input').type('cypress.url')
      cy.contains('save').click()

      cy.contains('a blog created by cypress')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({title: 'another cypress blog',url: 'cyp.url'})
      })

      it('is visible on the page', function() {
        cy.contains('another cypress blog')
      })
    })
  })
})