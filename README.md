# Port Russell

Projet fait pour gerer un port de plaisance avec Node.js + Express + MongoDB.

En gros on peut gerer:
- les catways
- les reservations
- les utilisateurs

Il y a aussi une interface EJS pour faire les actions sans passer par Postman.

## Ce que j'ai fait

- login/logout
- CRUD catways
- CRUD reservations
- CRUD users
- dashboard web
- doc Swagger: /api-docs

## Avant de lancer

- Node.js installe
- MongoDB lance en local

## Installation rapide

1. Installer les dependances

```bash
npm install
```

2. Copier .env.example en .env

3. Mettre les donnees de demo

```bash
npm run seed
```

4. Lancer le projet

```bash
npm run dev
```

## URL

- app: http://localhost:3000
- doc API: http://localhost:3000/api-docs

## Compte test

- email: admin@russell-port.local
- mdp: Admin1234!

Si le login ne marche pas, relancer:

```bash
npm run seed
```

## Routes principales (resume)

### Auth
- POST /login
- GET /logout

### Catways
- GET /catways
- GET /catways/:id
- POST /catways
- PUT /catways/:id
- DELETE /catways/:id

### Reservations
- GET /catways/:id/reservations
- GET /catways/:id/reservations/:idReservation
- POST /catways/:id/reservations
- PUT /catways/:id/reservations/:idReservation
- PUT /catways/:id/reservations
- DELETE /catways/:id/reservations/:idReservation

### Users
- GET /users
- GET /users/:email
- POST /users
- PUT /users/:email
- DELETE /users/:email

