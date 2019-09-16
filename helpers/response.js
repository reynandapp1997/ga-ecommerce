exports.successResponse = (message, length, data) => {
    return {
        message,
        length,
        data,
    };
};

exports.errorResponse = (errorMessage) => {
    return {
        message: 'An error occured',
        errorMessage: errorMessage.toString()
    };
};
