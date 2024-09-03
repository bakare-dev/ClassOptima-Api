const Logger = require("../utils/Logger");
const NotificationService = require("./NotificationService");
const CacheService = require("./CacheService");
const UserDService = require("./dataservices/UserService");
const StaffAdminService = require("./dataservices/StaffAdminService");
const InstitutionService = require("./dataservices/InstitutionService");
const StudentService = require("./dataservices/StudentService");
const StudentAdminService = require("./dataservices/StudentAdminService");
const StaffService = require("./dataservices/StaffService");
const LevelService = require("./dataservices/LevelService");
const DepartmentService = require("./dataservices/DepartmentService");
const InstitutionUserService = require("./dataservices/InstitutionUserService")
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const { security, infrastructure } = require("../config/main.settings");
const Authenticator = require("../utils/Authenticator");


let instance;

class UserService {

    #logger;
    #notificationService;
    #cacheService;
    #userService;
    #staffService;
    #studentService;
    #institutionService;
    #staffAdminService;
    #studentAdminService;
    #departmentService;
    #levelService;
    #authenticator;
    #institutionUserService;


    constructor () {
        
        if (instance) return instance;


        this.#logger = new Logger().getLogger();
        this.#notificationService = new NotificationService();
        this.#cacheService = new CacheService();
        this.#userService = new UserDService();
        this.#staffService = new StaffService();
        this.#studentService = new StudentService();
        this.#institutionService = new InstitutionService();
        this.#staffAdminService = new StaffAdminService();
        this.#studentAdminService = new StudentAdminService();
        this.#departmentService = new DepartmentService();
        this.#levelService = new LevelService();
        this.#authenticator = new Authenticator();
        this.#institutionUserService = new InstitutionUserService();


        instance = this;

    }
    
    createStudentAccount = async (payload, callback) => {
        try {
            
            const { emailAddress, password } = payload;

            const hashedPassword = await this.#hashPassword(password);

            const user = await this.#userService.create({emailAddress, password: hashedPassword, type: 4});

            if (!user.id) {

                if (user.status) {
                    return callback({status: user.status, message: `Email Address ${emailAddress} already exists`});
                }

                return callback({status: 500, message: "Internal Server Error"});
            }

            const token = await this.#generateToken(user.id);

            const userNotificationPayload = {
                recipients: [`${emailAddress}`],
                data: {
                    link: `${infrastructure.clientbaseUrl.production}/verify-account?token=${token}`,
                    type: user.type,
                    username: emailAddress,
                },
            }

            await this.#notificationService.sendVerifyRegistration(userNotificationPayload, resp => {});

            callback({
                status: 201,
                message: "Account created successfully. Please check your email for verification link.",
                data: {
                    emailAddress: user.emailAddress
                }
            })

        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal Server Error"});
        }
    }
    
