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
    app.use(morgan("common", {
        //https://stackoverflow.com/a/53412745
        // Save logs to file. "a" flag mean append to file, create if not exists.
        stream: fs.createWriteStream(path.join(__dirname, "server.log"), { flags: "a"}),
        // Don't log requests that went OK.
        skip: (req, res) => { return res.statusCode < 400; }
    }));
}

app.use("/api", apiRouter);

// Serve React app
app.use(express.static("../client/build"));

const PORT = configuration.PORT;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

export default app;