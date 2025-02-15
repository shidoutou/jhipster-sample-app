import { entityItemSelector } from '../../support/commands';
import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Entry e2e test', () => {
  const entryPageUrl = '/entry';
  const entryPageUrlPattern = new RegExp('/entry(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const entrySample = {};

  let entry: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/entries+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/entries').as('postEntityRequest');
    cy.intercept('DELETE', '/api/entries/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (entry) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/entries/${entry.id}`,
      }).then(() => {
        entry = undefined;
      });
    }
  });

  it('Entries menu should load Entries page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('entry');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Entry').should('exist');
    cy.url().should('match', entryPageUrlPattern);
  });

  describe('Entry page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(entryPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Entry page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/entry/new$'));
        cy.getEntityCreateUpdateHeading('Entry');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', entryPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/entries',
          body: entrySample,
        }).then(({ body }) => {
          entry = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/entries+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [entry],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(entryPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Entry page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('entry');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', entryPageUrlPattern);
      });

      it('edit button click should load edit Entry page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Entry');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', entryPageUrlPattern);
      });

      it('last delete button click should delete instance of Entry', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('entry').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', entryPageUrlPattern);

        entry = undefined;
      });
    });
  });

  describe('new Entry page', () => {
    beforeEach(() => {
      cy.visit(`${entryPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Entry');
    });

    it('should create an instance of Entry', () => {
      cy.get(`[data-cy="code"]`).type('Computers').should('have.value', 'Computers');

      cy.get(`[data-cy="message"]`).type('Wooden European').should('have.value', 'Wooden European');

      cy.get(`[data-cy="translatedMessage"]`).type('Analyst Drives Operations').should('have.value', 'Analyst Drives Operations');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        entry = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', entryPageUrlPattern);
    });
  });
});
