let express = require("express");
let UserController = require("../../controllers/UserController");
const Authenticator = require("../../utils/Authenticator");


let instance;
class UserRouter {

    #router;
    #controller;
    #authenticator;


    constructor() {

        if (instance) return instance;

        this.#router = express.Router();
        this.#controller = new UserController();
        this.#authenticator = new Authenticator();
        this.#configure();


        instance = this;

    }

    #configure = () => {

        /**
         * Registers a new student.
         * @param {object} req - The request object.
         * @param {object} req.body - The request body containing student registration data.
         * @param {string} req.body.emailAddress - The email address of the student.
         * @param {string} req.body.password - The password of the student.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and message.
         * @swagger
         * /api/v1/user/register-student:
         *   post:
         *     summary: Registers a new student.
         *     description: Registers a new student account with the provided email address and password.
         *     tags:
         *      - Student
         *     parameters:
         *       - in: body
         *         name: StudentRegistration
         *         description: Student registration data.
         *         required: true
         *         schema:
         *           type: object
         *           properties:
         *             emailAddress:
         *               type: string
         *               description: The email address of the student.
         *               example: example@student.com
         *             password:
         *               type: string
         *               description: The password of the student.
         *               example: password123
         *     responses:
         *       201:
         *         description: Account created successfully. Please check your email for verification link.
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
         *                   example: Account created successfully. Please check your email for verification link.
         *                 data:
         *                   type: object
         *                   properties:
         *                     emailAddress:
         *                       type: string
         *                       example: test@example.com
         *                       description: The email address of the registered student.
         *       422:
         *         description: Validation error. Indicates that the request body is invalid.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Validation error
         *                   description: The error message.
         *                 data:
         *                   type: object
         *                   description: The validation errors.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Internal server error
         *                   description: The error message.
         */
        this.#router.post("/register-student", this.#controller.registerStudent);

        /**
         * Registers a new Staff.
         * @param {object} req - The request object.
         * @param {object} req.body - The request body containing Staff registration data.
         * @param {string} req.body.emailAddress - The email address of the Staff.
         * @param {string} req.body.password - The password of the Staff.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and message.
         * @swagger
         * /api/v1/user/register-tutor:
         *   post:
         *     summary: Registers a new staff.
         *     description: Registers a new staff account with the provided email address and password.
         *     tags:
         *       - Staff
         *     parameters:
         *       - in: body
         *         name: StaffRegistration
         *         description: Staff registration data.
         *         required: true
         *         schema:
         *           type: object
         *           properties:
         *             emailAddress:
         *               type: string
         *               description: The email address of the staff.
         *               example: example@student.com
         *             password:
         *               type: string
         *               description: The password of the staff.
         *               example: password123
         *     responses:
         *       201:
         *         description: Account created successfully. Please check your email for verification link.
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
         *                   example: Account created successfully. Please check your email for verification link.
         *                 data:
         *                   type: object
         *                   properties:
         *                     emailAddress:
         *                       type: string
         *                       example: test@example.com
         *                       description: The email address of the registered student.
         *       422:
         *         description: Validation error. Indicates that the request body is invalid.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Validation error
         *                   description: The error message.
         *                 data:
         *                   type: object
         *                   description: The validation errors.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Internal server error
         *                   description: The error message.
         */
        this.#router.post("/register-tutor", this.#controller.registerTutor);

        /**
         * @swagger
         * /api/v1/user/activate-account:
         *   put:
         *     summary: Activate user account
         *     description: Activates a user account using a provided token.
         *     tags:
         *       - User
         *     parameters:
         *       - in: query
         *         name: token
         *         description: The activation token received by the user.
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Account activated successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: number
         *                   example: 200
         *                 message:
         *                   type: string
         *                   example: Account activated successfully
         *       400:
         *         description: An error occurred while activating account
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: number
         *                   example: 400
         *                 error:
         *                   type: string
         *                   example: An error occurred while activating account
         *       404:
         *         description: Invalid or expired token / User not found
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: number
         *                   example: 404
         *                 message:
         *                   type: string
         *                   example: Invalid or expired token / User not found
         *       422:
         *         description: Validation error
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Validation error
         *                 data:
         *                   type: object
         *     security: []
         */
        this.#router.put("/activate-account", this.#controller.activateAccount);

        /**
         * @swagger
         * /api/v1/user/request-activation-link:
         *   post:
         *     summary: Request new activation link
         *     description: Sends a new activation link to the provided email address.
         *     tags:
         *       - User
         *     parameters:
         *       - in: query
         *         name: emailAddress
         *         description: The email address to which the activation link will be sent.
         *         required: true
         *         schema:
         *           type: string
         *           format: email
         *     responses:
         *       200:
         *         description: Verification link sent successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: number
         *                   example: 200
         *                 message:
         *                   type: string
         *                   example: Verification link sent successfully. Please check your email
         *       400:
         *         description: Account already activated
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: number
         *                   example: 400
         *                 message:
         *                   type: string
         *                   example: Account already activated
         *       404:
         *         description: Email Address not found
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: number
         *                   example: 404
         *                 message:
         *                   type: string
         *                   example: Email Address not found
         *       422:
         *         description: Validation error
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Validation error
         *                 data:
         *                   type: object
         */
        this.#router.post("/request-activation-link", this.#controller.requestNewActivationLink);
        
