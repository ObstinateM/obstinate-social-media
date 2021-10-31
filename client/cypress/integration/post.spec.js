describe('Post', () => {
    beforeEach(() => {
        cy.setCookie(
            'refreshToken',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwibmFtZSI6IlJvYm90IiwiZW1haWwiOiJ6QHoiLCJhdmF0YXIiOiJodHRwczovL3l0My5nZ3BodC5jb20veXRjL0FLZWRPTFRjSWw2a0t0M2xFUEpFeVNVZl9ocEhpS0RLaUZlbzllV1BSZUx5c1E9czE3Ni1jLWstYzB4MDBmZmZmZmYtbm8tcmoiLCJiaW8iOiJIZXkgSSdtIGEgc3VwZXIgY29vbCBSb2JvdCEiLCJpYXQiOjE2MzU3MjA1NDEsImV4cCI6MTYzNTcyMDU1NiwiaXNzIjoib2JzdGluYXRlU29jaWFsTWVkaWEifQ.1arR3aMZRcGQtwCl0bBLz88iiZi7l2IgaxLCSohnYgE'
        );
        cy.visit('http://localhost:3000');
        cy.wait(100);
    });

    it('create a new post', () => {
        cy.get('.create-button').click();
        cy.get('textarea').type('Super post !!');
        cy.get('.submit-button').click();
        cy.get(':nth-child(2) > .post-top > .content > .content-title').contains('Robot');
        cy.get(':nth-child(2) > .post-top > .content > .content-text').contains('Super post !!');
    });

    it('should can delete the post', () => {
        cy.get(':nth-child(2) > .action > :nth-child(1)').click();
    });
});
