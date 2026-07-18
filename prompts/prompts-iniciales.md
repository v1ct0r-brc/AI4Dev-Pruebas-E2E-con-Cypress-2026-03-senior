# Pruebas E2E con Cypress — Página Position

## Descripción del ejercicio

Crear pruebas end-to-end con Cypress para la interfaz **Position** (`/positions/:id`), cubriendo:

### 1. Carga de la página de Position

- Verificar que el título de la posición se muestra correctamente.
- Verificar que se muestran las columnas correspondientes a cada fase del proceso de contratación.
- Verificar que las tarjetas de los candidatos aparecen en la columna correcta según su fase actual.

### 2. Cambio de fase de un candidato

- Simular el arrastre de una tarjeta de candidato de una columna a otra.
- Verificar que la tarjeta se mueve a la nueva columna.
- Verificar que la fase se actualiza en el backend mediante `PUT /candidates/:id`.

## Prompt utilizado

```
Debes crear pruebas E2E para verificar los siguientes escenarios:

Carga de la Página de Position:
- Verifica que el título de la posición se muestra correctamente.
- Verifica que se muestran las columnas correspondientes a cada fase del proceso de contratación.
- Verifica que las tarjetas de los candidatos se muestran en la columna correcta según su fase actual.

Cambio de Fase de un Candidato:
- Simula el arrastre de una tarjeta de candidato de una columna a otra.
- Verifica que la tarjeta del candidato se mueve a la nueva columna.
- Verifica que la fase del candidato se actualiza correctamente en el backend mediante el endpoint PUT /candidate/:id.
```

## Archivos de la entrega

| Archivo | Descripción |
|---------|-------------|
| `cypress/integration/position.spec.js` | Spec E2E con los escenarios anteriores |
| `cypress/support/commands.js` | Comandos `getColumnBody` y `dragToColumn` |
| `cypress/support/e2e.js` | Carga de support y plugins |
| `cypress.config.js` | Configuración Cypress (`baseUrl`, `specPattern`) |

## Cómo ejecutar las pruebas E2E

### Prerrequisitos

1. Instalar dependencias del frontend y arrancarlo (puerto **3000**):

```sh
cd frontend
npm install
npm start
```

2. En la raíz del repositorio, instalar las dependencias de Cypress:

```sh
npm install
```

> Las pruebas stubbean las APIs con `cy.intercept`, así que **no es obligatorio** tener el backend en marcha para estos E2E. El endpoint real de la aplicación es `PUT http://localhost:3010/candidates/:id`.

### Ejecutar Cypress

Modo interactivo:

```sh
npm run cypress:open
```

Modo headless (CI / verificación rápida):

```sh
npm run cypress:run
```

O solo el spec de Position:

```sh
npx cypress run --spec cypress/integration/position.spec.js
```

## Notas técnicas

- El drag & drop usa el sensor de teclado de `react-beautiful-dnd` (Space + flechas), vía el comando personalizado `dragToColumn`.
- Los datos de interview flow y candidatos se mockean en el spec para aislar la UI de la base de datos.
