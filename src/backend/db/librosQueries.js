const db = require('./conexiones');

const getLibros = (params, callback) => {
    const { title, author, publisher, pages, publicationDate, rating, limit, offset } = params;
    let query = `SELECT * FROM Libros WHERE 1=1`;
    const queryParams = [];

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

    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(parseInt(limit), parseInt(offset));

    db.query(query, queryParams, callback);
};

module.exports = { getLibros };