        /**
         * Initiates a password reset.
         * @param {object} req - The request object.
         * @param {object} req.body - The request body containing the email address for password reset.
         * @param {string} req.body.emailAddress - The email address of the user requesting password reset.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and message.
         * @swagger
         * /api/v1/user/initiate-password-reset:
         *   post:
         *     summary: Initiates a password reset.
         *     description: Initiates a password reset for the provided email address and sends an OTP to reset the password, This endpoint can also be used to request for new otp after first one expires or wasn't recieved.
         *     tags:
         *      - User
         *     parameters:
         *       - in: body
         *         name: PasswordResetRequest
         *         description: Email address for password reset.
         *         required: true
         *         schema:
         *           type: object
         *           properties:
         *             emailAddress:
         *               type: string
         *               description: The email address of the user requesting password reset.
         *               example: example@example.com
         *     responses:
         *       200:
         *         description: Password reset initiated successfully. Check your email for OTP.
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
         *                   example: Password reset initiated. Please check your email for OTP.
         *       404:
         *         description: Email address not found. Indicates that the provided email address does not exist in the system.
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
         *                   example: Email Address example@example.com not found.
         *       422:
         *         description: Validation error. Indicates that the request body is invalid.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Validation error
         *                   description: The error message.
         *                 data:
         *                   type: object
         *                   description: The validation errors.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Internal server error
         *                   description: The error message.
         */
        this.#router.post("/initiate-password-reset", this.#controller.initiatePasswordReset); //can also be used for requesting new password reset otp
        
        /**
         * Completes a password reset.
         * @param {object} req - The request object.
         * @param {object} req.body - The request body containing the OTP and new password for completing the password reset.
         * @param {string} req.body.otp - The OTP (One-Time Password) received for password reset.
         * @param {string} req.body.newPassword - The new password to be set for the user.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and message.
         * @swagger
         * /api/v1/user/complete-password-reset:
         *   put:
         *     summary: Completes a password reset.
         *     description: Completes the password reset process by verifying the OTP and updating the user's password.
         *     tags:
         *       - User
         *     parameters:
         *       - in: body
         *         name: PasswordResetCompletion
         *         description: OTP and new password for completing password reset.
         *         required: true
         *         schema:
         *           type: object
         *           properties:
         *             otp:
         *               type: string
         *               description: The OTP (One-Time Password) received for password reset.
         *               example: 123456
         *             newPassword:
         *               type: string
         *               description: The new password to be set for the user.
         *               example: newPassword123
         *     responses:
         *       200:
         *         description: Password changed successfully.
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
         *                   example: Password changed successfully.
         *       400:
         *         description: An error occurred while changing password. Indicates a failure in updating the user's password.
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
         *                   example: An error occurred while changing password.
         *       404:
         *         description: Invalid or expired OTP. Indicates that the provided OTP is invalid or expired.
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
         *                   example: Invalid or expired OTP.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Internal server error
         *                   description: The error message.
         */
        this.#router.put("/complete-password-reset", this.#controller.completePasswordReset);

        /**
         * Signs in a user.
         * @param {object} req - The request object.
         * @param {string} req.body.username - The username of the user.
         * @param {string} req.body.password - The password of the user.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and message.
         * @swagger
         * /api/v1/user/sign-in:
         *   post:
         *     summary: Signs in a user.
         *     description: Signs in a user with the provided email address and password.
         *     tags: 
         *       - User
         *     parameters:
         *       - in: body
         *         name: Credentials
         *         description: The credentials for authentication.
         *         required: true
         *         schema:
         *           type: object
         *           properties:
         *             username:
         *               type: string
         *               description: The username of the user.
         *               example: john_doe
         *             password:
         *               type: string
         *               description: The password of the user.
         *               example: password123
         *     responses:
         *       200:
         *         description: Login successful.
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
         *                   example: Login successful.
         *                 data:
         *                   type: object
         *                   properties:
         *                     accessToken:
         *                       type: string
         *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
         *                       description: The generated access token.
         *     security:
         *       - BasicAuth: []
         * securityDefinitions:
         *   BasicAuth:
         *     type: basic
         *     description: HTTP Basic Authentication.
         */
        this.#router.post("/sign-in", this.#controller.signIn);

