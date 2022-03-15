import 'cypress-localstorage-commands';

describe('Post', () => {
    it('create a new post', () => {
        cy.get('.create-button').click();
        cy.get('textarea').type('Super post !!');
        cy.get('.submit-button').click();
        cy.get(':nth-child(3) > .post-top > .content > .content-title').contains('Mathis Beauville');
        cy.get(':nth-child(3) > .post-top > .content > .content-text').contains('Super post !!');
    });

    it('should can delete the post', () => {
        cy.get(':nth-child(3) > .action > :nth-child(2)').click();
    });
});