    createTutorAccount = async (payload, callback) => {
        try {
            const { emailAddress, password } = payload;

            const hashedPassword = await this.#hashPassword(password);

            const user = await this.#userService.create({emailAddress, password: hashedPassword, type: 3});

            if (!user.id) {

                if (user.status) {
                    return callback({status: user.status, message: `Email Address ${emailAddress} already exists`});
                }

                return callback({status: 500, message: "Internal Server Error"});
            }

            const token = await this.#generateToken(user.id);

            const userNotificationPayload = {
                recipients: [`${emailAddress}`],
                data: {
                    link: `${infrastructure.clientbaseUrl.production}/verify-account?token=${token}`,
                    type: user.type,
                    username: emailAddress,
                },
            }

            await this.#notificationService.sendVerifyRegistration(userNotificationPayload, resp => {});

            callback({
                status: 201,
                message: "Account created successfully. Please check your email for verification link.",
                data: {
                    emailAddress: user.emailAddress
                }
            })
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    requestVerificationLink = async (emailAddress, callback) => {
        try {
            const user = await this.#userService.findByEmail(emailAddress);

            if (!user.id) {
                return callback({status: 404, message: `Email Address ${emailAddress} not found`});
            }

            if (user.activated == true) {
                return callback({status: 400, message: "Account already activated"});
            }

            const token = await this.#generateToken(user.id);

            const userNotificationPayload = {
                recipients: [`${emailAddress}`],
                data: {
                    link: `${infrastructure.clientbaseUrl.production}/verify-account?token=${token}`,
                    type: user.type,
                    username: emailAddress,
                },
            }

            await this.#notificationService.sendVerifyRegistration(userNotificationPayload, resp => {});

            callback({
                status: 200,
                message: "Verification link sent successfully. Please check your email",
            })
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal Server Error"});   
        }
    }

    initiatePasswordChange = async (emailAddress, callback) => {
        try {
            const user = await this.#userService.findByEmail(emailAddress);
            
            if (!user.id) {
                return callback({status: 404, message: `Email Address ${emailAddress} not found`});
            }

            const otp = await this.#generateOtp();

            await this.#cacheService.set(`otp: ${otp}`, { userId: user.id }, 300);

            const userNotificationPayload = {
                recipients: [`${user.emailAddress}`],
                data: {
                    otp: otp,
                },
            }

            await this.#notificationService.sendInitiatePasswordReset(userNotificationPayload, resp => {});

            callback({
                status: 200,
                message: "Password reset initiated. Please check your email for OTP",
            })
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    activateAccount = async (token, callback) => {
        try {
            const userPayload = await this.#cacheService.get(`token: ${token}`);

            if (!userPayload) {
                return callback({status: 404, message: "Invalid or expired token"});
            }

            const user = await this.#userService.findById(userPayload.userId);

            if (!user.id) {
                return callback({status: 404, message: "User not found"});
            }

            if (user.activated == true) {
                return callback({status: 400, message: "Account already activated"});
            }

            const updated = await this.#userService.update(user.id, { activated: true });

            if (updated[0] != 1) {
                return callback({status: 400, error: "An error occurred while activating account"});
            }

            let userNotificationPayload = {
                recipients: [`${user.emailAddress}`],
                data: {
                    username: user.emailAddress,
                    type: user.type
                },
            }

            this.#notificationService.sendAccountActivation(userNotificationPayload, resp => {});

            callback({ status: 200, message: "Account activated successfully" });
        } catch (err) {
            console.log(err)
            this.#logger.error(err);
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    completePasswordChange = async (otp, newPassword, callback) => {
        try {
            const otpPayload = await this.#cacheService.get(`otp: ${otp}`);

            if (!otpPayload) {
                return callback({status: 404, message: "Invalid or expired OTP"});
            }

            const user = await this.#userService.findById(otpPayload.userId);

            if (!user.id) {
                return callback({status: 404, message: "User not found"});
            }

            const hashedPassword = await this.#hashPassword(newPassword);

            const updated = await this.#userService.update(user.id, { password: hashedPassword });

            if (updated[0] != 1) {
                return callback({status: 400, message: "An error occurred while changing password"});
            }

            this.#cacheService.del(`otp: ${otp}`);
            this.#cacheService.del(`user: ${user.emailAddress}`);

            let userNotificationPayload = {
                recipients: [`${user.emailAddress}`],
                data: {
                    username: user.emailAddress,
                },
            }

            this.#notificationService.sendCompletePasswordReset(userNotificationPayload, resp => {});

            callback({status: 200, message: "Password changed successfully"});
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    confirmEmailAndPassword = async (payload, callback) => {
        try {
            const { emailAddress, password } = payload;
    
            let user = await this.#cacheService.get(`user:${emailAddress}`);
    
            if (!user) {
                user = await this.#userService.findByEmail(emailAddress);
            }
    
            if (!user) {
                return callback({ status: 404, message: "Invalid Email Address" });
            }
    
            if (!user.activated) {
                return callback({
                    status: 403,
                    message: "Account not activated. Please request a new activation link",
                    data: { emailAddress: user.emailAddress }
                });
            }
    
            const passwordMatch = await bcrypt.compare(password, user.password);
    
            if (!passwordMatch) {
                return callback({ status: 401, message: "Invalid Password" });
            }
    
            let profile = await this.#getProfile(user.id, user.type);

            const isAdmin = await this.#studentService.getProfileByUserId(user.id);
    
            this.#authenticator.generateTokens(user.id, user.type, resp => {

                callback({
                    status: 200,
                    message: "Login successful",
                    data: {
                        accessToken: resp,
                        type: user.type,
                        profile: !!profile,
                        isAdmin: !!isAdmin
                    }
                });
                
            });
    
            
        } catch (err) {
            this.#logger.error(err);
            callback({ status: 500, message: "Internal Server Error" });
        }
    };
    
    #getProfile = async (userId, userType) => {
        switch (userType) {
            case 4:
                return await this.#studentService.getProfileByUserId(userId);
            case 3:
                return await this.#staffService.getProfileByUserId(userId);
            case 1:
                return await this.#institutionUserService.getInstitutionByUserId(userId);
            default:
                return null;
        }
    };
    
    createStudentProfile = async (userId, payload, callback) => {
        try {
            const user = await this.#userService.findById(userId);

            if (!user) {
                return callback({status: 404, message: "User not found"});
            }

            const institution = await this.#institutionService.findById(payload.institutionId);

            if (!institution) {
                return callback({ status: 404, message: "Institution Not Found" });
            }

            if (!user.emailAddress.endsWith(institution.emailRegex)) {
                return callback({status: 400, message: `You are not a student of ${institution.name}, please correct University`});
            }

            const department = await this.#departmentService.findById(payload.departmentId);

            if (!department) {
                return callback({ status: 404, message: "Department Not Found" });
            }

            const level = await this.#levelService.findById(payload.levelId);

            if (!level) {
                return callback({ status: 404, message: "Level Not Found" });
            }

            const profileExists = await this.#studentService.getProfileByUserId(user.id);

            if (profileExists) {
                return callback({status: 400, message: "Profile already exists"})
            }

            const profilePayload = {
                fullName: payload.fullName,
                InstitutionId: institution.id,
                UserId: user.id,
                LevelId: level.id,
                DepartmentId: department.id
            }

            const profile = await this.#studentService.create(profilePayload);

            if (!profile) {
                return callback({status: profile.status, message: profile.error});
            }

            let userNotificationPayload = {
                recipients: [`${user.emailAddress}`],
                data: {
                    emailAddress: user.emailAddress,
                    fullname: profile.fullName,
                    institution: institution.name,
                    level: level.level,
                    department: department.name
                },
            }

            this.#notificationService.sendProfileUpdate(userNotificationPayload, resp => {});

            callback({status: 201, message: "Profile Created Successfully"})
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    updateStudentProfile = async (userId, payload, callback) => {
        try {
            const user = await this.#userService.findById(userId);

            if (!user.id) {
                return callback({status: 404, message: "User not found"});
            }

            const profile = await this.#studentService.getProfileByUserId(user.id);

            let data = {};

            if (payload.departmentId) {
                const department = await this.#departmentService.findById(payload.departmentId);

                if (!department) {
                    return callback({ status: 404, message: "Department Not Found" });
                }

                data.DepartmentId = department.id;
            }

            if (payload.level) {
                const level = await this.#levelService.findById(payload.levelId);

                if (!level) {
                    return callback({ status: 404, message: "Level Not Found" });
                }

                data.LevelId = level.id
            }

            const updateResponse = await this.#studentService.update(profile.id, data);

            if (updateResponse[0] != 1) {
                return callback({ status: 400, message: "An error occurred while updating profile"})
            }

            callback({status: 200, message: "Profile Updated Successfully"})
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    createTutorProfile = async (userId, payload, callback) => {
        try {
            const user = await this.#userService.findById(userId);

            if (!user.id) {
                return callback({status: 404, message: "User not found"});
            }

            const institution = await this.#institutionService.getInstitutionByRegex(this.#extractEmailEnding((user.emailAddress)));

            if (!institution) {
                return callback({ status: 404, message: "Institution Not Found" });
            }

            if (!user.emailAddress.endsWith(institution.emailRegex)) {
                return callback({status: 400, message: `You are not a staff of ${institution.name}, please select correct University`});
            }

            const department = await this.#departmentService.findById(payload.departmentId);

            if (!department) {
                return callback({ status: 404, message: "Department Not Found" });
            }

            const profileExists = await this.#staffService.getProfileByUserId(user.id);

            if (profileExists) {
                return callback({status: 400, message: "Profile already exists"})
            }

            const profilePayload = {
                fullName: payload.fullName,
                InstitutionId: institution.id,
                UserId: user.id,
                DepartmentId: department.id
            }

            const profile = await this.#staffService.create(profilePayload);

            if (!profile) {
                return callback({status: profile.status, message: profile.error});
            }

            let userNotificationPayload = {
                recipients: [`${user.emailAddress}`],
                data: {
                    emailAddress: user.emailAddress,
                    fullname: profile.fullName,
                    institution: institution.name,
                    department: department.name
                },
            }

            this.#notificationService.sendProfileUpdate(userNotificationPayload, resp => {});

            callback({status: 201, message: "Profile Created Successfully"})
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    #extractEmailEnding = (email)  => {
        if (email.includes("@")) {
            var emailParts = email.split("@");
            return emailParts[1];
        } else {
            return null;
        }
    }

    updateTutorProfile = async (userId, payload, callback) => {
        try {
            const user = await this.#userService.findById(userId);

            if (!user.id) {
                callback({status: 404, message: "User not found"});
            }

            const profile = await this.#staffService.getProfileByUserId(user.id);

            let data = {};

            if (payload.departmentId) {
                const department = await this.#departmentService.findById(payload.departmentId);

                if (!department) {
                    return callback({ status: 404, message: "Department Not Found" });
                }

                data.DepartmentId = department.id;
            }

            const updateResponse = await this.#staffService.update(profile.id, data);

            if (updateResponse[0] != 1) {
                return callback({ status: 400, message: "An error occurred while updating profile"})
            }

            callback({status: 200, message: "Profile Updated Successfully"})
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    getUserProfile = async (userId, callback) => {
        try {
            const user = await this.#userService.findById(userId);
    
            if (!user) {
                return callback({ status: 404, message: "User Not Found" });
            }
    
            let profile = {};

            switch (user.type) {
                case 4:
                    // Student
                    profile = await this.#studentService.getProfileByUserId(user.id);
                    profile = {
                        profileId: profile.id,
                        name: profile.fullName,
                        emailAddress: user.emailAddress,
                        level: profile.Level.level,
                        department: profile.Department.name,
                        institution: profile.Institution.name
                    };
    
                    const studentAdmin = await this.#studentAdminService.getProfileByStudentId(profile.profileId);
                    if (studentAdmin) {
                        profile.admin = "Course Representative";
                    }
                    break;
    
                case 3:
                    // Staff
                    profile = await this.#staffService.getProfileByUserId(user.id);

                    profile = {
                        profileId: profile.id,
                        name: profile.fullName,
                        emailAddress: user.emailAddress,
                        department: profile.Department.name,
                        institution: profile.Institution.name
                    };
    
                    const staffAdmin = await this.#staffAdminService.getProfileByStaffId(profile.profileId);

                    if (staffAdmin) {
                        profile.admin = "Level Advisor";
                    }
                    break;
    
                case 1:
                    // Institution
                    profile = await this.#institutionUserService.getInstitutionByUserId(user.id);

                    profile = {
                        profileId: profile.Institution.id,
                        name: profile.Institution.name,
                        yearOfReg: profile.Institution.yearOfReg,
                        countryOfReg: profile.Institution.countryOfReg,
                        businessEmail: profile.Institution.businessEmail,
                        registrationNumber: profile.Institution.registrationNumber,
                    }

                    break;
    
                default:
                    break;
            }
    
            callback({ status: 200, data: { profile } });
        } catch (err) {
            this.#logger.error(err);
            callback({ status: 500, message: "Internal Server Error" });
        }
    };
    
    deleteAccount = async (userId, callback) => {
        try {
            const user = await this.#userService.findById(userId);

            if (!user) {
                return callback({status: 404, message: "User Not Found"});
            }

            const deleteUpdate = await this.#userService.delete(user.id)

            if (deleteUpdate != 1) {
                return callback({status: 400, message: "Error occurred while deleting Account"});
            }

            if (user.type == 1) {
                const institutionUser = await this.#institutionUserService.getInstitutionByUserId(user.id);

                this.deleteInstitution(institutionUser.InstitutionId, resp => {})
            }

            let userNotificationPayload = {
                recipients: [`${user.emailAddress}`],
                data: {
                },
            }

            this.#notificationService.sendAccountDelete(userNotificationPayload, resp => {});

            callback({status: 200, message: "Account Deleted Successfully"});
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    addStudentAdminPriviledge = async (userId, callback) => {
        try {
            const user = await this.#userService.findById(userId);

            if (!user) {
                return callback({status: 404, message: "User Not Found"});
            }

            const student = await this.#studentService.getProfileByUserId(user.id);

            if (!student) {
                return callback({status: 404, message: "Student Not Found"});
            }

            const isStudentAdmin = await this.#studentAdminService.getProfileByStudentId(student.id);

            if (isStudentAdmin) {
                return callback({status: 400, message: "Student already exists as a course representative"});
            }

            const studentAdmin = await this.#studentAdminService.create({
                StudentId: student.id,
                DepartmentId: student.DepartmentId,
                LevelId: student.LevelId
            })

            if (!studentAdmin.id) {
                return callback({status: 400, error: "An error occurred adding student"});
            }

            const level = await this.#levelService.findById(student.LevelId);

            const department = await this.#departmentService.findById(student.DepartmentId);

            let userNotificationPayload = {
                recipients: [`${user.emailAddress}`],
                data: {
                    type: user.type,
                    name: student.fullName,
                    department: department.name,
                    level: level.level
                },
            }

            this.#notificationService.sendAdministratoradding(userNotificationPayload, resp => {});

            callback({status: 201, message: "Student Role Updated Successfully"});
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    removeStudentAdminPriviledge = async (userId, callback) => {
        try {
            const user = await this.#userService.findById(userId);

            if (!user) {
                return callback({status: 404, message: "User Not Found"});
            }

            const student = await this.#studentService.getProfileByUserId(user.id);

            if (!student) {
                return callback({status: 404, message: "Student Not Found"});
            }

            const isStudentAdmin = await this.#studentAdminService.getProfileByStudentId(student.id);

            if (!isStudentAdmin) {
                return callback({status: 400, message: "Student Isn't a Representative"});
            }

            const deleteResponse = await this.#studentAdminService.delete(isStudentAdmin.id);

            if (deleteResponse != 1) {
                return callback({status: 400, message: "Error occurred removing Student"});
            }

            callback({status: 200, message: "Student Removed Successfully"})
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    addStaffAdminPriviledge = async (userId, levelId, callback) => {
        try {
            const user = await this.#userService.findById(userId);

            if (!user) {
                return callback({status: 404, message: "User Not Found"});
            }

            const staff = await this.#staffService.getProfileByUserId(user.id);

            if (!staff) {
                return callback({status: 404, message: "Staff Not Found"});
            }

            const isStaffAdmin = await this.#staffAdminService.getProfileByStaffId(staff.id);

            if (isStaffAdmin) {
                return callback({status: 400, message: "Staff already exists as a level advisor"});
            }

            const level = await this.#levelService.findById(levelId);

            if (!level) {
                return callback({status: 404, message: "Level not Found"});
            }

            const department = await this.#departmentService.findById(staff.DepartmentId);

            const staffAdmin = await this.#studentAdminService.create({
                StaffId: staff.id,
                DepartmentId: staff.DepartmentId,
                LevelId: level.id
            })

            if (!staffAdmin.id) {
                return callback({status: 400, error: "An error occurred adding student"});
            }

            let userNotificationPayload = {
                recipients: [`${user.emailAddress}`],
                data: {
                    type: user.type,
                    name: staff.fullName,
                    department: department.name,
                    level: level.level
                },
            }

            this.#notificationService.sendAdministratoradding(userNotificationPayload, resp => {});

            callback({status: 201, message: "Staff Role Updated Successfully"});
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    removeStaffAdminPriviledge = async (userId, callback) => {
        try {
            const user = await this.#userService.findById(userId);

            if (!user) {
                return callback({status: 404, message: "User Not Found"});
            }

            const staff = await this.#staffService.getProfileByUserId(user.id);

            if (!staff) {
                return callback({status: 404, message: "Staff Not Found"});
            }

            const isStaffAdmin = await this.#staffAdminService.getProfileByStaffId(staff.id);

            if (!isStaffAdmin) {
                return callback({status: 400, message: "Staff Isn't a Level Advisor"});
            }

            const deleteResponse = await this.#staffAdminService.delete(isStaffAdmin.id);

            if (deleteResponse != 1) {
                return callback({status: 400, message: "Error occurred removing Staff"});
            }

            callback({status: 200, message: "Staff Removed Successfully"})
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    createInstitution = async (payload, callback) => {
        try {
            const emailRegex = await this.#extractDomain(payload.businessEmail);

            payload.emailRegex = emailRegex;

            const institution = await this.#institutionService.create(payload);

            if (!institution.id) {
                return callback({status: institution.status, message: institution.error});
            }

            let institutionNotification = {
                recipients: [ `${payload.businessEmail}` ],
                data: {
                    name: institution.name
                }
            }

            this.#notificationService.sendInstitutionRegistration(institutionNotification, resp => {})

            callback({status: 201, message: "Institution Created Successfully, Expect an email for verification"});
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    approveInstitution = async (institutionId, callback) => {
        try {
            const institution = await this.#institutionService.findById(institutionId);

            if (!institution) {
                return callback({ status: 404, message: "Institution Not Found"})
            }

            if (institution.approved) {
                return callback({ status: 400, message: "Institution had already been Approved"});
            }

            const password = await this.#generateRandomText(8);

            const hashedPassword = await this.#hashPassword(password);

            const approved = await this.#institutionService.update(institution.id, { approved: true });

            if (approved[0] != 1) {
                return callback({ status: 400, message: "Error Ocurred approving Institution" })
            }

            const userServiceResponse = await this.#userService.create({
                emailAddress: institution.businessEmail,
                password: hashedPassword,
                type: 1,
                activated: true
            })

            if (!userServiceResponse.id) {
                await this.#institutionService.update(institution.id, { approved: false });
                return callback({ status: 400, message: "Error Ocurred approving Institution" })
            }

            const institutionUser = await this.#institutionUserService.create({
                UserId: userServiceResponse.id,
                InstitutionId: institution.id
            })

            if (!institutionUser.id) {
                this.#institutionService.update(institution.id, { approved: false });
                this.#userService.delete(userServiceResponse.id);
                return callback({ status: 400, message: "Error Ocurred approving Institution" })
            }

            const levelsPayload = ["100", "200", "300", "400", "500"].map(level => ({level: level, InstituttionId: institution.id}))

            const levels = await this.#levelService.insertBulk(levelsPayload)

            let institutionNotification = {
                recipients: [ `${institution.businessEmail}` ],
                data: {
                    name: institution.name,
                    username: institution.businessEmail,
                    password: password,
                    link: `${infrastructure.clientbaseUrl.production2}/sign-in`
                }
            }

            await this.#notificationService.sendInstitutionApproval(institutionNotification, resp => {})

            callback({ status: 200, message: "Institution Approved Successfully" })
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    disApproveInstitution = async (institutionId, callback) => {
        try {
            const institution = await this.#institutionService.findById(institutionId);

            if (!institution) {
                return callback({ status: 404, message: "Institution Not Found"})
            }

            if (institution.approved) {
                return callback({ status: 400, message: "Institution had already been Approved"});
            }

            const deleted = await this.#institutionService.delete(institution.id);

            if (deleted != 1) {
                return callback({ status: 400, message: "Error Occurred Disapproving Institution"});
            }

            let institutionNotification = {
                recipients: [ `${institution.businessEmail}` ],
                data: {
                    name: institution.name
                }
            }

            await this.#notificationService.sendInstitutionDisApproval(institutionNotification, resp => {})
            
            callback({ status: 200, message: "Institution DisApproved Successfully" })
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    deleteInstitution = async (institutionId, callback) => {
        try {
            const institution = await this.#institutionService.findById(institutionId);

            if (!institution) {
                return callback({ status: 404, message: "Institution Not Found"})
            }

            const institutionUser = await this.#institutionUserService.getInstitutionByInstitutionId(institution.id);

            const deletedUser = await this.#userService.delete(institutionUser.UserId);

            if (deletedUser != 1) {
                return callback({ status: 400, message: "Error Occurred Deleting Institution"})
            }

            const deletedInstitution = await this.#institutionService.delete(institution.id);

            if (deletedInstitution != 1) {
                return callback({ status: 400, message: "Error Occurred Deleting Institution"})
            }

            let userNotificationPayload = {
                recipients: [`${institution.businessEmail}`],
                data: {
                },
            }

            this.#notificationService.sendAccountDelete(userNotificationPayload, resp => {});
            
            callback({ status: 200, message: "Institution Deleted Successfully" })
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    inviteStaff = async (emailAddress, callback) => {
        try {
            const user = await this.#userService.findByEmail(emailAddress);

            if (user) {
                return callback({ status: 400, message: "Email Address already exists" });
            }

            const password = await this.#generateRandomText(8);

            const hashedPassword = await this.#hashPassword(password);

            const userResponse = await this.#userService.create({
                emailAddress: emailAddress,
                password: hashedPassword,
                type: 3
            })

            if (!userResponse.id) {
                return callback({ status: userResponse.status, message: userResponse.error });
            }

            const token = await this.#generateToken(userResponse.id);

            const userNotificationPayload = {
                recipients: [`${emailAddress}`],
                data: {
                    link: `${infrastructure.clientbaseUrl.production}/verify-account?token=${token}`,
                    type: userResponse.type,
                    username: emailAddress,
                    password: password
                },
            }

            await this.#notificationService.sendStaffInvitations(userNotificationPayload, resp => {});

            callback({ status: 200, message: "Staff Invited Successfully" });
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    inviteStudent = async (emailAddress, callback) => {
        try {
            const user = await this.#userService.findByEmail(emailAddress);

            if (user) {
                return callback({ status: 400, message: "Email Address already exists" });
            }

            const password = await this.#generateRandomText(8);

            const hashedPassword = await this.#hashPassword(password);

            const userResponse = await this.#userService.create({
                emailAddress: emailAddress,
                password: hashedPassword,
                type: 4
            })

            if (!userResponse.id) {
                return callback({ status: userResponse.status, message: userResponse.error });
            }

            const token = await this.#generateToken(userResponse.id);

            const userNotificationPayload = {
                recipients: [`${emailAddress}`],
                data: {
                    link: `${infrastructure.clientbaseUrl.production}/verify-account?token=${token}`,
                    type: userResponse.type,
                    username: emailAddress,
                    password: password
                },
            }

            await this.#notificationService.sendStudentInvitations(userNotificationPayload, resp => {});

            callback({ status: 200, message: "Student Invited Successfully" });
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    deleteStudent = async (studentId, callback) => {
        try {
            const student = await this.#studentService.findById(studentId);

            if (!student) {
                return callback({ status: 404, message: "Student Not Found"})
            }

            const user = await this.#userService.findById(student.UserId);

            if (!user) {
                return callback({ status: 404, message: "Student Not Found"})
            }

            const deletedStudent = await this.#studentService.delete(student.id);

            if (deletedStudent != 1) {
                return callback({status: 400, message: "Error Occurred Deleting Student"});
            }

            const deletedUser = await this.#userService.delete(user.id);

            if (deletedUser != 1) {
                return callback({status: 400, message: "Error Occurred Deleting Student"});
            }

            let userNotificationPayload = {
                recipients: [`${user.emailAddress}`],
                data: {
                },
            }

            this.#notificationService.sendAccountDelete(userNotificationPayload, resp => {});

            callback({ status: 200, message: "Student Deleted Successfully" })
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    deleteStaff = async (staffId, callback) => {
        try {
            const staff = await this.#staffService.findById(staffId);

            if (!staff) {
                return callback({ status: 404, message: "Staff Not Found"})
            }

            const user = await this.#userService.findById(student.UserId);

            if (!user) {
                return callback({ status: 404, message: "Staff Not Found"})
            }

            const deletedStudent = await this.#staffService.delete(staff.id);

            if (deletedStudent != 1) {
                return callback({status: 400, message: "Error Occurred Deleting Staff"});
            }

            const deletedUser = await this.#userService.delete(user.id);

            if (deletedUser != 1) {
                return callback({status: 400, message: "Error Occurred Deleting Staff"});
            }

            let userNotificationPayload = {
                recipients: [`${user.emailAddress}`],
                data: {
                },
            }

            this.#notificationService.sendAccountDelete(userNotificationPayload, resp => {});

            callback({ status: 200, message: "Staff Deleted Successfully" })
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    getNewInstitutions = async (query, callback) => {
        try {
            const institutions = await this.#institutionService.getNewInsitution(query);

            let institutionsPayload = [];

            for (const institution of institutions) {
                institutionsPayload.push({
                    institutionId: institution.id,
                    name: institution.name,
                    yearOfReg: institution.yearOfReg,
                    countryOfReg: institution.countryOfReg,
                    businessEmail: institution.businessEmail,
                    registrationNumber: institution.registrationNumber
                })
            }

            callback({status: 200, data: { institutions: institutionsPayload }});
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    getInstitutions = async (query, callback) => {
        try {
            const institutions = await this.#institutionUserService.getApprovedInsitution(query);


            let institutionsPayload = [];

            for (const institution of institutions) {
                institutionsPayload.push({
                    institutionId: institution.Institution.id,
                    name: institution.Institution.name,
                    yearOfReg: institution.Institution.yearOfReg,
                    countryOfReg: institution.Institution.countryOfReg,
                    businessEmail: institution.Institution.businessEmail,
                    registrationNumber: institution.Institution.registrationNumber
                })
            }

            callback({status: 200, data: { institutions: institutionsPayload }});
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, message: "Internal Server Error"});
        }
    }

    #hashPassword = async (password) => {
        return await bcrypt.hash(password, security.saltLength);
    };

    #generateToken = async (userId) => {
        const uniqueId = uuidv4();

        const userPayload = {
            userId: userId,
            token: uniqueId
        }

        this.#cacheService.set(`token: ${uniqueId}`, userPayload, 900);

        return uniqueId;
    }

    #generateOtp = async () => {
        return Math.floor(10000 + Math.random() * 90000);
    }

    #generateRandomText = (length) => {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
    
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }
    
        return result;
    };

    #extractDomain = (email) => {
        var domainRegex = /@(.*)$/;
        
        var domainMatch = email.match(domainRegex);
        
        if (domainMatch && domainMatch.length > 1) {
            var domain = domainMatch[1];
            return domain;
        } else {
            return null;
        }
    }
}

module.exports = UserService;