let express = require("express");
let CoreController = require("../../controllers/CoreController");
const Authenticator = require("../../utils/Authenticator");


let instance;
class CoreRouter {

    #router;
    #controller;
    #authenticator;


    constructor() {

        if (instance) return instance;

        this.#router = express.Router();
        this.#controller = new CoreController();
        this.#authenticator = new Authenticator();
        this.#configure();


        instance = this;

    }

    #configure = () => {
        //Core routes

        /**
         * Retrieves students associated with the institution.
         * @param {object} req - The request object including the Bearer token for authorization.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} req.query - The query parameters.
         * @param {number} req.query.page - The page number for pagination.
         * @param {number} req.query.size - The number of students per page.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status, message, and student data.
         * @swagger
         * /api/v1/core/students:
         *   get:
         *     summary: Retrieves students associated with the institution.
         *     description: Retrieves students associated with the institution based on the provided institution ID, page number, and page size.
         *     tags:
         *      - Institution
         *     parameters:
         *       - in: header
         *         name: authorization
         *         required: true
         *         schema:
         *           type: string
         *           description: Bearer token for authorization.
         *           example: Bearer YOUR_AUTH_TOKEN_HERE
         *       - in: query
         *         name: page
         *         required: true
         *         schema:
         *           type: integer
         *           description: The page number for pagination.
         *           example: 1
         *       - in: query
         *         name: size
         *         required: true
         *         schema:
         *           type: integer
         *           description: The number of students per page.
         *           example: 10
         *     responses:
         *       200:
         *         description: Students found.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Students found.
         *                   description: The success message.
         *                 data:
         *                   type: object
         *                   properties:
         *                     students:
         *                       type: array
         *                       items:
         *                         type: object
         *                         properties:
         *                           email:
         *                             type: string
         *                             example: student@example.com
         *                             description: The email address of the student.
         *                           name:
         *                             type: string
         *                             example: John Doe
         *                             description: The name of the student.
         *                           level:
         *                             type: string
         *                             example: Freshman
         *                             description: The level of the student.
         *                           department:
         *                             type: string
         *                             example: Computer Science
         *                             description: The department of the student.
         *                           priviledge:
         *                             type: boolean
         *                             example: false
         *                             description: Indicates whether the student has privilege.
         *       404:
         *         description: No student found or Institution not found.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 404
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: No student found
         *                   description: The error message.
         *                 data:
         *                   type: object
         *                   properties:
         *                     students:
         *                       type: array
         *                       example: []
         *                       description: An empty array indicating no students found.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error.
         *                   description: The error message.
         */
        this.#router.get("/students", this.#authenticator.authenticateJWT, this.#controller.getInstitutionStudents);


        /**
         * Retrieves staff members associated with the institution.
         * @param {object} req - The request object including the Bearer token for authorization.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} req.query - The query parameters.
         * @param {number} req.query.page - The page number for pagination.
         * @param {number} req.query.size - The number of staff members per page.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status, message, and staff data.
         * @swagger
         * /api/v1/core/staffs:
         *   get:
         *     summary: Retrieves staff members associated with the institution.
         *     description: Retrieves staff members associated with the institution based on the provided institution ID, page number, and page size.
         *     tags:
         *      - Institution
         *     parameters:
         *       - in: header
         *         name: authorization
         *         required: true
         *         schema:
         *           type: string
         *           description: Bearer token for authorization.
         *           example: Bearer YOUR_AUTH_TOKEN_HERE
         *       - in: query
         *         name: page
         *         required: true
         *         schema:
         *           type: integer
         *           description: The page number for pagination.
         *           example: 1
         *       - in: query
         *         name: size
         *         required: true
         *         schema:
         *           type: integer
         *           description: The number of staff members per page.
         *           example: 10
         *     responses:
         *       200:
         *         description: Staff members found.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Staff found.
         *                   description: The success message.
         *                 data:
         *                   type: object
         *                   properties:
         *                     staffs:
         *                       type: array
         *                       items:
         *                         type: object
         *                         properties:
         *                           email:
         *                             type: string
         *                             example: staff@example.com
         *                             description: The email address of the staff member.
         *                           name:
         *                             type: string
         *                             example: Jane Doe
         *                             description: The name of the staff member.
         *                           department:
         *                             type: string
         *                             example: Computer Science
         *                             description: The department of the staff member.
         *                           priviledge:
         *                             type: boolean
         *                             example: false
         *                             description: Indicates whether the staff member has privilege.
         *                           courseCount:
         *                             type: number
         *                             example: 5
         *                             description: The number of courses taken by the staff member.
         *       404:
         *         description: No staff member found or Institution not found.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 404
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: No staff found
         *                   description: The error message.
         *                 data:
         *                   type: object
         *                   properties:
         *                     staffs:
         *                       type: array
         *                       example: []
         *                       description: An empty array indicating no staff members found.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error.
         *                   description: The error message.
         */
        this.#router.get("/staffs", this.#authenticator.authenticateJWT, this.#controller.getInstitutionStaffs);


        /**
         * Retrieves users with privileges associated with the institution.
         * @param {object} req - The request object including the Bearer token for authorization.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} req.query - The query parameters.
         * @param {number} req.query.institutionId - The ID of the institution.
         * @param {number} req.query.page - The page number for pagination.
         * @param {number} req.query.size - The number of users per page.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status, message, and user data with privileges.
         * @swagger
         * /api/v1/core/priviledges-users:
         *   get:
         *     summary: Retrieves users with privileges associated with the institution.
         *     description: Retrieves users with privileges associated with the institution based on the provided institution ID, page number, and page size.
         *     tags:
         *      - Institution
         *     parameters:
         *       - in: header
         *         name: authorization
         *         required: true
         *         schema:
         *           type: string
         *           description: Bearer token for authorization.
         *           example: Bearer YOUR_AUTH_TOKEN_HERE
         *       - in: query
         *         name: page
         *         required: true
         *         schema:
         *           type: integer
         *           description: The page number for pagination.
         *           example: 1
         *       - in: query
         *         name: size
         *         required: true
         *         schema:
         *           type: integer
         *           description: The number of users per page.
         *           example: 10
         *     responses:
         *       200:
         *         description: Users with privileges found.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Users with privileges found.
         *                   description: The success message.
         *                 data:
         *                   type: object
         *                   properties:
         *                     users:
         *                       type: array
         *                       items:
         *                         type: object
         *                         properties:
         *                           role:
         *                             type: string
         *                             example: staff.User.emailAddress
         *                             description: The role of the user.
         *                           assignedto:
         *                             type: string
         *                             example: staff@example.com
         *                             description: The email address of the user.
         *                           department:
         *                             type: string
         *                             example: Computer Science
         *                             description: The department of the user.
         *                           type:
         *                             type: string
         *                             example: Staff
         *                             description: The type of the user (Staff or Student).
         *       404:
         *         description: No user with privileges found or Institution not found.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 404
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Institution not found
         *                   description: The error message.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error.
         *                   description: The error message.
         */
        this.#router.get("/priviledges-users", this.#authenticator.authenticateJWT, this.#controller.getInstitutionPriviledgeUsers);


        /**
         * Retrieves courses by department and level.
         * @param {object} req - The request object including the Bearer token for authorization.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} req.query - The query parameters.
         * @param {number} req.query.departmentId - The ID of the department.
         * @param {number} req.query.levelId - The ID of the level.
         * @param {number} req.query.page - The page number for pagination.
         * @param {number} req.query.size - The number of courses per page.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status, message, and course data.
         * @swagger
         * /api/v1/core/level-courses:
         *   get:
         *     summary: Retrieves courses by department and level.
         *     description: Retrieves courses based on the provided department ID, level ID, page number, and page size.
         *     tags:
         *      - Courses
         *     parameters:
         *       - in: header
         *         name: authorization
         *         required: true
         *         schema:
         *           type: string
         *           description: Bearer token for authorization.
         *           example: Bearer YOUR_AUTH_TOKEN_HERE
         *       - in: query
         *         name: departmentId
         *         required: true
         *         schema:
         *           type: integer
         *           description: The ID of the department.
         *           example: 1
         *       - in: query
         *         name: levelId
         *         required: true
         *         schema:
         *           type: integer
         *           description: The ID of the level.
         *           example: 1
         *       - in: query
         *         name: page
         *         required: true
         *         schema:
         *           type: integer
         *           description: The page number for pagination.
         *           example: 1
         *       - in: query
         *         name: size
         *         required: true
         *         schema:
         *           type: integer
         *           description: The number of courses per page.
         *           example: 10
         *     responses:
         *       200:
         *         description: Courses found.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                   description: The HTTP status code.
         *                 data:
         *                   type: object
         *                   properties:
         *                     courses:
         *                       type: array
         *                       items:
         *                         type: object
         *                         properties:
         *                           courseId:
         *                             type: integer
         *                             example: 1
         *                             description: The ID of the course.
         *                           courseCode:
         *                             type: string
         *                             example: CS101
         *                             description: The code of the course.
         *                           courseName:
         *                             type: string
         *                             example: Introduction to Computer Science
         *                             description: The name of the course.
         *                           units:
         *                             type: integer
         *                             example: 3
         *                             description: The number of units for the course.
         *                           requirementStatus:
         *                             type: string
         *                             example: pending
         *                             description: The status of the course requirement.
         *                           duration:
         *                             type: string
         *                             example: 1 semester
         *                             description: The duration of the course.
         *                           venue:
         *                             type: string
         *                             example: Room 101
         *                             description: The venue of the course.
         *       404:
         *         description: Department or level not found.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 404
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Department Not Found
         *                   description: The error message.
         *       422:
         *         description: Validation error.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 422
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *                 data:
         *                   type: object
         *                   properties:
         *                     ...
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error.
         *                   description: The error message.
         */
        this.#router.get("/level-courses", this.#authenticator.authenticateJWT, this.#controller.getCoursesByDepartmentAndLevel);

