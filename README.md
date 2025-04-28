# Library Webpage

This project is a simple library webpage that displays a list of books. It utilizes a backend server to fetch book data from a database and presents it on the frontend using HTML, CSS, and JavaScript. The project is designed with Bootstrap for responsive styling.

## Project Structure

```
library-webpage
├── src
│   ├── index.html          # Main HTML page of the library website
│   ├── css
│   │   └── styles.css      # Custom styles for the webpage
│   ├── js
│   │   └── app.js          # JavaScript code for frontend functionality
│   ├── sql
│   │   └── database.sql    # SQL commands for database setup
│   └── backend
│       └── server.js       # Backend server code using Express
├── package.json             # npm configuration file
├── README.md                # Documentation for the project
└── .gitignore               # Files and directories to ignore by Git
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd library-webpage
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Set up the database:**
   - Use the SQL commands in `src/sql/database.sql` to create the necessary database and tables.
   - Import data from `books.csv` into the database.

4. **Run the backend server:**
   ```
   node src/backend/server.js
   ```

5. **Open the webpage:**
   - Open `src/index.html` in your web browser to view the library webpage.

## Usage

- The webpage will display a list of books fetched from the database.
- You can navigate through the site using the navigation bar.

## Contributing

Feel free to submit issues or pull requests for any improvements or features you would like to see in this project.