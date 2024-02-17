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

  it('shows login page', function() {
    cy.contains('Hello there!')
    cy.get('button').contains('sign in')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function() {
      cy.contains('sign in').click()
      cy.get('#username').type('akosdabasi')
      cy.get('#password').type('root')
      cy.get('#signin').click()
  
      cy.contains('Akos Dabasi')
    })
  
    it('fails with wrong credentials', function() {
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

      it('can be expanded', function() {
        cy.get('.blogItem').find('button').first().as('viewButton').click()
        cy.contains('cyp.url')
        cy.get('@viewButton').contains('hide')
      })

      it('can be liked', function() {
        cy.get('.blogItem').find('button').first().as('viewButton').click()
        cy.get('.blogItem').find('button').contains('like').click()
        cy.get('.likesField').contains('1')
      })

      it('can be deleted', function() {
        cy.get('.blogItem').find('button').contains('delete').click()
        cy.get('.blogItem').should('not.exist')
      })
    })
    describe('and multiple blogs exists', function () {
      beforeEach(function () {
        cy.createBlog({title: 'another cypress blog',url: 'cyp.url'})
        cy.createBlog({title: 'another cypress blog',url: 'cyp.url'})
        //create blog with different account
        const user = {
          name: 'Gergö Sisak',
          username: 'gergosisak',
          password: 'root'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user)
        cy.login(user)
        cy.createBlog({title: 'another cypress blog',url: 'cyp.url'})
      })
      it('multiple blogs are visible', function() {
        cy.get('.blogItem').should('have.length', 3)
      })
      it('can not delete other user\'s blogs', function() {
        cy.get('.blogItem').filter(':contains("by Akos Dabasi")').contains('delete').should('not.exist')
        cy.get('.blogItem').filter(':contains("by Gergö Sisak")').contains('delete')
      })
      it('sorts blogs based on likes', function() {
        //expand all blogs
        cy.get('.blogItem').find('button').filter(':contains("view")').each($el =>
          {
            cy.wrap($el).click()
          })
        //increase likes
        cy.get('.blogItem').eq(0).find('button').contains('like').as('likeButton1')
        cy.get('.blogItem').eq(0).find('.likesField').as('likes1')
        cy.get('.blogItem').eq(1).find('button').contains('like').as('likeButton2')
        cy.get('.blogItem').eq(1).find('.likesField').as('likes2')
        cy.get('.blogItem').eq(2).find('button').contains('like').as('likeButton3')
        cy.get('.blogItem').eq(2).find('.likesField').as('likes3')

        cy.get('@likeButton1').click()
        cy.get('@likes1').should('contain.text', '1')
        cy.get('@likeButton2').click()
        cy.get('@likes2').should('contain.text', '1')
        cy.get('@likeButton3').click()
        cy.get('@likes3').should('contain.text', '1')
        cy.get('@likeButton3').click()
        //reference will change, probably would be better to use a unique id
        cy.get('@likes1').should('contain.text', '2')
        cy.get('.blogItem').first().contains('by Gergö Sisak')
        


      })
    })
  })
})