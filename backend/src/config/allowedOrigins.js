let allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://curvenherbs.com',
    'https://www.curvenherbs.com',
    'https://api.curvenherbs.com',
    'https://curvenherbs.vercel.app',
    'https://www.curvenherbs.vercel.app',
    'https://curvenherbs.onrender.com',
]

let environment = process.env.NODE_ENV || 'development'
if(environment === 'development'){
    allowedOrigins = ['*']
}

module.exports = allowedOrigins;