        /**
         * Retrieves courses by department.
         * @param {object} req - The request object including the Bearer token for authorization.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} req.query - The query parameters.
         * @param {number} req.query.departmentId - The ID of the department.
         * @param {number} req.query.page - The page number for pagination.
         * @param {number} req.query.size - The number of courses per page.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status, message, and course data.
         * @swagger
         * /api/v1/core/department-courses:
         *   get:
         *     summary: Retrieves courses by department.
         *     description: Retrieves courses based on the provided department ID, page number, and page size.
         *     tags:
         *      - Courses
         *     parameters:
         *       - in: header
         *         name: authorization
         *         required: true
         *         schema:
         *           type: string
         *           description: Bearer token for authorization.
         *           example: Bearer YOUR_AUTH_TOKEN_HERE
         *       - in: query
         *         name: departmentId
         *         required: true
         *         schema:
         *           type: integer
         *           description: The ID of the department.
         *           example: 1
         *       - in: query
         *         name: page
         *         required: true
         *         schema:
         *           type: integer
         *           description: The page number for pagination.
         *           example: 1
         *       - in: query
         *         name: size
         *         required: true
         *         schema:
         *           type: integer
         *           description: The number of courses per page.
         *           example: 10
         *     responses:
         *       200:
         *         description: Courses found.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                   description: The HTTP status code.
         *                 data:
         *                   type: object
         *                   properties:
         *                     courses:
         *                       type: array
         *                       items:
         *                         type: object
         *                         properties:
         *                           courseId:
         *                             type: integer
         *                             example: 1
         *                             description: The ID of the course.
         *                           courseCode:
         *                             type: string
         *                             example: CS101
         *                             description: The code of the course.
         *                           courseName:
         *                             type: string
         *                             example: Introduction to Computer Science
         *                             description: The name of the course.
         *                           units:
         *                             type: integer
         *                             example: 3
         *                             description: The number of units for the course.
         *                           requirementStatus:
         *                             type: string
         *                             example: pending
         *                             description: The status of the course requirement.
         *                           duration:
         *                             type: string
         *                             example: 1 semester
         *                             description: The duration of the course.
         *                           venue:
         *                             type: string
         *                             example: Room 101
         *                             description: The venue of the course.
         *       404:
         *         description: Department not found.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 404
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Department Not Found
         *                   description: The error message.
         *       422:
         *         description: Validation error.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 422
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *                 data:
         *                   type: object
         *                   properties:
         *                     ...
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error.
         *                   description: The error message.
         */
        this.#router.get("/department-courses", this.#authenticator.authenticateJWT, this.#controller.getCoursesByDepartment);


        /**
         * Retrieves courses assigned to a staff member.
         * @param {object} req - The request object including the Bearer token for authorization.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} req.query - The query parameters.
         * @param {number} req.query.page - The page number for pagination.
         * @param {number} req.query.size - The number of courses per page.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status, message, and course data.
         * @swagger
         * /api/v1/core/staff-courses:
         *   get:
         *     summary: Retrieves courses assigned to a staff member.
         *     description: Retrieves courses based on the provided staff ID, page number, and page size.
         *     tags:
         *      - Courses
         *     parameters:
         *       - in: header
         *         name: authorization
         *         required: true
         *         schema:
         *           type: string
         *           description: Bearer token for authorization.
         *           example: Bearer YOUR_AUTH_TOKEN_HERE
         *       - in: query
         *         name: page
         *         required: true
         *         schema:
         *           type: integer
         *           description: The page number for pagination.
         *           example: 1
         *       - in: query
         *         name: size
         *         required: true
         *         schema:
         *           type: integer
         *           description: The number of courses per page.
         *           example: 10
         *     responses:
         *       200:
         *         description: Courses found.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                   description: The HTTP status code.
         *                 data:
         *                   type: object
         *                   properties:
         *                     courses:
         *                       type: array
         *                       items:
         *                         type: object
         *                         properties:
         *                           courseId:
         *                             type: integer
         *                             example: 1
         *                             description: The ID of the course.
         *                           courseCode:
         *                             type: string
         *                             example: CS101
         *                             description: The code of the course.
         *                           courseName:
         *                             type: string
         *                             example: Introduction to Computer Science
         *                             description: The name of the course.
         *                           units:
         *                             type: integer
         *                             example: 3
         *                             description: The number of units for the course.
         *                           requirementStatus:
         *                             type: string
         *                             example: pending
         *                             description: The status of the course requirement.
         *                           duration:
         *                             type: string
         *                             example: 1 semester
         *                             description: The duration of the course.
         *                           venue:
         *                             type: string
         *                             example: Room 101
         *                             description: The venue of the course.
         *       404:
         *         description: Staff not found.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 404
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Staff Not Found
         *                   description: The error message.
         *       422:
         *         description: Validation error.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 422
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *                 data:
         *                   type: object
         *                   properties:
         *                     ...
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error.
         *                   description: The error message.
         */
        this.#router.get("/staff-courses", this.#authenticator.authenticateJWT, this.#controller.getStaffCourses);


        /**
         * Retrieves a course by its ID.
         * @param {object} req - The request object including the Bearer token for authorization.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} req.query - The query parameters.
         * @param {number} req.query.courseId - The ID of the course.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status, message, and course data.
         * @swagger
         * /api/v1/core/course:
         *   get:
         *     summary: Retrieves a course by its ID.
         *     description: Retrieves a course based on the provided course ID.
         *     tags:
         *      - Courses
         *     parameters:
         *       - in: header
         *         name: authorization
         *         required: true
         *         schema:
         *           type: string
         *           description: Bearer token for authorization.
         *           example: Bearer YOUR_AUTH_TOKEN_HERE
         *       - in: query
         *         name: courseId
         *         required: true
         *         schema:
         *           type: integer
         *           description: The ID of the course.
         *           example: 1
         *     responses:
         *       200:
         *         description: Course found.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                   description: The HTTP status code.
         *                 data:
         *                   type: object
         *                   properties:
         *                     course:
         *                       type: object
         *                       properties:
         *                         courseId:
         *                           type: integer
         *                           example: 1
         *                           description: The ID of the course.
         *                         courseCode:
         *                           type: string
         *                           example: CS101
         *                           description: The code of the course.
         *                         courseName:
         *                           type: string
         *                           example: Introduction to Computer Science
         *                           description: The name of the course.
         *                         units:
         *                           type: integer
         *                           example: 3
         *                           description: The number of units for the course.
         *                         requirementStatus:
         *                           type: string
         *                           example: pending
         *                           description: The status of the course requirement.
         *                         duration:
         *                           type: string
         *                           example: 1 semester
         *                           description: The duration of the course.
         *                         venue:
         *                           type: string
         *                           example: Room 101
         *                           description: The venue of the course.
         *       404:
         *         description: Course not found.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 404
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Course Not Found
         *                   description: The error message.
         *       422:
         *         description: Validation error.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 422
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *                 data:
         *                   type: object
         *                   properties:
         *                     ...
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error.
         *                   description: The error message.
         */
        this.#router.get("/course", this.#authenticator.authenticateJWT, this.#controller.getCourse);


