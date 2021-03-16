export default {
    jwt: {
        secret: process.env.APP_SECRET || '40e9d464d99ce82594ac1bb27f8d5b0c',
        expiresIn: '1d',
    },
};
