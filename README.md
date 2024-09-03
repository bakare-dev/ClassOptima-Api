---

# Timetable Scheduler Server

This server is part of the ClassOptima project, designed to manage and optimize class schedules.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/bakare-dev/ClassOptima.git
   ```
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Create a `.env` file in the root directory and add the following configurations:

   ```
   PORT=
   DEV_DB=
   DEV_USER=
   DEV_PASSWORD=
   DEV_HOST=
   WINSTONSOURCETOKEN=
   WINSTONSOURCEID=
   REDISPORT=
   REDISURL=
   SMTP_HOST=
   SMTP_PORT=
   SMTP_USN=
   SMTP_PASSWORD=
   JWT_SECRET=
   AWS_S3_BUCKET=
   AWS_S3_REGION=
   AWS_ACCESS_KEY=
   AWS_SCERET_KEY=
   ```

4. Uncomment the database connection initialization in `main.js`:
   ```javascript
   const db = new DatabaseEngine();
   db.connect(async () => {
       let serverEngine = new Server(config.server.port);
       serverEngine.start();
   });
   ```

5. Run `npm install` to install dependencies.

6. Start the server with `npm start`.

7. After the first run, stop the application and revert the changes in `main.js`:
   ```javascript
   // const db = new DatabaseEngine();
   // db.connect( async () => {
   //     let serverEngine = new Server(config.server.port);
   //     serverEngine.start();
   // });
   let server = new Server(config.server.port);
   server.start();
   ```

8. Comment out the database connection initialization again:
   ```javascript
   // const db = new DatabaseEngine();
   // db.connect( async () => {
   //     let serverEngine = new Server(config.server.port);
   //     serverEngine.start();
   // });
   ```

9. Run `npm start` again and enjoy!

## Usage

This server provides APIs for managing class schedules. Refer to the API documentation for details on endpoints and usage.

docs: https://classoptima.bakare.tech/swagger

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

---