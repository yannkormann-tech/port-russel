const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "Port Russell API",
    version: "1.0.0",
    description: "API privee de gestion des catways, reservations et utilisateurs",
  },
  servers: [
    {
      url: "http://localhost:3000",
    },
  ],
  paths: {
  "/login": {
    post: {
      summary: "Connexion utilisateur",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: { type: "string" },
                password: { type: "string" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Authentification reussie" },
      },
    },
  },
  "/logout": {
    get: {
      summary: "Deconnexion utilisateur",
      responses: {
        200: { description: "Deconnexion reussie" },
      },
    },
  },
  "/catways": {
    get: { summary: "Lister les catways" },
    post: { summary: "Creer un catway" },
  },
  "/catways/{id}": {
    get: { summary: "Detail d'un catway" },
    put: { summary: "Modifier l'etat d'un catway" },
    delete: { summary: "Supprimer un catway" },
  },
  "/catways/{id}/reservations": {
    get: { summary: "Lister les reservations d'un catway" },
    post: { summary: "Creer une reservation sur un catway" },
  },
  "/catways/{id}/reservations/{idReservation}": {
    get: { summary: "Detail d'une reservation" },
    put: { summary: "Modifier une reservation" },
    delete: { summary: "Supprimer une reservation" },
  },
  "/users": {
    get: { summary: "Lister les utilisateurs" },
    post: { summary: "Creer un utilisateur" },
  },
  "/users/{email}": {
    get: { summary: "Detail d'un utilisateur" },
    put: { summary: "Modifier un utilisateur" },
    delete: { summary: "Supprimer un utilisateur" },
  },
  },
};

module.exports = { swaggerSpec };
