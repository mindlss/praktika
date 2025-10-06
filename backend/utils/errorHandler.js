/**
 * @file errorHandler.js
 * @description Utility function to handle errors in Express controllers
 */

/**
 * Send a structured JSON error response in Express.
 *
 * @param {Object} res - Express response object
 * @param {Error} err - Error object
 * @param {number} [defaultStatus=500] - Default HTTP status if err.status is not set
 * @returns {Object} Express response
 *
 * @example
 * try {
 *   // some code that may throw
 * } catch (err) {
 *   return handleError(res, err);
 * }
 */
function handleError(res, err, defaultStatus = 500) {
    const status = err.status || defaultStatus;

    const body = {
        error: err.message || 'Internal Server Error',
    };

    if (process.env.NODE_ENV !== 'production') {
        body.details = err.details || null;
        body.stack = err.stack || null;
        console.error('----- ERROR START -----');
        console.error('Status:', status);
        console.error('Message:', err.message);
        if (err.details) console.error('Details:', err.details);
        if (err.stack) console.error('Stack:', err.stack);
        console.error('------ ERROR END ------');
    }

    return res.status(status).json(body);
}

module.exports = {
    handleError,
};