        /**
         * Creates a student profile.
         * @param {object} req - The request object.
         * @param {string} req.headers.authorization - The Bearer token for authentication.
         * @param {object} req.body - The request body containing the student profile data.
         * @param {string} req.body.fullName - The full name of the student.
         * @param {number} req.body.institutionId - The ID of the institution the student belongs to.
         * @param {number} req.body.departmentId - The ID of the department the student belongs to.
         * @param {number} req.body.levelId - The ID of the level the student belongs to.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and message.
         * @swagger
         * /api/v1/user/student/profile:
         *   post:
         *     summary: Creates a student profile.
         *     description: Creates a student profile with the provided details.
         *     tags:
         *      - Student
         *     parameters:
         *       - in: header
         *         name: Authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *       - in: body
         *         name: StudentProfile
         *         description: The student profile data.
         *         required: true
         *         schema:
         *           type: object
         *           properties:
         *             fullName:
         *               type: string
         *               description: The full name of the student.
         *               example: John Doe
         *             institutionId:
         *               type: integer
         *               description: The ID of the institution the student belongs to.
         *               example: 1
         *             departmentId:
         *               type: integer
         *               description: The ID of the department the student belongs to.
         *               example: 4
         *             levelId:
         *               type: integer
         *               description: The ID of the level the student belongs to.
         *               example: 7
         *     responses:
         *       201:
         *         description: Profile created successfully.
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
         *                   example: Profile Created Successfully.
         *       401:
         *         description: Unauthorized. Indicates that the user is not authenticated.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: UnAuthorized
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
         *                   example: Internal server error.
         *                   description: The error message.
         */
        this.#router.post("/student/profile", this.#authenticator.authenticateJWT, this.#controller.createStudentProfile);

        /**
         * Creates a staff profile.
         * @param {object} req - The request object.
         * @param {string} req.headers.authorization - The Bearer token for authentication.
         * @param {object} req.body - The request body containing the staff profile data.
         * @param {string} req.body.fullName - The full name of the staff member.
         * @param {number} req.body.departmentId - The ID of the department the staff member belongs to.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and message.
         * @swagger
         * /api/v1/user/staff/profile:
         *   post:
         *     summary: Creates a staff profile.
         *     description: Creates a staff profile with the provided details.
         *     tags:
         *      - Staff
         *     parameters:
         *       - in: header
         *         name: Authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *       - in: body
         *         name: StaffProfile
         *         description: The staff profile data.
         *         required: true
         *         schema:
         *           type: object
         *           properties:
         *             fullName:
         *               type: string
         *               description: The full name of the staff member.
         *               example: Jane Smith
         *             departmentId:
         *               type: integer
         *               description: The ID of the department the staff member belongs to.
         *               example: 123
         *     responses:
         *       201:
         *         description: Profile created successfully.
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
         *                   example: Profile Created Successfully.
         *       401:
         *         description: Unauthorized. Indicates that the user is not authenticated or authorized.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: UnAuthorized
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
         *                   example: Internal server error.
         *                   description: The error message.
         */
        this.#router.post("/staff/profile", this.#authenticator.authenticateJWT, this.#controller.createStaffProfile);

        /**
         * Updates a student profile.
         * @param {object} req - The request object.
         * @param {string} req.headers.authorization - The Bearer token for authentication.
         * @param {object} req.body - The request body containing the updated student profile data.
         * @param {number} req.body.departmentId - The ID of the department to update in the student profile.
         * @param {number} req.body.levelId - The ID of the level to update in the student profile.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and message.
         * @swagger
         * /api/v1/user/student/profile:
         *   put:
         *     summary: Updates a student profile.
         *     description: Updates a student profile with the provided details.
         *     tags:
         *      - Student
         *     parameters:
         *       - in: header
         *         name: Authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *       - in: body
         *         name: StudentProfileUpdate
         *         description: The updated student profile data.
         *         required: true
         *         schema:
         *           type: object
         *           properties:
         *             departmentId:
         *               type: integer
         *               description: The ID of the department to update in the student profile.
         *               example: 123
         *             levelId:
         *               type: integer
         *               description: The ID of the level to update in the student profile.
         *               example: 789
         *     responses:
         *       200:
         *         description: Profile updated successfully.
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
         *                   example: Profile Updated Successfully.
         *       401:
         *         description: Unauthorized. Indicates that the user is not authenticated or authorized.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: UnAuthorized
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
         *                   example: Internal server error.
         *                   description: The error message.
         */
        this.#router.put("/student/profile", this.#authenticator.authenticateJWT, this.#controller.updateStudentProfile);

        /**
         * Updates a staff profile.
         * @param {object} req - The request object.
         * @param {string} req.headers.authorization - The Bearer token for authentication.
         * @param {object} req.body - The request body containing the updated staff profile data.
         * @param {number} req.body.departmentId - The ID of the department to update in the staff profile.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and message.
         * @swagger
         * /api/v1/user/staff/profile:
         *   put:
         *     summary: Updates a staff profile.
         *     description: Updates a staff profile with the provided details.
         *     tags:
         *      - Staff
         *     parameters:
         *       - in: header
         *         name: Authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *       - in: body
         *         name: StaffProfileUpdate
         *         description: The updated staff profile data.
         *         required: true
         *         schema:
         *           type: object
         *           properties:
         *             departmentId:
         *               type: integer
         *               description: The ID of the department to update in the staff profile.
         *               example: 123
         *     responses:
         *       200:
         *         description: Profile updated successfully.
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
         *                   example: Profile Updated Successfully.
         *       401:
         *         description: Unauthorized. Indicates that the user is not authenticated or authorized.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: UnAuthorized
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
         *                   example: Internal server error.
         *                   description: The error message.
         */
        this.#router.put("/staff/profile", this.#authenticator.authenticateJWT, this.#controller.updateStaffProfile);

