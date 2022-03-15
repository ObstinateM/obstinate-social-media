describe('Comment', () => {
    it('should go to comment page', () => {
        cy.get(':nth-child(3) > .action > a > img').click();
    });

    it('should post a comment', () => {
        cy.get(':nth-child(3) > .action > a > img').click();
        cy.get('textarea').type('Youhou');
        cy.get('.comment-button').click();
        cy.get(':nth-child(2) > .post-top > .content > .content-text').contains('Youhou');
    });

    it('should delete the comment', () => {
        cy.get(':nth-child(3) > .action > a > img').click();
        cy.get(':nth-child(2) > .action > button').click();
        cy.get('.no-comment').should('exist');
    });
});