        /**
         * Creates a new course.
         * @param {object} req - The request object including the Bearer token for authorization.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} req.body - The payload containing the details of the course to be created.
         * @param {string} req.body.courseCode - The code of the course.
         * @param {string} req.body.courseName - The name of the course.
         * @param {number} req.body.unit - The number of units for the course.
         * @param {string} req.body.requirementStatus - The status of the course requirement.
         * @param {number} req.body.duration - The duration of the course.
         * @param {number} req.body.DepartmentId - The ID of the department to which the course belongs.
         * @param {number} req.body.VenueId - The ID of the venue where the course takes place.
         * @param {number} req.body.InstitutionId - The ID of the institution to which the course belongs.
         * @param {number} req.body.LevelId - The ID of the level at which the course is offered.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and message.
         * @swagger
         * /api/v1/core/course:
         *   post:
         *     summary: Creates a new course.
         *     description: Creates a new course with the provided details.
         *     tags:
         *      - Courses
         *     parameters:
         *       - in: header
         *         name: Authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *       - in: body
         *         name: Course Details
         *         description: The course details data.
         *         required: true
         *         schema:
         *           type: object
         *           properties:
         *             courseCode:
         *               type: string
         *               example: CS101
         *               description: The code of the course.
         *             courseName:
         *               type: string
         *               example: Introduction to Computer Science
         *               description: The name of the course.
         *             unit:
         *               type: integer
         *               example: 3
         *               description: The number of units for the course.
         *             requirementStatus:
         *               type: string
         *               example: pending
         *               description: The status of the course requirement.
         *             duration:
         *               type: integer
         *               example: 1
         *               description: The duration of the course.
         *             DepartmentId:
         *               type: integer
         *               example: 1
         *               description: The ID of the department to which the course belongs.
         *             VenueId:
         *               type: integer
         *               example: 1
         *               description: The ID of the venue where the course takes place.
         *             InstitutionId:
         *               type: integer
         *               example: 1
         *               description: The ID of the institution to which the course belongs.
         *             LevelId:
         *               type: integer
         *               example: 1
         *               description: The ID of the level at which the course is offered.
         *     responses:
         *       201:
         *         description: Course created successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 201
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Course Created Successfully
         *                   description: The success message.
         *       422:
         *         description: Validation error. Indicates that the request body did not pass validation.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 422
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *                 data:
         *                   type: object
         *                   properties:
         *                     ...
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error.
         *                   description: The error message.
         */
        this.#router.post("/course", this.#authenticator.authenticateJWT, this.#controller.createCourse);


        /**
         * Adds courses to a staff member.
         * @param {object} req - The request object including the Bearer token for authorization.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} req.query - The query parameters.
         * @param {number[]} req.body.courses - An array of course IDs to be added to the staff member.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and message.
         * @swagger
         * /api/v1/core/staff-courses:
         *   post:
         *     summary: Adds courses to a staff member.
         *     description: Adds courses to a staff member identified by their ID.
         *     tags:
         *      - Courses
         *     parameters:
         *       - in: header
         *         name: Authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *       - in: body
         *         name: courses update
         *         required: true
         *         description: An array of course IDs to be added to the staff member.
         *         schema:
         *           properties:
         *              courses:
         *                type: array
         *                example: [1, 2, 3]
         *     responses:
         *       201:
         *         description: Courses added successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 201
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Course Added Successfully
         *                   description: The success message.
         *       422:
         *         description: Validation error. Indicates that the request body did not pass validation.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 422
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *                 data:
         *                   type: object
         *                   properties:
         *                     ...
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error.
         *                   description: The error message.
         */
        this.#router.post("/staff-courses", this.#authenticator.authenticateJWT, this.#controller.addStaffCourses);


        /**
         * Edits an existing course.
         * @param {object} req - The request object including the Bearer token for authorization.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} req.query - The query parameters.
         * @param {number} req.query.courseId - The ID of the course to be edited.
         * @param {object} req.body - The request body containing the updated course information.
         * @param {string} req.body.courseCode - The updated course code.
         * @param {string} req.body.courseName - The updated course name.
         * @param {number} req.body.unit - The updated number of units.
         * @param {string} req.body.requirementStatus - The updated requirement status.
         * @param {number} req.body.duration - The updated duration of the course.
         * @param {number} req.body.DepartmentId - The ID of the department associated with the course.
         * @param {number} req.body.VenueId - The ID of the venue associated with the course.
         * @param {number} req.body.InstitutionId - The ID of the institution associated with the course.
         * @param {number} req.body.LevelId - The ID of the level associated with the course.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and message.
         * @swagger
         * /api/v1/core/course:
         *   put:
         *     summary: Edits an existing course.
         *     description: Edits an existing course identified by its ID.
         *     tags:
         *      - Courses
         *     parameters:
         *       - in: header
         *         name: Authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *       - in: query
         *         name: courseId
         *         required: true
         *         description: The ID of the course to be edited.
         *         schema:
         *           type: integer
         *           example: 1
         *       - in: body
         *         name: Course Update Details
         *         description: Fill only the part you want to update.
         *         schema:
         *           type: object
         *           properties:
         *             courseCode:
         *               type: string
         *               minLength: 2
         *             courseName:
         *               type: string
         *               minLength: 3
         *             unit:
         *               type: integer
         *             requirementStatus:
         *               type: string
         *               minLength: 2
         *             duration:
         *               type: integer
         *               minimum: 1
         *             DepartmentId:
         *               type: integer
         *             VenueId:
         *               type: integer
         *             InstitutionId:
         *               type: integer
         *             LevelId:
         *               type: integer
         *     responses:
         *       200:
         *         description: Course updated successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Course Updated Successfully
         *                   description: The success message.
         *       404:
         *         description: Course not found. Indicates that the course with the provided ID does not exist.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 404
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Course not Found
         *                   description: The error message.
         *       422:
         *         description: Validation error. Indicates that the request body did not pass validation.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 422
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *                 data:
         *                   type: object
         *                   properties:
         *                     ...
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error.
         *                   description: The error message.
         */
        this.#router.put("/course", this.#authenticator.authenticateJWT, this.#controller.editCourse);


        /**
         * Deletes an existing course.
         * @param {object} req - The request object including the Bearer token for authorization.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} req.query - The query parameters.
         * @param {number} req.query.courseId - The ID of the course to be deleted.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and message.
         * @swagger
         * /api/v1/core/course:
         *   delete:
         *     summary: Deletes an existing course.
         *     description: Deletes an existing course identified by its ID.
         *     tags:
         *       - Courses
         *     parameters:
         *       - in: header
         *         name: Authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *       - in: query
         *         name: courseId
         *         required: true
         *         description: The ID of the course to be deleted.
         *         schema:
         *           type: integer
         *           example: 1
         *     responses:
         *       200:
         *         description: Course deleted successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Course deleted Successfully
         *                   description: The success message.
         *       404:
         *         description: Course not found. Indicates that the course with the provided ID does not exist.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 404
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Course not Found
         *                   description: The error message.
         *       422:
         *         description: Validation error. Indicates that the request body did not pass validation.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 422
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *                 data:
         *                   type: object
         *                   properties:
         *                     ...
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error.
         *                   description: The error message.
         */
        this.#router.delete("/course", this.#authenticator.authenticateJWT, this.#controller.deleteCourse);


        /**
         * Retrieves departments associated with a specific institution.
         * @param {object} req - The request object including the Bearer token for authorization.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} req.query - The query parameters.
         * @param {number} req.query.institutionId - The ID of the institution to retrieve departments for.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and data.
         * @swagger
         * /api/v1/core/departments-admin:
         *   get:
         *     summary: Retrieves departments associated with a specific institution.
         *     description: Retrieves departments associated with a specific institution identified by its ID.
         *     tags:
         *       - Department
         *     parameters:
         *       - in: header
         *         name: Authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *       - in: query
         *         name: page
         *         required: true
         *         description: The page number.
         *         schema:
         *           type: integer
         *           example: 1
         *       - in: query
         *         name: size
         *         required: true
         *         description: The number of departments per page.
         *         schema:
         *           type: integer
         *           example: 10
         *     responses:
         *       200:
         *         description: Departments retrieved successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                   description: The HTTP status code.
         *                 data:
         *                   type: object
         *                   properties:
         *                     departments:
         *                       type: array
         *                       items:
         *                         type: object
         *                         properties:
         *                           assigned:
         *                             type: boolean
         *                             example: true
         *                             description: Indicates if staffs are assigned to the department.
         *                           staffs:
         *                             type: array
         *                             items:
         *                               type: object
         *                               properties:
         *                                 name:
         *                                   type: string
         *                                   example: John Doe
         *                                   description: The name of the staff.
         *                                 emailAddress:
         *                                   type: string
         *                                   example: john.doe@example.com
         *                                   description: The email address of the staff.
         *       404:
         *         description: Institution not found. Indicates that the institution with the provided ID does not exist.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 404
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Institution not Found
         *                   description: The error message.
         *       422:
         *         description: Validation error. Indicates that the request body did not pass validation.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 422
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *                 data:
         *                   type: object
         *                   properties:
         *                     ...
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error.
         *                   description: The error message.
         */
        this.#router.get("/departments-admin", this.#authenticator.authenticateJWT, this.#controller.getDepartments);


        /**
         * Creates a new department associated with a specific institution.
         * @param {object} req - The request object including the Bearer token for authorization and the department details.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} req.body - The department details to be created.
         * @param {string} req.body.name - The name of the department.
         * @param {number} req.body.InstitutionId - The ID of the institution to associate the department with.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and message.
         * @swagger
         * /api/v1/core/department:
         *   post:
         *     summary: Creates a new department associated with a specific institution.
         *     description: Creates a new department associated with a specific institution identified by its ID.
         *     tags:
         *       - Department
         *     parameters:
         *       - in: header
         *         name: Authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *       - in: body
         *         name: Department Details
         *         schema:
         *           type: object
         *           properties:
         *             name:
         *               type: string
         *               minLength: 3
         *               example: Computer Science
         *               description: The name of the department.
         *             InstitutionId:
         *               type: integer
         *               example: 1
         *               description: The ID of the institution to associate the department with.
         *     responses:
         *       201:
         *         description: Department created successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 201
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Department Added Successfully
         *                   description: The success message.
         *       400:
         *         description: Error adding department. Indicates that an error occurred while adding the department.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 400
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Error adding Department
         *                   description: The error message.
         *       422:
         *         description: Validation error. Indicates that the request body did not pass validation.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 422
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *                 data:
         *                   type: object
         *                   properties:
         *                     ...
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error.
         *                   description: The error message.
         */
        this.#router.post("/department", this.#authenticator.authenticateJWT, this.#controller.createDepartment);