        /**
         * Retrieves the user profile.
         * @param {object} req - The request object.
         * @param {string} req.headers.authorization - The Bearer token for authentication.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and user profile data.
         * @swagger
         * /api/v1/user/profile:
         *   get:
         *     summary: Retrieves the user profile.
         *     description: Retrieves the profile of the authenticated user.
         *     tags:
         *      - Profile
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
         *         description: User profile retrieved successfully.
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
         *                   description: The user profile data.
         *                   properties:
         *                     profile:
         *                       type: object
         *                       description: The user's profile information.
         *                       properties:
         *                         // Define properties of the user's profile here.
         *                     admin:
         *                       type: string
         *                       description: The role of the user within the system, if applicable.
         *                       example: Course Representative
         *       401:
         *         description: Unauthorized. Indicates that the user is not authenticated or authorized.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: UnAuthorized
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
         *                   example: Internal server error.
         *                   description: The error message.
         */
        this.#router.get("/profile", this.#authenticator.authenticateJWT, this.#controller.getUserProfile);

        /**
         * Deletes the user account.
         * @param {object} req - The request object.
         * @param {string} req.headers.authorization - The Bearer token for authentication.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and message.
         * @swagger
         * /api/v1/user/delete-account:
         *   delete:
         *     summary: Deletes the user account.
         *     description: Deletes the account of the authenticated user.
         *     tags:
         *      - User
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
         *         description: Account deleted successfully.
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
         *                   example: Account Deleted Successfully.
         *       401:
         *         description: Unauthorized. Indicates that the user is not authenticated or authorized.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: UnAuthorized
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
         *                   example: Internal server error.
         *                   description: The error message.
         */
        this.#router.delete("/delete-account", this.#authenticator.authenticateJWT, this.#controller.deleteUserAccount);

        /**
         * Adds student privilege to a user.
         * @param {object} req - The request object.
         * @param {string} req.headers.authorization - The Bearer token for authentication.
         * @param {object} req.body - The request body.
         * @param {number} req.body.userId - The ID of the user to add student privilege.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and message.
         * @swagger
         * /api/v1/user/add-student-priviledge:
         *   post:
         *     summary: Adds student privilege to a user.
         *     description: Adds student privilege (course representative role) to the specified user.
         *     tags:
         *      - Student
         *     parameters:
         *       - in: header
         *         name: Authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *       - in: body
         *         name: body
         *         description: The request body containing the user ID.
         *         required: true
         *         schema:
         *           type: object
         *           properties:
         *             userId:
         *               type: number
         *               description: The ID of the user to add student privilege.
         *               example: 12345
         *     responses:
         *       201:
         *         description: Student privilege added successfully.
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
         *                   example: Student Role Updated Successfully.
         *       400:
         *         description: Bad request. Indicates that the request body is invalid or the student already has the privilege.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Student already exists as a course representative.
         *                   description: The error message.
         *       401:
         *         description: Unauthorized. Indicates that the user is not authenticated or authorized.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: UnAuthorized
         *                   description: The error message.
         *       404:
         *         description: Not found. Indicates that the user or the student profile was not found.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: User Not Found
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
         *                   example: Internal server error.
         *                   description: The error message.
         */
        this.#router.post("/add-student-priviledge", this.#authenticator.authenticateJWT, this.#controller.addStudentAdminPriviledge);

        /**
         * Adds staff privilege to a user.
         * @param {object} req - The request object.
         * @param {string} req.headers.authorization - The Bearer token for authentication.
         * @param {object} req.body - The request body.
         * @param {number} req.body.userId - The ID of the user to add staff privilege.
         * @param {number} req.body.levelId - The ID of the level to assign to the staff.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and message.
         * @swagger
         * /api/v1/user/add-staff-priviledge:
         *   post:
         *     summary: Adds staff privilege to a user.
         *     description: Adds staff privilege (level advisor role) to the specified user.
         *     tags:
         *      - Staff
         *     parameters:
         *       - in: header
         *         name: Authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *       - in: body
         *         name: body
         *         description: The request body containing the user ID and level ID.
         *         required: true
         *         schema:
         *           type: object
         *           properties:
         *             userId:
         *               type: number
         *               description: The ID of the user to add staff privilege.
         *               example: 12345
         *             levelId:
         *               type: number
         *               description: The ID of the level to assign to the staff.
         *               example: 3
         *     responses:
         *       201:
         *         description: Staff privilege added successfully.
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
         *                   example: Staff Role Updated Successfully.
         *       400:
         *         description: Bad request. Indicates that the request body is invalid or the staff already has the privilege.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Staff already exists as a level advisor.
         *                   description: The error message.
         *       401:
         *         description: Unauthorized. Indicates that the user is not authenticated or authorized.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: UnAuthorized
         *                   description: The error message.
         *       404:
         *         description: Not found. Indicates that the user, staff profile, or level was not found.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: User Not Found
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
         *                   example: Internal server error.
         *                   description: The error message.
         */
        this.#router.post("/add-staff-priviledge", this.#authenticator.authenticateJWT, this.#controller.addStaffAdminPriviledge);

