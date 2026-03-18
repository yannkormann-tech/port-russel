# API - Port Russell

Petite note: toutes les routes sont protegees sauf /login.

## Login

### POST /login

Body exemple:

```json
{
  "email": "admin@russell-port.local",
  "password": "Admin1234!"
}
```

### GET /logout
Deconnecte l'utilisateur.

## Catways

### GET /catways
Retourne la liste.

### GET /catways/:id
Retourne un catway.

### POST /catways

```json
{
  "catwayNumber": 8,
  "catwayType": "long",
  "catwayState": "Etat correct"
}
```

### PUT /catways/:id
Modifie seulement catwayState.

### DELETE /catways/:id
Supprime un catway.

## Reservations

### GET /catways/:id/reservations
Liste les reservations d'un catway.

### GET /catways/:id/reservations/:idReservation
Detail d'une reservation.

### POST /catways/:id/reservations

```json
{
  "clientName": "Client",
  "boatName": "Bateau",
  "startDate": "2026-03-20",
  "endDate": "2026-03-22"
}
```

### PUT /catways/:id/reservations/:idReservation
Met a jour la reservation.

### PUT /catways/:id/reservations
Version alternative (idReservation dans le body):

```json
{
  "idReservation": "<mongo-id>",
  "clientName": "Client",
  "boatName": "Bateau",
  "startDate": "2026-03-20",
  "endDate": "2026-03-22"
}
```

### DELETE /catways/:id/reservations/:idReservation
Supprime la reservation.

## Users

### GET /users
Liste des utilisateurs.

### GET /users/:email
Detail d'un utilisateur.

### POST /users

```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "Password123"
}
```

### PUT /users/:email
Modifie username/email/password.

### DELETE /users/:email
Supprime un utilisateur.
