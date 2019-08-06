const crypto = require('crypto').randomBytes(256).toString('hex');

/* set a secret key */
let secretKey;
let databaseUri;
if (process.env.NODE_ENV === 'dev') {
    databaseUri = process.env.MONGODB_URI_DEV;
    secretKey = 'dummy-s3cr3t-k3y';
    console.log({secretKey});
} else {
    databaseUri = process.env.MONGODB_URI;
    secretKey = crypto;
    console.log({secretKey});
}

process.env.DATABASE_URI = databaseUri;
process.env.SECRET_KEY = secretKey;