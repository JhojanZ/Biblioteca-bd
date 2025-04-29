const db = require('./conexiones');

const getLibros = (params, callback) => {
    const { bookID, title, author, publisher, pages, publicationDate, rating, limit, offset } = params;
    console.log(`Recibiendo parámetros: ${JSON.stringify(params)}`);
    let query = `SELECT * FROM Libros WHERE 1=1`;
    const queryParams = [];

    if (bookID) {
        query += ` AND bookID = ?`;
        queryParams.push(bookID);
    }
    if (title) {
        query += ` AND title LIKE ?`;
        queryParams.push(`%${title}%`);
    }
    if (author) {
        query += ` AND authors LIKE ?`;
        queryParams.push(`%${author}%`);
    }
    if (publisher) {
        query += ` AND publisher LIKE ?`;
        queryParams.push(`%${publisher}%`);
    }
    if (pages) {
        query += ` AND num_pages = ?`;
        queryParams.push(pages);
    }
    if (publicationDate) {
        query += ` AND publication_date < ?`;
        queryParams.push(publicationDate);
    }
    if (rating) {
        query += ` AND average_rating >= ?`;
        queryParams.push(rating);
    }
    if (limit) {
        query += ` LIMIT ?`;
        queryParams.push(parseInt(limit));
    }
    if (offset) {
        query += ` OFFSET ?`;
        queryParams.push(parseInt(offset));
    }



    console.log(`Executing query: ${query} | with params: ${queryParams}`);
    db.query(query, queryParams, callback);
};

module.exports = { getLibros };