        /**
         * Removes student privilege from a user.
         * @param {object} req - The request object.
         * @param {string} req.headers.authorization - The Bearer token for authentication.
         * @param {object} req.body - The request body.
         * @param {number} req.body.userId - The ID of the user to remove student privilege.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and message.
         * @swagger
         * /api/v1/user/remove-student-priviledge:
         *   delete:
         *     summary: Removes student privilege from a user.
         *     description: Removes student privilege (course representative role) from the specified user.
         *     tags:
         *      - Student
         *     parameters:
         *       - in: header
         *         name: Authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *       - in: body
         *         name: body
         *         description: The request body containing the user ID.
         *         required: true
         *         schema:
         *           type: object
         *           properties:
         *             userId:
         *               type: number
         *               description: The ID of the user to remove student privilege.
         *               example: 12345
         *     responses:
         *       200:
         *         description: Student privilege removed successfully.
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
         *                   example: Student Removed Successfully.
         *       400:
         *         description: Bad request. Indicates that the request body is invalid or the student doesn't have the privilege.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Student Isn't a Representative.
         *                   description: The error message.
         *       401:
         *         description: Unauthorized. Indicates that the user is not authenticated or authorized.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: UnAuthorized
         *                   description: The error message.
         *       404:
         *         description: Not found. Indicates that the user or student profile was not found.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: User Not Found
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
         *                   example: Internal server error.
         *                   description: The error message.
         */
        this.#router.delete("/remove-student-priviledge", this.#authenticator.authenticateJWT, this.#controller.removeStudentAdminPriviledge);

       /**
         * Removes staff privilege from a user.
         * @param {object} req - The request object.
         * @param {string} req.headers.authorization - The Bearer token for authentication.
         * @param {object} req.body - The request body.
         * @param {number} req.body.userId - The ID of the user to remove staff privilege.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and message.
         * @swagger
         * /api/v1/user/remove-staff-priviledge:
         *   delete:
         *     summary: Removes staff privilege from a user.
         *     description: Removes staff privilege (level advisor role) from the specified user.
         *     tags:
         *      - Staff
         *     parameters:
         *       - in: header
         *         name: Authorization
         *         description: The Bearer token for authentication.
         *         required: true
         *         schema:
         *           type: string
         *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *       - in: body
         *         name: body
         *         description: The request body containing the user ID.
         *         required: true
         *         schema:
         *           type: object
         *           properties:
         *             userId:
         *               type: number
         *               description: The ID of the user to remove staff privilege.
         *               example: 12345
         *     responses:
         *       200:
         *         description: Staff privilege removed successfully.
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
         *                   example: Staff Removed Successfully.
         *       400:
         *         description: Bad request. Indicates that the request body is invalid or the staff doesn't have the privilege.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Staff Isn't a Level Advisor.
         *                   description: The error message.
         *       401:
         *         description: Unauthorized. Indicates that the user is not authenticated or authorized.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: UnAuthorized
         *                   description: The error message.
         *       404:
         *         description: Not found. Indicates that the user or staff profile was not found.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: User Not Found
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
         *                   example: Internal server error.
         *                   description: The error message.
         */
        this.#router.delete("/remove-staff-priviledge", this.#authenticator.authenticateJWT, this.#controller.removeStaffAdminPriviledge);


        //new routes

        /**
         * Registers a new institution.
         * @param {object} req - The request object.
         * @param {object} req.body - The request body.
         * @param {string} req.body.businessEmail - The business email of the institution.
         * @param {string} req.body.name - The name of the institution.
         * @param {number} req.body.yearOfReg - The year of registration of the institution.
         * @param {string} req.body.countryOfReg - The country of registration of the institution.
         * @param {string} req.body.registrationNumber - The registration number of the institution.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and message.
         * @swagger
         * /api/v1/user/register-institution:
         *   post:
         *     summary: Registers a new institution.
         *     description: Registers a new institution with the provided details.
         *     tags:
         *      - Institution
         *     parameters:
         *       - in: body
         *         name: StudentRegistration
         *         description: Student registration data.
         *         required: true
         *         schema:
         *             type: object
         *             properties:
         *               businessEmail:
         *                 type: string
         *                 format: email
         *                 description: The business email of the institution.
         *                 example: example@institution.com
         *               name:
         *                 type: string
         *                 description: The name of the institution.
         *                 example: Example University
         *               yearOfReg:
         *                 type: number
         *                 description: The year of registration of the institution.
         *                 example: 1990
         *               countryOfReg:
         *                 type: string
         *                 description: The country of registration of the institution.
         *                 example: United States
         *               registrationNumber:
         *                 type: string
         *                 description: The registration number of the institution.
         *                 example: REG123456
         *     responses:
         *       201:
         *         description: Institution created successfully.
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
         *                   example: Institution Created Successfully, Expect an email for verification.
         *                   description: The success message.
         *       422:
         *         description: Validation error. Indicates that the request body is invalid.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *                 data:
         *                   type: object
         *                   example: { "businessEmail": "Business email is required" }
         *                   description: The validation errors.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Internal server error.
         *                   description: The error message.
         */
        this.#router.post("/register-institution", this.#controller.createInstitution);


