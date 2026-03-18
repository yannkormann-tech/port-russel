const path = require("path");
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");

const authApiRouter = require("./routes/api/auth");
const catwaysApiRouter = require("./routes/api/catways");
const reservationsApiRouter = require("./routes/api/reservations");
const usersApiRouter = require("./routes/api/users");
const webRouter = require("./routes/web/index");
const { sessionUser } = require("./middleware/sessionUser");
const { swaggerSpec } = require("../docs/swagger");

function createApp({ mongoUri, sessionSecret }) {
  const app = express();

  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));

  // Middlewares globaux: securite + logs + parsing body.
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(methodOverride("_method"));

  // Session stockee dans Mongo pour garder l'utilisateur connecte.
  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: mongoUri }),
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 8,
      },
    })
  );

  app.use(sessionUser);
  app.use(express.static(path.join(__dirname, "public")));

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Routes API
  app.use(authApiRouter);
  app.use("/catways", catwaysApiRouter);
  app.use("/catway", catwaysApiRouter);
  app.use("/catways/:id/reservations", reservationsApiRouter);
  app.use("/catway/:id/reservations", reservationsApiRouter);
  app.use("/users", usersApiRouter);

  // Routes pages web
  app.use("/app", webRouter);
  app.use("/", webRouter);

  app.use((req, res) => {
    if (req.accepts("html")) {
      return res.status(404).render("dashboard/not-found", {
        title: "Page introuvable",
      });
    }

    res.status(404).json({ message: "Route not found" });
  });

  return app;
}

module.exports = { createApp };