        /**
         * Updates an existing department.
         * @param {object} req - The request object including the Bearer token for authorization and the department details.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} req.query - The query parameters containing the department ID.
         * @param {number} req.query.departmentId - The ID of the department to update.
         * @param {object} req.body - The updated department details.
         * @param {string} req.body.name - The updated name of the department.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and message.
         * @swagger
         * /api/v1/core/department:
         *   put:
         *     summary: Updates an existing department.
         *     description: Updates an existing department identified by its ID with the provided details.
         *     tags:
         *       - Department
         *     parameters:
         *       - in: header
         *         name: Authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *       - in: query
         *         name: departmentId
         *         schema:
         *           type: integer
         *         required: true
         *         description: The ID of the department to update.
         *       - in: body
         *         name: Department Update
         *         schema:
         *           type: object
         *           properties:
         *             name:
         *               type: string
         *               minLength: 3
         *               example: Computer Science
         *               description: The updated name of the department.
         *     responses:
         *       200:
         *         description: Department updated successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Department Updated
         *                   description: The success message.
         *       400:
         *         description: Error updating department. Indicates that an error occurred while updating the department.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 400
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Error Updating Course
         *                   description: The error message.
         *       404:
         *         description: Department not found. Indicates that the department with the specified ID was not found.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 404
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Department not Found
         *                   description: The error message.
         *       422:
         *         description: Validation error. Indicates that the query parameters or request body did not pass validation.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 422
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error.
         *                   description: The error message.
         */
        this.#router.put("/department", this.#authenticator.authenticateJWT, this.#controller.updateDepartment);


        /**
         * Deletes a department.
         * @param {object} req - The request object including the Bearer token for authorization and the department ID.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} req.query - The query parameters containing the department ID.
         * @param {number} req.query.departmentId - The ID of the department to delete.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and message.
         * @swagger
         * /api/v1/core/department:
         *   delete:
         *     summary: Deletes a department.
         *     description: Deletes a department identified by its ID.
         *     tags:
         *       - Department
         *     parameters:
         *       - in: header
         *         name: Authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *       - in: query
         *         name: departmentId
         *         schema:
         *           type: integer
         *         required: true
         *         description: The ID of the department to delete.
         *     responses:
         *       200:
         *         description: Department deleted successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Department Deleted
         *                   description: The success message.
         *       400:
         *         description: Error deleting department. Indicates that an error occurred while deleting the department.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 400
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Error deleting Course
         *                   description: The error message.
         *       404:
         *         description: Department not found. Indicates that the department with the specified ID was not found.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 404
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Department not Found
         *                   description: The error message.
         *       422:
         *         description: Validation error. Indicates that the query parameters did not pass validation.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 422
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error.
         *                   description: The error message.
         */
        this.#router.delete("/department", this.#authenticator.authenticateJWT, this.#controller.deleteDepartment);


        /**
         * Retrieves events associated with the authenticated user's institution.
         * @param {object} req - The request object including the Bearer token for authorization.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} req.query - The query parameters containing the institution ID.
         * @param {number} req.query.institutionId - The ID of the institution to retrieve events for.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and data of retrieved events.
         * @swagger
         * /api/v1/core/events:
         *   get:
         *     summary: Retrieves events associated with the authenticated user's institution.
         *     description: Retrieves events associated with the authenticated user's institution.
         *     tags:
         *       - Event
         *     parameters:
         *       - in: header
         *         name: Authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *     responses:
         *       200:
         *         description: Events retrieved successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                   description: The HTTP status code.
         *                 data:
         *                   type: object
         *                   properties:
         *                     events:
         *                       type: array
         *                       items:
         *                         type: object
         *                         properties:
         *                           name:
         *                             type: string
         *                             example: Event Name
         *                             description: The name of the event.
         *                           requirementStatus:
         *                             type: string
         *                             example: In Progress
         *                             description: The requirement status of the event.
         *                           time:
         *                             type: string
         *                             description: The time details of the event.
         *                           departments:
         *                             type: array
         *                             items:
         *                               type: object
         *                               properties:
         *                                 id:
         *                                   type: integer
         *                                   example: 1
         *                                   description: The ID of the department.
         *                                 name:
         *                                   type: string
         *                                   example: Department Name
         *                                   description: The name of the department.
         *                             description: The departments associated with the event.
         *                           venue:
         *                             type: object
         *                             properties:
         *                               id:
         *                                 type: integer
         *                                 example: 1
         *                                 description: The ID of the venue.
         *                               name:
         *                                 type: string
         *                                 example: Venue Name
         *                                 description: The name of the venue.
         *                               location:
         *                                 type: string
         *                                 example: Venue Location
         *                                 description: The location of the venue.
         *                               capacity:
         *                                 type: integer
         *                                 example: 100
         *                                 description: The capacity of the venue.
         *                             description: The venue details of the event.
         *                   description: The data containing the retrieved events.
         *       404:
         *         description: Institution not found. Indicates that the institution with the specified ID was not found.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 404
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Institution not found
         *                   description: The error message.
         *       422:
         *         description: Validation error. Indicates that the query parameters did not pass validation.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 422
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error.
         *                   description: The error message.
         */
        this.#router.get("/events", this.#authenticator.authenticateJWT, this.#controller.getEvents);

        /**
         * Deletes an event by its ID.
         * @param {object} req - The request object.
         * @param {object} req.query - The query parameters containing the event ID.
         * @param {number} req.query.eventId - The ID of the event to be deleted.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and message of the deletion operation.
         * @swagger
         * /api/v1/core/event:
         *   delete:
         *     summary: Deletes an event by its ID.
         *     description: Deletes an event by its ID.
         *     tags:
         *       - Event
         *     parameters:
         *       - in: header
         *         name: Authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *       - in: query
         *         name: eventId
         *         schema:
         *           type: integer
         *         required: true
         *         description: The ID of the event to be deleted.
         *     responses:
         *       200:
         *         description: Event deleted successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Event Deleted
         *                   description: The success message.
         *       404:
         *         description: Event not found. Indicates that the event with the specified ID was not found.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 404
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Event not found
         *                   description: The error message.
         *       422:
         *         description: Validation error. Indicates that the query parameters did not pass validation.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 422
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error.
         *                   description: The error message.
         */
        this.#router.delete("/event", this.#authenticator.authenticateJWT, this.#controller.deleteEvent);

        /**
         * Creates a new event.
         * @param {object} req - The request object.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} req.body - The request body containing the event details.
         * @param {string} req.body.name - The name of the event.
         * @param {string} req.body.startFrom - The start time of the event.
         * @param {string} req.body.endsAt - The end time of the event.
         * @param {number} req.body.requirementStatus - The requirement status of the event.
         * @param {boolean} req.body.recurring - Indicates whether the event is recurring.
         * @param {number} req.body.venueId - The ID of the venue for the event.
         * @param {number} req.body.InstitutionId - The ID of the institution associated with the event.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and message of the creation operation.
         * @swagger
         * /api/v1/core/event:
         *   post:
         *     summary: Creates a new event.
         *     description: Creates a new event.
         *     tags:
         *       - Event
         *     parameters:
         *       - in: header
         *         name: authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *       - in: body
         *         name: body
         *         description: The event details.
         *         required: true
         *         schema:
         *           type: object
         *           properties:
         *             name:
         *               type: string
         *               description: The name of the event.
         *             startFrom:
         *               type: string
         *               format: time
         *               description: The updated start time of the event.
         *             endsAt:
         *               type: string
         *               format: time
         *               description: The updated end time of the event.
         *             requirementStatus:
         *               type: number
         *               description: The requirement status of the event.
         *             recurring:
         *               type: boolean
         *               description: Indicates whether the event is recurring.
         *             venueId:
         *               type: integer
         *               description: The ID of the venue for the event.
         *     responses:
         *       200:
         *         description: Event created successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Course Created Successfully
         *                   description: The success message.
         *       400:
         *         description: Error creating event. Indicates that an error occurred while creating the event.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 400
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Error Creating Venue
         *                   description: The error message.
         *       422:
         *         description: Validation error. Indicates that the request body did not pass validation.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 422
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error.
         *                   description: The error message.
         */
        this.#router.post("/event", this.#authenticator.authenticateJWT, this.#controller.createEvent);

