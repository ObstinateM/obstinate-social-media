describe('Like', () => {
    it('should be able to like a post', () => {
        cy.get(':nth-child(3) > .action > :nth-child(3) > img').click();
        cy.get(':nth-child(3) > .action > .nbLikes > p').contains('1');
    });

    it('should be able to dislike a post', () => {
        cy.get(':nth-child(3) > .action > :nth-child(3) > img').click();
        cy.get(':nth-child(3) > .action > .nbLikes > p').contains('0');
    });
});
