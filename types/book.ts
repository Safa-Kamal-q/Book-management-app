import express from 'express';

namespace Books {
    export interface Item {
        id: number,
        title: string,
        author: string,
        publicationYear: number
    }

    export interface Request extends express.Request {
        body: {
            title: string,
            author: string,
            publicationYear: number
        },
        query: {
            bookName: string,
            bookPublishedYear: string
            page: string,
            pageSize: string
        }
    }

    export interface Response extends express.Response {
        send: (body: string | {
            page: number
            pageSize: number
            bookItems: Array<Item>
        }) => this
    }
}

export default Books;