        /**
         * Updates an existing event.
         * @param {object} req - The request object.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} req.query - The query parameters containing the event ID.
         * @param {number} req.query.eventId - The ID of the event to be updated.
         * @param {object} req.body - The request body containing the updated event details.
         * @param {string} req.body.name - The updated name of the event.
         * @param {string} req.body.startFrom - The updated start time of the event.
         * @param {string} req.body.endsAt - The updated end time of the event.
         * @param {number} req.body.requirementStatus - The updated requirement status of the event.
         * @param {boolean} req.body.recurring - Indicates whether the event is recurring.
         * @param {number} req.body.venueId - The updated ID of the venue for the event.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and message of the update operation.
         * @swagger
         * /api/v1/core/event:
         *   put:
         *     summary: Updates an existing event.
         *     description: Updates an existing event.
         *     tags:
         *       - Event
         *     parameters:
         *       - in: header
         *         name: Authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *       - in: query
         *         name: eventId
         *         description: The ID of the event to be updated.
         *         required: true
         *         schema:
         *           type: integer
         *           format: int64
         *       - in: body
         *         name: body
         *         description: The updated event details.
         *         required: true
         *         schema:
         *           type: object
         *           properties:
         *             name:
         *               type: string
         *               description: The updated name of the event.
         *             startFrom:
         *               type: string
         *               format: time
         *               description: The updated start time of the event.
         *             endsAt:
         *               type: string
         *               format: time
         *               description: The updated end time of the event.
         *             requirementStatus:
         *               type: number
         *               description: The updated requirement status of the event.
         *             recurring:
         *               type: boolean
         *               description: Indicates whether the event is recurring.
         *             venueId:
         *               type: integer
         *               description: The updated ID of the venue for the event.
         *     responses:
         *       200:
         *         description: Event updated successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Event Updated
         *                   description: The success message.
         *       400:
         *         description: Error updating event. Indicates that an error occurred while updating the event.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 400
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Error Updating Event
         *                   description: The error message.
         *       422:
         *         description: Validation error. Indicates that the request body did not pass validation.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 422
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error.
         *                   description: The error message.
         */
        this.#router.put("/event", this.#authenticator.authenticateJWT, this.#controller.updateEvent);

        /**
         * Generates a new timetable for a department and sends it to all students enrolled in the department via email.
         * @param {object} req - The request object.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} req.query - The query parameters containing the department ID.
         * @param {number} req.query.departmentId - The ID of the department for which to generate the timetable.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status, message, and generated timetable URL.
         * @swagger
         * /api/v1/core/department-timetable:
         *   post:
         *     summary: Generates a new timetable for a department and sends it to all students via email.
         *     description: Generates a new timetable for a department based on the provided department ID and sends it to all students enrolled in the department via email.
         *     tags:
         *       - Class Timetable
         *     parameters:
         *       - in: header
         *         name: Authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *     responses:
         *       201:
         *         description: Timetable generated successfully and sent to students.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 201
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: TimeTable Generated Successfully
         *                   description: The success message.
         *                 data:
         *                   type: object
         *                   properties:
         *                     timetable:
         *                       type: object
         *                       description: The generated timetable.
         *                     timetableUrl:
         *                       type: string
         *                       example: https://example.com/timetable.xlsx
         *                       description: The URL to download the generated timetable.
         *       404:
         *         description: Department not found. Indicates that the department corresponding to the provided ID was not found.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 404
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Department not Found
         *                   description: The error message.
         *       422:
         *         description: Validation error. Indicates that the request parameters did not pass validation.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 422
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error
         *                   description: The error message.
         */
        this.#router.post("/department-timetable", this.#authenticator.authenticateJWT, this.#controller.generateNewDepartmentTable);


        /**
         * Updates the timetable for a department.
         * @param {object} req - The request object.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} req.body - The request body containing the department ID and payload for updating the timetable.
         * @param {number} req.body.departmentId - The ID of the department for which to update the timetable.
         * @param {number} req.body.courseId - The ID of the course to update in the timetable.
         * @param {string} req.body.day - The day to update the course entry (optional).
         * @param {string} req.body.venue - The venue where the course takes place (optional).
         * @param {string} req.body.startsFrom - The starting time of the course (optional).
         * @param {string} req.body.endsAt - The ending time of the course (optional).
         * @param {object} res - The response object.
         * @returns {object} The response containing the status, message, and updated timetable data.
         * @swagger
         * /api/v1/core/department-timetable:
         *   put:
         *     summary: Updates the timetable for a department.
         *     description: Updates the timetable for a department based on the provided department ID and course ID.
         *     tags:
         *       - Class Timetable
         *     parameters:
         *       - in: header
         *         name: Authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *       - in: body
         *         name: Course Timetable Update details
         *         schema:
         *           type: object
         *           properties:
         *             courseId:
         *               type: integer
         *               description: The ID of the course to update in the timetable.
         *             day:
         *               type: string
         *               description: The day to update the course entry(monday, tuesday, etc).
         *             venueId:
         *               type: string
         *               description: The venue where the course takes place.
         *             startsFrom:
         *               type: string
         *               description: The starting time of the course.
         *             endsAt:
         *               type: string
         *               description: The ending time of the course.
         *     responses:
         *       200:
         *         description: Timetable updated successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Timetable updated successfully
         *                   description: The success message.
         *                 data:
         *                   type: object
         *                   properties:
         *                     timetable:
         *                       type: object
         *                       description: The updated timetable.
         *                     timetableUrl:
         *                       type: string
         *                       example: https://example.com/timetable.xlsx
         *                       description: The URL to download the updated timetable.
         *       404:
         *         description: Department not found. Indicates that the department corresponding to the provided ID was not found.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 404
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Department not Found
         *                   description: The error message.
         *       422:
         *         description: Validation error. Indicates that the request body did not pass validation.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 422
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error
         *                   description: The error message.
         */
        this.#router.put("/department-timetable", this.#authenticator.authenticateJWT, this.#controller.updateTimeTable);

        /**
         * Retrieves the timetable for a department.
         * @param {object} req - The request object.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} req.query - The query parameters containing the department ID.
         * @param {number} req.query.departmentId - The ID of the department to retrieve the timetable for.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and timetable data.
         * @swagger
         * /api/v1/core/department-timetable:
         *   get:
         *     summary: Retrieves the timetable for a department.
         *     description: Retrieves the timetable for a department based on the provided department ID.
         *     tags:
         *       - Class Timetable
         *     parameters:
         *       - in: header
         *         name: Authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *       - in: query
         *         name: departmentId
         *         description: The ID of the department to retrieve the timetable for.
         *         required: true
         *         schema:
         *           type: integer
         *           format: int64
         *     responses:
         *       200:
         *         description: Timetable retrieved successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                   description: The HTTP status code.
         *                 data:
         *                   type: object
         *                   properties:
         *                     timetable:
         *                       type: object
         *                       description: The timetable data.
         *                     timetableUrl:
         *                       type: string
         *                       description: The URL to download the timetable.
         *       404:
         *         description: Department or Institution not found. Indicates that the department or institution corresponding to the provided ID was not found.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 404
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Department not Found
         *                   description: The error message.
         *       422:
         *         description: Validation error. Indicates that the request parameters did not pass validation.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 422
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error
         *                   description: The error message.
         */
        this.#router.get("/department-timetable", this.#authenticator.authenticateJWT, this.#controller.getDepartmentTimeTable);

        /**
         * Retrieves the timetable for a student.
         * @param {object} req - The request object.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and timetable data.
         * @swagger
         * /api/v1/core/student-timetable:
         *   get:
         *     summary: Retrieves the timetable for a student.
         *     description: Retrieves the timetable for a student.
         *     tags:
         *       - Class Timetable
         *     parameters:
         *       - in: header
         *         name: Authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *     responses:
         *       200:
         *         description: Timetable retrieved successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                   description: The HTTP status code.
         *                 data:
         *                   type: object
         *                   properties:
         *                     timetable:
         *                       type: object
         *                       description: The timetable data.
         *                     timetableUrl:
         *                       type: string
         *                       description: The URL to download the timetable.
         *       404:
         *         description: Department or Institution not found. Indicates that the department or institution corresponding to the provided ID was not found.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 404
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Department not Found
         *                   description: The error message.
         *       422:
         *         description: Validation error. Indicates that the request parameters did not pass validation.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 422
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error
         *                   description: The error message.
         */
        this.#router.get("/student-timetable", this.#authenticator.authenticateJWT, this.#controller.getStudentTimeTable)

        /**
         * Retrieves the timetable for an institution.
         * @param {object} req - The request object.
         * @param {object} req.headers - The hear parameters containing the institution ID.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and timetable data.
         * @swagger
         * /api/v1/core/institution-timetable:
         *   get:
         *     summary: Retrieves the timetable for an institution.
         *     description: Retrieves the timetable for an institution based on the provided institution ID.
         *     tags:
         *       - Class Timetable
         *     parameters:
         *       - in: header
         *         name: Authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *     responses:
         *       200:
         *         description: Timetable retrieved successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                   description: The HTTP status code.
         *                 data:
         *                   type: object
         *                   properties:
         *                     timetables:
         *                       type: object
         *                       description: The timetable data.
         *                     timetableUrl:
         *                       type: string
         *                       description: The URL to download the timetable.
         *       404:
         *         description: Institution or Department not found. Indicates that the institution or department corresponding to the provided ID was not found.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 404
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Institution not Found
         *                   description: The error message.
         *       422:
         *         description: Validation error. Indicates that the request parameters did not pass validation.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 422
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error
         *                   description: The error message.
         */
        this.#router.get("/institution-timetable", this.#authenticator.authenticateJWT, this.#controller.getInstitutionTimeTable);

