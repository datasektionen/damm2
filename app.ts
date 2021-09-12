import express from 'express';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

import apiRouter from './routes/api';
// Loads env variables
import configuration from './common/configuration';

const app = express();
app.use(express.json());
app.use(cors());

// Log requests to console
// Don't log when NODE_ENV == testing
if (configuration.NODE_ENV === "development") {
    app.use(morgan("dev"));
} else if (configuration.NODE_ENV === "production") {
    app.use(morgan("common"));
}

app.use("/api", apiRouter);

const fuzzyfile = fs.readFileSync("./fuzzyfile.json");
app.get("/fuzzyfile", (req, res) => res.send(fuzzyfile));

// Serve React app
app.use(express.static(path.join(__dirname, "client", "build")));
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "client", "build", "index.html")));

const PORT = configuration.PORT;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

export default app;