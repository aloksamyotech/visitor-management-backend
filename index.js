import express from 'express';
import corsConfig from './src/core/config/cors.js';
import connectDB from './src/core/database/connection.js';
import globalExceptionHandler from './src/utils/globalException.js';
import logger from './src/core/config/logger.js';
import "dotenv/config"
import responseInterceptor from './src/utils/responseInterceptor.js';
import passport from './src/core/config/passportConfig.js';
import { userRouter, visitorRouter, visitsRouter } from './src/routes/routes.js';

const app = express();
const PORT = (() => {
    const env = process.env.ENV;
    return env === 'development' ? 7200 : 4545;
})();

app.use(express.json());
app.use(corsConfig);
app.use(passport.initialize());

app.use((req, res, next) => {
    logger.info(`Incoming request: ${req.method} ${req.originalUrl}`);
    next();
});

connectDB()
    .then(() => {
        logger.info('Database connected successfully');
    })
    .catch((err) => {
        logger.error(`Database connection failed: ${err.message}`);
    });

// user Route
app.use(responseInterceptor);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/user', visitorRouter);
app.use('/api/v1/user', visitsRouter);
app.use(globalExceptionHandler);

app.listen(PORT, () => {
    logger.info(`Server is running at port ${PORT}`);
});