        /**
         * Approves an institution.
         * @param {object} req - The request object including the Bearer token for authorization.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} req.query - The query parameters.
         * @param {number} req.query.institutionId - The ID of the institution to approve.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and message.
         * @swagger
         * /api/v1/user/approve-institution:
         *   put:
         *     summary: Approves an institution.
         *     description: Approves an institution with the provided institution ID.
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
         *         name: institutionId
         *         required: true
         *         schema:
         *           type: integer
         *           minimum: 1
         *         description: The ID of the institution to approve.
         *     responses:
         *       200:
         *         description: Institution approved successfully.
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
         *                   example: Institution Approved Successfully.
         *                   description: The success message.
         *       400:
         *         description: Bad request. Indicates that the institution is already approved or an error occurred during approval.
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
         *                   example: Institution had already been Approved.
         *                   description: The error message.
         *       401:
         *         description: Unauthorized. Indicates that the user is not authorized to approve institutions.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Unauthorized
         *                   description: The error message.
         *       404:
         *         description: Not found. Indicates that the specified institution was not found.
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
         *                   example: Institution Not Found.
         *                   description: The error message.
         *       422:
         *         description: Validation error. Indicates that the institution ID is missing or invalid.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *                 data:
         *                   type: object
         *                   example: { "institutionId": "Institution ID is required" }
         *                   description: The validation errors.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Internal server error.
         *                   description: The error message.
         */
        this.#router.put("/approve-institution", this.#authenticator.authenticateJWT, this.#controller.approveInstitution);


        /**
         * Rejects an institution.
         * @param {object} req - The request object including the Bearer token for authorization.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} req.query - The query parameters.
         * @param {number} req.query.institutionId - The ID of the institution to reject.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and message.
         * @swagger
         * /api/v1/user/reject-institution:
         *   put:
         *     summary: Rejects an institution.
         *     description: Rejects an institution with the provided institution ID.
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
         *         name: institutionId
         *         required: true
         *         schema:
         *           type: integer
         *           minimum: 1
         *         description: The ID of the institution to reject.
         *     responses:
         *       200:
         *         description: Institution rejected successfully.
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
         *                   example: Institution DisApproved Successfully.
         *                   description: The success message.
         *       400:
         *         description: Bad request. Indicates that the institution is already approved or an error occurred during rejection.
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
         *                   example: Institution had already been Approved.
         *                   description: The error message.
         *       401:
         *         description: Unauthorized. Indicates that the user is not authorized to reject institutions.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Unauthorized
         *                   description: The error message.
         *       404:
         *         description: Not found. Indicates that the specified institution was not found.
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
         *                   example: Institution Not Found.
         *                   description: The error message.
         *       422:
         *         description: Validation error. Indicates that the institution ID is missing or invalid.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *                 data:
         *                   type: object
         *                   example: { "institutionId": "Institution ID is required" }
         *                   description: The validation errors.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Internal server error.
         *                   description: The error message.
         */
        this.#router.put("/reject-institution", this.#authenticator.authenticateJWT, this.#controller.disApproveInstitution);


        /**
         * Deletes an institution.
         * @param {object} req - The request object including the Bearer token for authorization.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} req.query - The query parameters.
         * @param {number} req.query.institutionId - The ID of the institution to delete.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and message.
         * @swagger
         * /api/v1/user/delete-institution:
         *   delete:
         *     summary: Deletes an institution.
         *     description: Deletes an institution with the provided institution ID.
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
         *         name: institutionId
         *         required: true
         *         schema:
         *           type: integer
         *           minimum: 1
         *           description: The ID of the institution to delete.
         *     responses:
         *       200:
         *         description: Institution deleted successfully.
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
         *                   example: Institution Deleted Successfully.
         *                   description: The success message.
         *       400:
         *         description: Bad request. Indicates that an error occurred during deletion.
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
         *                   example: Error Occurred Deleting Institution.
         *                   description: The error message.
         *       401:
         *         description: Unauthorized. Indicates that the user is not authorized to delete institutions.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Unauthorized
         *                   description: The error message.
         *       404:
         *         description: Not found. Indicates that the specified institution was not found.
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
         *                   example: Institution Not Found.
         *                   description: The error message.
         *       422:
         *         description: Validation error. Indicates that the institution ID is missing or invalid.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *                 data:
         *                   type: object
         *                   example: { "institutionId": "Institution ID is required" }
         *                   description: The validation errors.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Internal server error.
         *                   description: The error message.
         */
        this.#router.delete("/delete-institution", this.#authenticator.authenticateJWT, this.#controller.deleteInstitution);


