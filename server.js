// App entry point
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to DB and start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`DDTV Management Server running on port ${PORT}`);
    });
});
