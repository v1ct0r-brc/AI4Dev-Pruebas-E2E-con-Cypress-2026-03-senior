/// <reference types="cypress" />

const POSITION_ID = 1;
const API_BASE = 'http://localhost:3010';

const interviewFlowFixture = {
  interviewFlow: {
    positionName: 'Software Engineer',
    interviewFlow: {
      interviewSteps: [
        { name: 'Applied', id: 1 },
        { name: 'Phone Screen', id: 2 },
        { name: 'Technical Interview', id: 3 },
        { name: 'Offer', id: 4 },
      ],
    },
  },
};

const candidatesFixture = [
  {
    candidateId: 101,
    fullName: 'John Doe',
    averageScore: 2,
    applicationId: 1001,
    currentInterviewStep: 'Applied',
  },
  {
    candidateId: 102,
    fullName: 'Jane Smith',
    averageScore: 3,
    applicationId: 1002,
    currentInterviewStep: 'Phone Screen',
  },
  {
    candidateId: 103,
    fullName: 'Bob Brown',
    averageScore: 1,
    applicationId: 1003,
    currentInterviewStep: 'Technical Interview',
  },
];

function stubPositionApis() {
  cy.intercept('GET', `${API_BASE}/positions/${POSITION_ID}/interviewFlow`, {
    statusCode: 200,
    body: interviewFlowFixture,
  }).as('getInterviewFlow');

  cy.intercept('GET', `${API_BASE}/positions/${POSITION_ID}/candidates`, {
    statusCode: 200,
    body: candidatesFixture,
  }).as('getCandidates');
}

describe('Carga de la Página de Position', () => {
  beforeEach(() => {
    stubPositionApis();
    cy.visit(`/positions/${POSITION_ID}`);
    cy.wait(['@getInterviewFlow', '@getCandidates']);
  });

  it('Verifica que el título de la posición se muestra correctamente', () => {
    cy.get('h2')
      .should('be.visible')
      .and('have.text', 'Software Engineer');
  });

  it('Verifica que se muestran las columnas correspondientes a cada fase del proceso de contratación', () => {
    const stages = ['Applied', 'Phone Screen', 'Technical Interview', 'Offer'];

    stages.forEach((stage) => {
      cy.contains('.card-header', stage).should('be.visible');
    });

    cy.get('.card-header').should('have.length', stages.length);
  });

  it('Verifica que las tarjetas de los candidatos se muestran en la columna correcta según su fase actual', () => {
    cy.getColumnBody('Applied')
      .find('.card.mb-2')
      .contains('.card-title', 'John Doe')
      .should('be.visible');

    cy.getColumnBody('Phone Screen')
      .find('.card.mb-2')
      .contains('.card-title', 'Jane Smith')
      .should('be.visible');

    cy.getColumnBody('Technical Interview')
      .find('.card.mb-2')
      .contains('.card-title', 'Bob Brown')
      .should('be.visible');

    cy.getColumnBody('Offer').find('.card.mb-2').should('not.exist');

    cy.getColumnBody('Applied').find('.card.mb-2').should('have.length', 1);
    cy.getColumnBody('Phone Screen').find('.card.mb-2').should('have.length', 1);
    cy.getColumnBody('Technical Interview').find('.card.mb-2').should('have.length', 1);
  });
});

describe('Cambio de Fase de un Candidato', () => {
  beforeEach(() => {
    stubPositionApis();

    cy.intercept('PUT', `${API_BASE}/candidates/101`, {
      statusCode: 200,
      body: { message: 'Candidate stage updated successfully', data: {} },
    }).as('updateCandidate');

    cy.visit(`/positions/${POSITION_ID}`);
    cy.wait(['@getInterviewFlow', '@getCandidates']);
  });

  it('Simula el arrastre de una tarjeta y verifica que se mueve a la nueva columna', () => {
    cy.getColumnBody('Applied')
      .contains('.card-title', 'John Doe')
      .should('be.visible');

    cy.contains('.card-title', 'John Doe')
      .closest('.card.mb-2')
      .dragToColumn('Phone Screen');

    cy.getColumnBody('Phone Screen')
      .find('.card.mb-2')
      .contains('.card-title', 'John Doe')
      .should('be.visible');

    cy.getColumnBody('Applied').should('not.contain', 'John Doe');
  });

  it('Verifica que la fase se actualiza en el backend mediante PUT /candidates/:id', () => {
    cy.contains('.card-title', 'John Doe')
      .closest('.card.mb-2')
      .dragToColumn('Phone Screen');

    cy.wait('@updateCandidate')
      .its('request.body')
      .should('deep.equal', {
        applicationId: 1001,
        currentInterviewStep: 2,
      });
  });
});