        /**
         * Invites a staff member.
         * @param {object} req - The request object including the Bearer token for authorization.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} req.body - The request body.
         * @param {string} req.body.emailAddress - The email address of the staff member to invite.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and message.
         * @swagger
         * /api/v1/user/invite-staff:
         *   post:
         *     summary: Invites a staff member.
         *     description: Invites a staff member by sending an invitation email with a link to verify the account.
         *     tags:
         *      - Staff
         *     parameters:
         *       - in: header
         *         name: authorization
         *         required: true
         *         schema:
         *           type: string
         *           description: Bearer token for authorization.
         *           example: Bearer YOUR_AUTH_TOKEN_HERE
         *       - in: body
         *         name: StudentRegistration
         *         description: Student registration data.
         *         required: true
         *         schema:
         *             type: object
         *             properties:
         *               emailAddress:
         *                 type: string
         *                 format: email
         *                 description: The business email of the institution.
         *                 example: example@institution.com
         *     responses:
         *       200:
         *         description: Staff invited successfully.
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
         *                   example: Staff Invited Successfully.
         *                   description: The success message.
         *       400:
         *         description: Bad request. Indicates that the email address already exists.
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
         *                   example: Email Address already exists.
         *                   description: The error message.
         *       401:
         *         description: Unauthorized. Indicates that the user is not authorized to invite staff members.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Unauthorized
         *                   description: The error message.
         *       422:
         *         description: Validation error. Indicates that the email address is missing or invalid.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *                 data:
         *                   type: object
         *                   example: { "emailAddress": "Email Address is required" }
         *                   description: The validation errors.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Internal server error.
         *                   description: The error message.
         */
        this.#router.post("/invite-staff", this.#authenticator.authenticateJWT, this.#controller.inviteStaff);


        /**
         * Invites a student.
         * @param {object} req - The request object including the Bearer token for authorization.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} req.body - The request body.
         * @param {string} req.body.emailAddress - The email address of the student to invite.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and message.
         * @swagger
         * /api/v1/user/invite-student:
         *   post:
         *     summary: Invites a student.
         *     description: Invites a student by sending an invitation email with a link to verify the account.
         *     tags:
         *      - Student
         *     parameters:
         *       - in: header
         *         name: authorization
         *         required: true
         *         schema:
         *           type: string
         *           description: Bearer token for authorization.
         *           example: Bearer YOUR_AUTH_TOKEN_HERE
         *       - in: body
         *         name: StudentRegistration
         *         description: Student registration data.
         *         required: true
         *         schema:
         *             type: object
         *             properties:
         *               emailAddress:
         *                 type: string
         *                 format: email
         *                 description: The business email of the institution.
         *                 example: example@institution.com
         *     responses:
         *       200:
         *         description: Student invited successfully.
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
         *                   example: Student Invited Successfully.
         *                   description: The success message.
         *       400:
         *         description: Bad request. Indicates that the email address already exists.
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
         *                   example: Email Address already exists.
         *                   description: The error message.
         *       401:
         *         description: Unauthorized. Indicates that the user is not authorized to invite students.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Unauthorized
         *                   description: The error message.
         *       422:
         *         description: Validation error. Indicates that the email address is missing or invalid.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *                 data:
         *                   type: object
         *                   example: { "emailAddress": "Email Address is required" }
         *                   description: The validation errors.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Internal server error.
         *                   description: The error message.
         */
        this.#router.post("/invite-student", this.#authenticator.authenticateJWT, this.#controller.inviteStudent);


        /**
         * Deletes a student.
         * @param {object} req - The request object including the Bearer token for authorization.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} req.query - The query parameters.
         * @param {number} req.query.userId - The ID of the student to delete.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and message.
         * @swagger
         * /api/v1/user/delete-student:
         *   delete:
         *     summary: Deletes a student.
         *     description: Deletes a student along with their associated user account.
         *     tags:
         *      - Student
         *     parameters:
         *       - in: header
         *         name: authorization
         *         required: true
         *         schema:
         *           type: string
         *           description: Bearer token for authorization.
         *           example: Bearer YOUR_AUTH_TOKEN_HERE
         *       - in: query
         *         name: userId
         *         required: true
         *         schema:
         *           type: integer
         *           description: The ID of the student to delete.
         *           example: 123
         *     responses:
         *       200:
         *         description: Student deleted successfully.
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
         *                   example: Student Deleted Successfully.
         *                   description: The success message.
         *       400:
         *         description: Bad request. Indicates that an error occurred while deleting the student.
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
         *                   example: Error Occurred Deleting Student.
         *                   description: The error message.
         *       401:
         *         description: Unauthorized. Indicates that the user is not authorized to delete students.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Unauthorized
         *                   description: The error message.
         *       404:
         *         description: Not found. Indicates that the student to be deleted was not found.
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
         *                   example: Student Not Found.
         *                   description: The error message.
         *       422:
         *         description: Validation error. Indicates that the userId parameter is missing or invalid.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *                 data:
         *                   type: object
         *                   example: { "userId": "User ID is required" }
         *                   description: The validation errors.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Internal server error.
         *                   description: The error message.
         */
        this.#router.delete("/delete-student", this.#authenticator.authenticateJWT, this.#controller.deleteStudent);


