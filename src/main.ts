/**
 * Module dependencies.
 */

import http from "http";
import { connect, connection } from "mongoose";
import { app } from "./app";
import { initializeUsers } from "./documents/user";

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

// Connect to MongoDB
connect(
  `mongodb+srv://juhdanad:${process.env.DB_PASSWORD}@juhasz-prf-gyakorlat-fa.5h4tt.mongodb.net/falfestekbolt?retryWrites=true&w=majority`
);
connection.on("connected", () => {
  /**
   * Listen on provided port, on all network interfaces.
   */
  initializeUsers();
  server.listen(port);
  server.on("error", onError);
  server.on("listening", onListening);
});
connection.on("error", (err) => {
  console.error(`Mongoose connection error: ${err}`);
  process.exit(1);
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr?.port;
  console.log("listening on " + bind);
}
