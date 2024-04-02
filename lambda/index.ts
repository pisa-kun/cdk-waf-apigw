import { Handler } from 'aws-lambda';

export const handler: Handler = async(event, context, callback) => {
    callback(null, {
        statusCode: 200,
        body: JSON.stringify({
            message: "pong",
        }),
    });
}