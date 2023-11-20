import express from 'express';
import bookRouter from './routers/book.js'

const app = express();
const PORT = 3000;
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server UP!');
});

app.use('/book', bookRouter)

app.use((req, res) => {
    res.status(404).send("You requested something I don't have :(");
});

app.listen(PORT, () => {
    console.log(`App is running and Listening on port ${PORT}`);
});