        /**
         * Deletes a staff member.
         * @param {object} req - The request object including the Bearer token for authorization.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} req.query - The query parameters.
         * @param {number} req.query.userId - The ID of the staff member to delete.
         * @param {object} res - The response object.
         * @returns {object} The response containing the status and message.
         * @swagger
         * /api/v1/user/delete-staff:
         *   delete:
         *     summary: Deletes a staff member.
         *     description: Deletes a staff member along with their associated user account.
         *     tags:
         *      - Staff
         *     parameters:
         *       - in: header
         *         name: authorization
         *         required: true
         *         schema:
         *           type: string
         *           description: Bearer token for authorization.
         *           example: Bearer YOUR_AUTH_TOKEN_HERE
         *       - in: query
         *         name: userId
         *         required: true
         *         schema:
         *           type: integer
         *           description: The ID of the staff member to delete.
         *           example: 123
         *     responses:
         *       200:
         *         description: Staff member deleted successfully.
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
         *                   example: Staff Deleted Successfully.
         *                   description: The success message.
         *       400:
         *         description: Bad request. Indicates that an error occurred while deleting the staff member.
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
         *                   example: Error Occurred Deleting Staff.
         *                   description: The error message.
         *       401:
         *         description: Unauthorized. Indicates that the user is not authorized to delete staff members.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Unauthorized
         *                   description: The error message.
         *       404:
         *         description: Not found. Indicates that the staff member to be deleted was not found.
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
         *                   example: Staff Not Found.
         *                   description: The error message.
         *       422:
         *         description: Validation error. Indicates that the userId parameter is missing or invalid.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: validation error
         *                   description: The error message.
         *                 data:
         *                   type: object
         *                   example: { "userId": "User ID is required" }
         *                   description: The validation errors.
         *       500:
         *         description: Internal server error. Indicates an unexpected error occurred on the server.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Internal server error.
         *                   description: The error message.
         */
        this.#router.delete("/delete-staff", this.#authenticator.authenticateJWT, this.#controller.deleteStaff);

        /**
         * Retrieve a list of institutions.
         * @param {object} req - The request object.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} req.query - The query parameters.
         * @param {number} req.query.page - The page number.
         * @param {number} req.query.size - The number of items per page.
         * @param {object} res - The response object.
         * @returns {object} The response containing the list of institutions.
         * @swagger
         * /api/v1/user/institutions:
         *   get:
         *     summary: Retrieve a list of institutions.
         *     description: Retrieve a list of institutions based on the provided page and size parameters.
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
         *         description: The page number.
         *         required: true
         *         schema:
         *           type: integer
         *           example: 1
         *       - in: query
         *         name: size
         *         description: The number of items per page.
         *         required: true
         *         schema:
         *           type: integer
         *           example: 10
         *     responses:
         *       200:
         *         description: List of institutions retrieved successfully.
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
         *                     institutions:
         *                       type: array
         *                       items:
         *                         type: object
         *                         properties:
         *                           institutionId:
         *                             type: integer
         *                             description: The ID of the institution.
         *                           name:
         *                             type: string
         *                             description: The name of the institution.
         *                           yearOfReg:
         *                             type: integer
         *                             description: The year of registration of the institution.
         *                           countryOfReg:
         *                             type: string
         *                             description: The country of registration of the institution.
         *                           businessEmail:
         *                             type: string
         *                             description: The business email of the institution.
         *                           registrationNumber:
         *                             type: string
         *                             description: The registration number of the institution.
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
         *       422:
         *         description: Validation error. Indicates that the request parameters did not pass validation.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
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
         *                 message:
         *                   type: string
         *                   example: Internal Server Error
         *                   description: The error message.
         */
        this.#router.get("/institutions", this.#authenticator.authenticateJWT, this.#controller.getInstitutions);


        /**
         * Retrieve a list of new institutions.
         * @param {object} req - The request object.
         * @param {string} req.headers.authorization - The Bearer token for authorization.
         * @param {object} req.query - The query parameters.
         * @param {number} req.query.page - The page number.
         * @param {number} req.query.size - The number of items per page.
         * @param {object} res - The response object.
         * @returns {object} The response containing the list of new institutions.
         * @swagger
         * /api/v1/user/new-institutions:
         *   get:
         *     summary: Retrieve a list of new institutions.
         *     description: Retrieve a list of new institutions based on the provided page and size parameters.
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
         *         description: The page number.
         *         required: true
         *         schema:
         *           type: integer
         *           example: 1
         *       - in: query
         *         name: size
         *         description: The number of items per page.
         *         required: true
         *         schema:
         *           type: integer
         *           example: 10
         *     responses:
         *       200:
         *         description: List of new institutions retrieved successfully.
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
         *                     institutions:
         *                       type: array
         *                       items:
         *                         type: object
         *                         properties:
         *                           institutionId:
         *                             type: integer
         *                             description: The ID of the institution.
         *                           name:
         *                             type: string
         *                             description: The name of the institution.
         *                           yearOfReg:
         *                             type: integer
         *                             description: The year of registration of the institution.
         *                           countryOfReg:
         *                             type: string
         *                             description: The country of registration of the institution.
         *                           businessEmail:
         *                             type: string
         *                             description: The business email of the institution.
         *                           registrationNumber:
         *                             type: string
         *                             description: The registration number of the institution.
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
         *       422:
         *         description: Validation error. Indicates that the request parameters did not pass validation.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
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
         *                 message:
         *                   type: string
         *                   example: Internal Server Error
         *                   description: The error message.
         */
        this.#router.get("/new-institutions", this.#authenticator.authenticateJWT, this.#controller.getNewInstitutions);


    }

    getRouter = () => {
        return this.#router;
    }
}


module.exports = UserRouter;