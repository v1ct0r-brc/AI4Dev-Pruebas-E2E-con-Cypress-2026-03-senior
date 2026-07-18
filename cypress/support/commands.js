/// <reference types="cypress" />

/**
 * Devuelve el .card-body de la columna cuyo header coincide con `title`.
 */
Cypress.Commands.add('getColumnBody', (title) => {
  return cy
    .contains('.card-header', title)
    .closest('.card')
    .find('.card-body');
});

/**
 * Arrastra una tarjeta (sujeto) a la columna destino usando el sensor de
 * teclado de react-beautiful-dnd (Space + flechas), el método oficial y
 * más fiable en Cypress.
 *
 * Uso: cy.contains('.card-title', 'John Doe').closest('.card.mb-2').dragToColumn('Phone Screen')
 */
Cypress.Commands.add('dragToColumn', { prevSubject: 'element' }, (subject, targetColumnHeader) => {
  const SPACE = { keyCode: 32, which: 32, key: ' ', code: 'Space', force: true };
  const ARROW_RIGHT = { keyCode: 39, which: 39, key: 'ArrowRight', code: 'ArrowRight', force: true };
  const ARROW_LEFT = { keyCode: 37, which: 37, key: 'ArrowLeft', code: 'ArrowLeft', force: true };

  cy.wrap(subject).as('dragCard');

  cy.get('@dragCard')
    .closest('.col-md-3')
    .invoke('index')
    .then((sourceIndex) => {
      cy.contains('.card-header', targetColumnHeader)
        .closest('.col-md-3')
        .invoke('index')
        .then((targetIndex) => {
          const steps = targetIndex - sourceIndex;
          const arrow = steps > 0 ? ARROW_RIGHT : ARROW_LEFT;

          cy.get('@dragCard')
            .focus()
            .trigger('keydown', { keyCode: 32, which: 32, key: ' ', force: true });

          // Re-query: rbd clona el elemento durante el drag
          cy.get('@dragCard').then(($el) => {
            for (let i = 0; i < Math.abs(steps); i += 1) {
              cy.wrap($el).trigger('keydown', arrow);
            }
          });

          cy.wait(250);

          cy.get('@dragCard').trigger('keydown', SPACE);
        });
    });
});