        /**
         * Retrieves the timetable for a staff member.
         * @param {object} req - The request object.
         * @param {object} req.headers - The hear parameters containing the institution ID.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and timetable data.
         * @swagger
         * /api/v1/core/staff-timetable:
         *   get:
         *     summary: Retrieves the timetable for a staff member.
         *     description: Retrieves the timetable for a staff member based on the provided staff ID.
         *     tags:
         *       - Class Timetable
         *     parameters:
         *       - in: header
         *         name: Authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *     responses:
         *       200:
         *         description: Timetable retrieved successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                   description: The HTTP status code.
         *                 data:
         *                   type: object
         *                   properties:
         *                     timetables:
         *                       type: object
         *                       description: The timetable data.
         *                     timetableUrl:
         *                       type: string
         *                       description: The URL to download the timetable.
         *       404:
         *         description: Staff or Department not found. Indicates that the staff member or department corresponding to the provided ID was not found.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 404
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Staff not Found
         *                   description: The error message.
         *       422:
         *         description: Validation error. Indicates that the request parameters did not pass validation.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 422
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error
         *                   description: The error message.
         */
        this.#router.get("/staff-timetable", this.#authenticator.authenticateJWT, this.#controller.getStaffTimeTable);


        /**
         * Sends the timetable to a student via email.
         * @param {object} req - The request object.
         * @param {object} req.headers - The hear parameters containing the institution ID.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and message.
         * @swagger
         * /api/v1/core/student-timetable:
         *   post:
         *     summary: Sends the timetable to a student via email.
         *     description: Sends the timetable to a student based on the provided student ID.
         *     tags:
         *       - Class Timetable
         *     parameters:
         *       - in: header
         *         name: Authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *     responses:
         *       200:
         *         description: Timetable sent successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Timetable Sent to example@email.com
         *                   description: The success message.
         *       404:
         *         description: Student, Department, or Institution not found. Indicates that the student, department, or institution corresponding to the provided ID was not found.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 404
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Student not Found
         *                   description: The error message.
         *       422:
         *         description: Validation error. Indicates that the request parameters did not pass validation.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 422
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error
         *                   description: The error message.
         */
        this.#router.post("/student-timetable", this.#authenticator.authenticateJWT, this.#controller.sendStudentTimeTable);


        /**
         * Sends the timetable to a staff member via email.
         * @param {object} req - The request object.
         * @param {object} req.headers - The header parameters containing the institution ID.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and message.
         * @swagger
         * /api/v1/core/staff-timetable:
         *   post:
         *     summary: Sends the timetable to a staff member via email.
         *     description: Sends the timetable to a staff member based on the provided staff ID.
         *     tags:
         *       - Class Timetable
         *     parameters:
         *       - in: header
         *         name: Authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *     responses:
         *       200:
         *         description: Timetable sent successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Timetable sent successfully
         *                   description: The success message.
         *       404:
         *         description: Staff not found. Indicates that the staff corresponding to the provided ID was not found.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 404
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Staff not Found
         *                   description: The error message.
         *       422:
         *         description: Validation error. Indicates that the request parameters did not pass validation.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 422
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error
         *                   description: The error message.
         */
        this.#router.post("/staff-timetable", this.#authenticator.authenticateJWT, this.#controller.sendStaffTimeTable);

        /**
         * Get levels by institution ID.
         * @param {object} req - The request object.
         * @param {string} req.query.institutionId - The ID of the institution.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status, message, and levels data.
         * @swagger
         * /api/v1/core/levels:
         *   get:
         *     summary: Get levels by institution ID.
         *     description: Retrieve levels based on the provided institution ID.
         *     tags:
         *       - Level
         *     parameters:
         *       - in: query
         *         name: institutionId
         *         required: true
         *         schema:
         *           type: integer
         *         description: The ID of the institution.
         *     responses:
         *       200:
         *         description: Levels retrieved successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                   description: The HTTP status code.
         *                 data:
         *                   type: object
         *                   properties:
         *                     levels:
         *                       type: array
         *                       items:
         *                         type: object
         *                         properties:
         *                           id:
         *                             type: integer
         *                             description: The level ID.
         *                           name:
         *                             type: string
         *                             description: The name of the level.
         *       422:
         *         description: Validation error. Indicates that the request parameters did not pass validation.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 422
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error
         *                   description: The error message.
         */
        this.#router.get("/levels", this.#controller.getLevelsByInstitutionId);


        /**
         * Get departments by institution ID.
         * @param {object} req - The request object.
         * @param {string} req.query.institutionId - The ID of the institution.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status, message, and departments data.
         * @swagger
         * /api/v1/core/departments:
         *   get:
         *     summary: Get departments by institution ID.
         *     description: Retrieve departments based on the provided institution ID.
         *     tags:
         *       - Department
         *     parameters:
         *       - in: query
         *         name: institutionId
         *         required: true
         *         schema:
         *           type: integer
         *         description: The ID of the institution.
         *     responses:
         *       200:
         *         description: Departments retrieved successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                   description: The HTTP status code.
         *                 data:
         *                   type: object
         *                   properties:
         *                     departments:
         *                       type: array
         *                       items:
         *                         type: object
         *                         properties:
         *                           id:
         *                             type: integer
         *                             description: The department ID.
         *                           name:
         *                             type: string
         *                             description: The name of the department.
         *       422:
         *         description: Validation error. Indicates that the request parameters did not pass validation.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 422
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error
         *                   description: The error message.
         */
        this.#router.get("/departments", this.#controller.getDepartmentsByInstitutionId);

        /**
         * Delete a level by ID.
         * @param {object} req - The request object.
         * @param {string} req.query.levelId - The ID of the level to delete.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and message.
         * @swagger
         * /api/v1/core/level:
         *   delete:
         *     summary: Delete a level by ID.
         *     description: Delete a level based on the provided level ID.
         *     tags:
         *       - Level
         *     parameters:
         *       - in: query
         *         name: levelId
         *         required: true
         *         schema:
         *           type: integer
         *         description: The ID of the level to delete.
         *     responses:
         *       200:
         *         description: Level deleted successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Level deleted successfully
         *                   description: The success message.
         *       400:
         *         description: An error occurred during deletion.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 400
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: An error occurred
         *                   description: The error message.
         *       404:
         *         description: Level not found. Indicates that the provided level ID does not exist.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 404
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Level not found
         *                   description: The error message.
         *       422:
         *         description: Validation error. Indicates that the request parameters did not pass validation.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 422
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error
         *                   description: The error message.
         */
        this.#router.delete("/level", this.#controller.deleteLevel);


        /**
         * Add a new level.
         * @param {object} req - The request object.
         * @param {object} req.headers - The hear parameters containing the institution ID.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} req.body - The payload containing the level data.
         * @param {string} req.body.level - The name of the level.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and message.
         * @swagger
         * /api/v1/core/level:
         *   post:
         *     summary: Add a new level.
         *     description: Add a new level to the specified institution.
         *     tags:
         *       - Level
         *     parameters:
         *       - in: header
         *         name: authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *       - in: body
         *         name: Level Payload
         *         schema:
         *           type: object
         *           properties:
         *             level:
         *               type: string
         *               description: The name of the level.
         *               example: Grade 10
         *     responses:
         *       201:
         *         description: Level added successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 201
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Level Added
         *                   description: The success message.
         *       400:
         *         description: An error occurred during level creation.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 400
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: An error occurred
         *                   description: The error message.
         *       404:
         *         description: Institution not found. Indicates that the provided institution ID does not exist.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 404
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Institution not found
         *                   description: The error message.
         *       422:
         *         description: Validation error. Indicates that the request parameters did not pass validation.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 422
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error
         *                   description: The error message.
         */
        this.#router.post("/level", this.#authenticator.authenticateJWT, this.#controller.createLevel);

        /**
         * Get students by department ID.
         * @param {object} req - The request object.
         * @param {object} req.headers - The hear parameters containing the institution ID.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} req.query - The query parameters.
         * @param {number} req.query.page - The page number for pagination.
         * @param {number} req.query.size - The size of each page for pagination.
         * @param {object} res - The response object.
         * @returns {object} The response containing the students for the department.
         * @swagger
         * /api/v1/core/students-department:
         *   get:
         *     summary: Get students by department ID.
         *     description: Retrieve students for a department based on the provided staff member ID.
         *     tags:
         *       - Student
         *     parameters:
         *       - in: header
         *         name: authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *       - in: query
         *         name: page
         *         required: true
         *         schema:
         *           type: integer
         *         description: The page number for pagination.
         *       - in: query
         *         name: size
         *         required: true
         *         schema:
         *           type: integer
         *         description: The size of each page for pagination.
         *     responses:
         *       200:
         *         description: Students retrieved successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                   description: The HTTP status code.
         *                 data:
         *                   type: object
         *                   properties:
         *                     students:
         *                       type: array
         *                       items:
         *                         type: object
         *                         description: Student object.
         *                 description: The success message.
         *       404:
         *         description: Staff not found. Indicates that the staff member with the provided ID was not found.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 404
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Staff not Found
         *                   description: The error message.
         *       422:
         *         description: Validation error. Indicates that the request parameters did not pass validation.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 422
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error
         *                   description: The error message.
         */
        this.#router.get("/students-department", this.#authenticator.authenticateJWT, this.#controller.getStudentByDepartmentId);


