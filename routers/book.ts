import express from 'express';
import Book from '../types/book.js'
import data from '../data/MOCK_DATA.js';

const router = express.Router()

router.get('/', (req: Book.Request, res: Book.Response) => {
    const page = parseInt(req.query.page || '1')
    const pageSize = parseInt(req.query.pageSize || '10')
    const dataForOnePage = data.slice((page - 1) * pageSize, page * pageSize)
    res.send({
        page,
        pageSize,
        bookItems: dataForOnePage
    });
});

router.get('/search', (req, res) => {
    const bookName = req.query.name;
    const publishingYear = req.query.year;
    let matchBooks: any = []
    if (bookName) {
        matchBooks = data.filter(book => book.title.toLowerCase().includes(bookName.toString().toLowerCase()));
        console.log(bookName.toString().toLowerCase())
    }

    if (publishingYear) {
        matchBooks = data.filter(book => book.publicationYear === parseInt(publishingYear.toString()));
    }
    if (matchBooks?.length === 0) {
        res.status(404).send("No book match the required")
    }
    res.send(matchBooks)
});

router.get('/:id', (req, res) => {
    const bookId = parseInt(req.params.id)
    const getBookById = data.find(item => item.id === bookId)
    if (getBookById) {
        res.status(200).send(getBookById)
    } else {
        res.status(404).send("Book not found")
    }
})

router.post("/", (req: Book.Request, res: Book.Response) => {
    const bookTitle = req.body.title
    const bookAuthor = req.body.author
    const bookPublicationYear = req.body.publicationYear
    if (!bookTitle || !bookAuthor || !bookPublicationYear) {
        res.status(400).send("All information are required")
        return
    }
    if (bookPublicationYear > new Date().getFullYear() || bookPublicationYear < 1) {
        res.status(400).send("Invalid year")
        return
    }
    const newBook: Book.Item = {
        id: data[data.length - 1].id + 1,
        title: req.body.title,
        author: req.body.author,
        publicationYear: req.body.publicationYear
    }
    data.push(newBook)
    res.status(201).send('New book has been added');
})

router.delete("/:id", (req: Book.Request, res: Book.Response) => {
    const bookIdToDelete = parseInt(req.params.id);
    const index = data.findIndex(item => item.id === bookIdToDelete);

    if (index !== -1) {
        data.splice(index, 1);
        res.send("Book has been deleted successfully");
    } else {
        res.status(404).send("Cannot delete this item since it does not exist");
    }
});

router.put("/:id", (req: Book.Request, res: Book.Response) => {
    const bookIdToUpdate = parseInt(req.params.id);
    const index = data.findIndex(item => item.id === bookIdToUpdate);

    if (index !== -1) {
        const updatedData = {
            ...data[index],
            ...req.body,
            id: bookIdToUpdate  //the id mustn't change 
        }
        console.log(updatedData)
        data[index] = updatedData

        res.status(200).send("The book info has been updated")
    } else {
        res.status(404).send("Cannot be updated since the book id not found")
    }
})

export default router