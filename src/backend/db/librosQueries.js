const db = require('./conexiones');

const getLibros = (params, callback) => {
    const { bookID, title, author, publisher, pages, publicationDate, rating, limit, offset } = params;
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

    console.log('Query:', query);  
    console.log('Query Params:', queryParams); 
    db.query(query, queryParams, callback);
};

const insertarLibro = (params, callback) => {
    const { title, author, publisher, pages, publicationDate, isbn, isbn13, language, cant } = params;
    const query = `INSERT INTO Libros (title, authors, publisher, num_pages, publication_date, isbn, isbn13, language_code, text_reviews_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?) `;
    const queryParams = [title, author, publisher, parseInt(pages), publicationDate, isbn, isbn13, language, cant];
    
    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Error al insertar el libro:', err);
            return callback(err);
        }
        callback(null, results);
    });
    
};

const eliminarLibro = (bookID, callback) => {
    console.log(`Eliminando libro con ID: ${bookID}`);
    const query = `DELETE FROM Libros WHERE bookID = ?`;
    db.query(query, [bookID], callback);
};

module.exports = { getLibros, insertarLibro, eliminarLibro };