        /**
         * Get staff members by department ID.
         * @param {object} req - The request object.
         * @param {object} req.headers - The hear parameters containing the institution ID.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} req.query - The query parameters.
         * @param {number} req.query.page - The page number for pagination.
         * @param {number} req.query.size - The size of each page for pagination.
         * @param {object} res - The response object.
         * @returns {object} The response containing the staff members for the department.
         * @swagger
         * /api/v1/core/staffs-department:
         *   get:
         *     summary: Get staff members by department ID.
         *     description: Retrieve staff members for a department based on the provided department ID.
         *     tags:
         *       - Staff
         *     parameters:
         *       - in: header
         *         name: authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *       - in: query
         *         name: page
         *         required: true
         *         schema:
         *           type: integer
         *         description: The page number for pagination.
         *       - in: query
         *         name: size
         *         required: true
         *         schema:
         *           type: integer
         *         description: The size of each page for pagination.
         *     responses:
         *       200:
         *         description: Staff members retrieved successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                   description: The HTTP status code.
         *                 data:
         *                   type: object
         *                   properties:
         *                     staffs:
         *                       type: array
         *                       items:
         *                         type: object
         *                         description: Staff member object.
         *                 description: The success message.
         *       404:
         *         description: Staff not found. Indicates that the staff member with the provided ID was not found.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 404
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Staff not Found
         *                   description: The error message.
         *       422:
         *         description: Validation error. Indicates that the request parameters did not pass validation.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 422
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error
         *                   description: The error message.
         */
        this.#router.get("/staffs-department", this.#authenticator.authenticateJWT, this.#controller.getStaffByDepartmentId);


        /**
         * Get examination courses for a department.
         * @param {object} req - The request object.
         * @param {object} req.headers - The hear parameters containing the institution ID.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} req.query - The query parameters.
         * @param {number} req.query.departmentId - The ID of the department to get examination courses for.
         * @param {object} res - The response object.
         * @returns {object} The response containing the examination courses for the department.
         * @swagger
         * /api/v1/core/exam-courses:
         *   get:
         *     summary: Get examination courses for a department.
         *     description: Retrieve examination courses for a department based on the provided department ID.
         *     tags:
         *       - Examination
         *     parameters:
         *       - in: header
         *         name: authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *       - in: query
         *         name: departmentId
         *         required: true
         *         schema:
         *           type: integer
         *         description: The ID of the department to get examination courses for.
         *     responses:
         *       200:
         *         description: Examination courses retrieved successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                   description: The HTTP status code.
         *                 data:
         *                   type: object
         *                   properties:
         *                     examCourses:
         *                       type: array
         *                       items:
         *                         type: object
         *                         description: Examination course object.
         *                 description: The success message.
         *       404:
         *         description: Staff not found. Indicates that the department with the provided ID was not found.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 404
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Staff not Found
         *                   description: The error message.
         *       422:
         *         description: Validation error. Indicates that the request parameters did not pass validation.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 422
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error
         *                   description: The error message.
         */
        this.#router.get("/exam-courses", this.#authenticator.authenticateJWT, this.#controller.getDepartmentExamCourses);


        /**
         * Remove an examination course.
         * @param {object} req - The request object.
         * @param {object} req.headers - The hear parameters containing the institution ID.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} req.query - The query parameters.
         * @param {number} req.query.courseId - The ID of the examination course to remove.
         * @param {object} res - The response object.
         * @returns {object} The response indicating the status of the operation.
         * @swagger
         * /api/v1/core/exam-course:
         *   delete:
         *     summary: Remove an examination course.
         *     description: Delete an examination course based on the provided course ID.
         *     tags:
         *       - Examination
         *     parameters:
         *       - in: header
         *         name: authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *       - in: query
         *         name: courseId
         *         required: true
         *         schema:
         *           type: integer
         *         description: The ID of the examination course to remove.
         *     responses:
         *       200:
         *         description: Examination course deleted successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Exam Deleted Successfully
         *                   description: The success message.
         *       400:
         *         description: An error occurred. Indicates that an unexpected error occurred while deleting the examination course.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 400
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: An error occurred
         *                   description: The error message.
         *       422:
         *         description: Validation error. Indicates that the request parameters did not pass validation.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 422
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error
         *                   description: The error message.
         */
        this.#router.delete("/exam-course", this.#authenticator.authenticateJWT, this.#controller.removeExaminationCourse);


        /**
         * Get examination timetable for a staff member.
         * @param {object} req - The request object.
         * @param {object} req.headers - The hear parameters containing the institution ID.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} res - The response object.
         * @returns {object} The response containing the examination timetable and URL.
         * @swagger
         * /api/v1/core/exam-timetable-staff:
         *   get:
         *     summary: Get examination timetable for a staff member.
         *     description: Retrieve the examination timetable for a staff member based on the provided user ID.
         *     tags:
         *       - Examination
         *     parameters:
         *       - in: header
         *         name: authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *     responses:
         *       200:
         *         description: Examination timetable retrieved successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                   description: The HTTP status code.
         *                 data:
         *                   type: object
         *                   properties:
         *                     timetable:
         *                       type: object
         *                       description: The examination timetable.
         *                     timetableUrl:
         *                       type: string
         *                       format: url
         *                       description: The URL to download the examination timetable.
         *                   description: The data containing the examination timetable and URL.
         *       404:
         *         description: Staff not found. Indicates that the provided staff ID does not exist.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 404
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Staff not found
         *                   description: The error message.
         *       422:
         *         description: Validation error. Indicates that the request parameters did not pass validation.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 422
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error
         *                   description: The error message.
         */
        this.#router.get("/exam-timetable-staff", this.#authenticator.authenticateJWT, this.#controller.getStaffExamTimeTable);

       /**
         * Get examination timetable for a student.
         * @param {object} req - The request object.
         * @param {object} req.headers - The hear parameters containing the institution ID.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} res - The response object.
         * @returns {object} The response containing the examination timetable and URL.
         * @swagger
         * /api/v1/core/exam-timetable-student:
         *   get:
         *     summary: Get examination timetable for a student.
         *     description: Retrieve the examination timetable for a student based on the provided user ID.
         *     tags:
         *       - Examination
         *     parameters:
         *       - in: header
         *         name: authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *     responses:
         *       200:
         *         description: Examination timetable retrieved successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                   description: The HTTP status code.
         *                 data:
         *                   type: object
         *                   properties:
         *                     timetable:
         *                       type: object
         *                       description: The examination timetable.
         *                     timetableUrl:
         *                       type: string
         *                       format: url
         *                       description: The URL to download the examination timetable.
         *                   description: The data containing the examination timetable and URL.
         *       404:
         *         description: Student not found. Indicates that the provided student ID does not exist.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 404
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Student not found
         *                   description: The error message.
         *       422:
         *         description: Validation error. Indicates that the request parameters did not pass validation.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 422
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error
         *                   description: The error message.
         */
        this.#router.get("/exam-timetable-student", this.#authenticator.authenticateJWT, this.#controller.getStudentExamTimeTable);


        /**
         * Get examination timetable for an institution.
         * @param {object} req - The request object.
         * @param {object} req.headers - The hear parameters containing the institution ID.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} res - The response object.
         * @returns {object} The response containing the examination timetable and URL.
         * @swagger
         * /api/v1/core/exam-timetable-institution:
         *   get:
         *     summary: Get examination timetable for an institution.
         *     description: Retrieve the examination timetable for an institution based on the provided institution ID.
         *     tags:
         *       - Examination
         *     parameters:
         *       - in: header
         *         name: authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *     responses:
         *       200:
         *         description: Examination timetable retrieved successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                   description: The HTTP status code.
         *                 data:
         *                   type: object
         *                   properties:
         *                     timetable:
         *                       type: object
         *                       description: The examination timetable.
         *                     timetableUrl:
         *                       type: string
         *                       format: url
         *                       description: The URL to download the examination timetable.
         *                   description: The data containing the examination timetable and URL.
         *       404:
         *         description: Institution not found. Indicates that the provided institution ID does not exist.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 404
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Institution not found
         *                   description: The error message.
         *       422:
         *         description: Validation error. Indicates that the request parameters did not pass validation.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 422
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error
         *                   description: The error message.
         */
        this.#router.get("/exam-timetable-institution", this.#authenticator.authenticateJWT, this.#controller.getInstitutionExamTimeTable);


        /**
         * Get examination timetable for a department.
         * @param {object} req - The request object.
         * @param {object} req.headers - The hear parameters containing the institution ID.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} res - The response object.
         * @returns {object} The response containing the examination timetable and URL.
         * @swagger
         * /api/v1/core/exam-timetable-department:
         *   get:
         *     summary: Get examination timetable for a department.
         *     description: Retrieve the examination timetable for a department based on the provided department ID.
         *     tags:
         *       - Examination
         *     parameters:
         *       - in: header
         *         name: authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *       - in: query
         *         name: departmentId
         *         required: true
         *         schema:
         *           type: integer
         *         description: The ID of the department.
         *     responses:
         *       200:
         *         description: Examination timetable retrieved successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                   description: The HTTP status code.
         *                 data:
         *                   type: object
         *                   properties:
         *                     timetable:
         *                       type: object
         *                       description: The examination timetable.
         *                     timetableUrl:
         *                       type: string
         *                       format: url
         *                       description: The URL to download the examination timetable.
         *                   description: The data containing the examination timetable and URL.
         *       404:
         *         description: Department or institution not found. Indicates that the provided department or institution ID does not exist.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 404
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Department not found
         *                   description: The error message.
         *       422:
         *         description: Validation error. Indicates that the request parameters did not pass validation.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 422
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error
         *                   description: The error message.
         */
        this.#router.get("/exam-timetable-department", this.#authenticator.authenticateJWT, this.#controller.getDepartmentExamTimeTable);


        /**
         * Update an examination course.
         * @param {object} req - The request object.
         * @param {object} req.headers - The hear parameters containing the institution ID.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} req.query - The query parameters.
         * @param {number} req.query.courseId - The ID of the course to update.
         * @param {object} req.body - The request body.
         * @param {number} req.body.CourseId - The ID of the course.
         * @param {number} req.body.LevelId - The ID of the level.
         * @param {number} req.body.VenueId - The ID of the venue.
         * @param {number} req.body.duration - The duration of the course.
         * @param {object} res - The response object.
         * @returns {object} The response indicating the status of the operation.
         * @swagger
         * /api/v1/core/exam-course:
         *   put:
         *     summary: Update an examination course.
         *     description: Update an examination course based on the provided course ID.
         *     tags:
         *       - Examination
         *     parameters:
         *       - in: header
         *         name: authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *       - in: query
         *         name: courseId
         *         schema:
         *           type: integer
         *         required: true
         *         description: The ID of the course to update.
         *       - in: body
         *         name: body
         *         description: The request body.
         *         required: true
         *         schema:
         *           type: object
         *           properties:
         *             CourseId:
         *               type: integer
         *               description: The ID of the course.
         *             LevelId:
         *               type: integer
         *               description: The ID of the level.
         *             VenueId:
         *               type: integer
         *               description: The ID of the venue.
         *             duration:
         *               type: integer
         *               description: The duration of the course.
         *     responses:
         *       200:
         *         description: Course updated successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Course Updated
         *                   description: The success message.
         *                 data:
         *                   type: object
         *                   description: Additional data related to the response.
         *                   properties:
         *                     timetable:
         *                       type: object
         *                       description: The updated timetable.
         *       404:
         *         description: Course not updated. Indicates that the course associated with the provided course ID was not updated.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 404
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Course not updated
         *                   description: The error message.
         *       422:
         *         description: Validation error. Indicates that the request parameters did not pass validation.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 422
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error
         *                   description: The error message.
         */
        this.#router.put("/exam-course", this.#authenticator.authenticateJWT, this.#controller.updateExaminationCourse);


        /**
         * Generate a new exam timetable for a department.
         * @param {object} req - The request object.
         * @param {object} req.headers - The hear parameters containing the institution ID.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} req.body - The request body.
         * @param {number} req.body.startsAt - The start date of the exam timetable.
         * @param {number} req.body.endsAt - The end date of the exam timetable.
         * @param {object} res - The response object.
         * @returns {object} The response indicating the status of the operation.
         * @swagger
         * /api/v1/core/exam-timetable-department:
         *   post:
         *     summary: Generate a new exam timetable for a department.
         *     description: Generate a new exam timetable for a department based on the provided start and end dates.
         *     tags:
         *       - Examination
         *     parameters:
         *       - in: header
         *         name: authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *       - in: body
         *         name: body
         *         description: The request body.
         *         required: true
         *         schema:
         *           type: object
         *           properties:
         *             startsAt:
         *               type: string
         *               format: date
         *               description: The start date of the exam timetable.
         *             endsAt:
         *               type: string
         *               format: date
         *               description: The end date of the exam timetable.
         *     responses:
         *       201:
         *         description: Exam timetable generated successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 201
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: TimeTable Generated Successfully
         *                   description: The success message.
         *                 data:
         *                   type: object
         *                   properties:
         *                     timetable:
         *                       type: object
         *                       description: The generated exam timetable.
         *       404:
         *         description: Staff, department, or institution not found. Indicates that the staff, department, or institution associated with the provided staff ID was not found.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 404
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Staff not Found
         *                   description: The error message.
         *       422:
         *         description: Validation error. Indicates that the request parameters did not pass validation.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 422
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error
         *                   description: The error message.
         */
        this.#router.post("/exam-timetable-department", this.#authenticator.authenticateJWT, this.#controller.generateNewExamTimeTable);


        /**
         * Add an examination course.
         * @param {object} req - The request object.
         * @param {object} req.headers - The hear parameters containing the institution ID.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} req.body - The request body.
         * @param {number} req.body.CourseId - The ID of the course.
         * @param {number} req.body.LevelId - The ID of the level.
         * @param {number} req.body.VenueId - The ID of the venue.
         * @param {number} req.body.duration - The duration of the course.
         * @param {object} res - The response object.
         * @returns {object} The response indicating the status of the operation.
         * @swagger
         * /api/v1/core/exam-course:
         *   post:
         *     summary: Add an examination course.
         *     description: Add an examination course based on the provided course, level, venue, and duration.
         *     tags:
         *       - Examination
         *     parameters:
         *       - in: header
         *         name: authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *       - in: body
         *         name: body
         *         description: The request body.
         *         required: true
         *         schema:
         *           type: object
         *           properties:
         *             CourseId:
         *               type: integer
         *               description: The ID of the course.
         *             LevelId:
         *               type: integer
         *               description: The ID of the level.
         *             VenueId:
         *               type: integer
         *               description: The ID of the venue.
         *             duration:
         *               type: integer
         *               description: The duration of the course.
         *     responses:
         *       201:
         *         description: Course added successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 201
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Course Added
         *                   description: The success message.
         *       400:
         *         description: An error occurred. Indicates that an error occurred while adding the course.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 400
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: An error occurred
         *                   description: The error message.
         *       404:
         *         description: Department not found. Indicates that the department associated with the provided course ID was not found.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 404
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Department not Found
         *                   description: The error message.
         *       422:
         *         description: Validation error. Indicates that the request parameters did not pass validation.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 422
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 500
         *                   description: The HTTP status code.
         *                 message:
         *                   type: string
         *                   example: Internal Server Error
         *                   description: The error message.
         */
        this.#router.post("/exam-course", this.#authenticator.authenticateJWT, this.#controller.addExaminationCourse);

        /**
         * Get staff admin dashboard information.
         * @param {object} req - The request object.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} res - The response object.
         * @returns {object} The staff admin dashboard information.
         * @swagger
         * /api/v1/core/staff-dashboard:
         *   get:
         *     summary: Get staff admin dashboard information.
         *     description: Retrieve information related to the staff admin dashboard.
         *     tags:
         *       - Dashboard
         *     parameters:
         *       - in: header
         *         name: authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *     responses:
         *       200:
         *         description: Staff admin dashboard information retrieved successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                   description: The HTTP status code.
         *                 data:
         *                   type: object
         *                   description: The staff admin dashboard data.
         *       401:
         *         description: Unauthorized. Indicates that the user is not authorized to access the resource.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Unauthorized
         *                   description: The error message.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Internal Server Error
         *                   description: The error message.
         */
        this.#router.get("/staff-dashboard", this.#authenticator.authenticateJWT, this.#controller.getStaffAdminDashboard);


        /**
         * Get institution dashboard information.
         * @param {object} req - The request object.
         * @param {string} req.userId - The user ID.
         * @param {object} res - The response object.
         * @returns {object} The institution dashboard information.
         * @swagger
         * /api/v1/core/institution-dashboard:
         *   get:
         *     summary: Get institution dashboard information.
         *     description: Retrieve information related to the institution dashboard.
         *     tags:
         *       - Dashboard
         *     parameters:
         *       - in: header
         *         name: authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *     responses:
         *       200:
         *         description: Institution dashboard information retrieved successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                   example: 200
         *                   description: The HTTP status code.
         *                 data:
         *                   type: object
         *                   description: The institution dashboard data.
         *       401:
         *         description: Unauthorized. Indicates that the user is not authorized to access the resource.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Unauthorized
         *                   description: The error message.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Internal Server Error
         *                   description: The error message.
         */
        this.#router.get("/institution-dashboard", this.#authenticator.authenticateJWT, this.#controller.getInstitutionDashboard);



    }

    getRouter = () => {
        return this.#router;
    }
}


module.exports = CoreRouter;