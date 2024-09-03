const validate = require('validate.js');
const UserService = require('../services/UserService');
const UserConstraint = require('../constraints/UserConstraint');
const Logger = require('../utils/Logger');


let instance;


class UserController {

    #service;
    #constraint;
    #logger;


    constructor() {

        if (instance) return instance;

        this.#service = new UserService();
        this.#logger = new Logger().getLogger();
        this.#constraint = new UserConstraint()

        instance = this;

    }

    registerStudent = async (req, res) => {

        try {

            const validation = validate(req.body, this.#constraint.userregistration());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }

            this.#service.createStudentAccount(req.body, (response) => {
                res.status(response.status).json(response);
            });


        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    registerTutor = async (req, res) => {

        try {
            
            const validation = validate(req.body, this.#constraint.userregistration());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }

            this.#service.createTutorAccount(req.body, (response) => {
                res.status(response.status).json(response);
            });


        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    activateAccount = async (req, res) => {

        try {
            const validation = validate(req.query, this.#constraint.activateAccount());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }

            this.#service.activateAccount(req.query.token, (response) => {
                res.status(response.status).json(response);
            });


        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    requestNewActivationLink = async (req, res) => {

        try {
            
            const validation = validate(req.query, this.#constraint.requestnewActivationLink());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }

            this.#service.requestVerificationLink(req.query.emailAddress, (response) => {
                res.status(response.status).json(response);
            });


        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    initiatePasswordReset = async (req, res) => {

        try {
            const validation = validate(req.body, this.#constraint.initiatePasswordChange());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }

            this.#service.initiatePasswordChange(req.body.emailAddress, (response) => {
                res.status(response.status).json(response);
            });


        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    completePasswordReset = async (req, res) => {

        try {
            
            const validation = validate(req.body, this.#constraint.completePasswordReset());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }

            this.#service.completePasswordChange(req.body.otp, req.body.newPassword, (response) => {
                res.status(response.status).json(response);
            });


        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    signIn = async(req, res) => {
        try {

            const authHeader = req.headers['authorization'];

            if (!authHeader) {
              return res.status(401).json({error: 'Unauthorized'});
            }

            const encodedCredentials = authHeader.split(' ')[1];
            const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');
            const [username, password] = decodedCredentials.split(':');

			const payload = {
                emailAddress: username,
                password
            }

            const validation = validate(payload, this.#constraint.confirmEmailAndPassword());

            if (validation) {
                res.status(422).json({
                    message: "validation error",
                    data: validation
                })
                return;
            }

            this.#service.confirmEmailAndPassword(payload, (response) => {
                res.status(response.status).json(response);
            })
        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    createStudentProfile = async (req, res) => {

        try {
            const isAuthorized = await this.#authValidator(req.isAuth);
            if (!isAuthorized) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const isStudent = await this.#studentValidator(req.type);
            if (!isStudent) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            
            const validation = validate(req.body, this.#constraint.createStudentProfile());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }

            this.#service.createStudentProfile(req.userId, req.body, (response) => {
                res.status(response.status).json(response);
            });


        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    createStaffProfile = async (req, res) => {

        try {

            const isAuthorized = await this.#authValidator(req.isAuth);
            if (!isAuthorized) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const isStaff = await this.#staffValidator(req.type);
            if (!isStaff) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            
            const validation = validate(req.body, this.#constraint.createStaffProfile());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }

            this.#service.createTutorProfile(req.userId, req.body, (response) => {
                res.status(response.status).json(response);
            });


        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    updateStudentProfile = async (req, res) => {

        try {

            const isAuthorized = await this.#authValidator(req.isAuth);
            if (!isAuthorized) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const isStudent = await this.#studentValidator(req.type);
            if (!isStudent) {
                return res.status(401).json({ message: "Unauthorized" });
            }
          
            this.#service.updateStudentProfile(req.userId, req.body, (response) => {
                res.status(response.status).json(response);
            });


        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    getUserProfile = async (req, res) => {

        try {

            const isAuthorized = await this.#authValidator(req.isAuth);
            if (!isAuthorized) {
                return res.status(401).json({ message: "Unauthorized" });
            }
          
            this.#service.getUserProfile(req.userId, (response) => {
                res.status(response.status).json(response);
            });


        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    deleteUserAccount = async (req, res) => {

        try {

            const isAuthorized = await this.#authValidator(req.isAuth);
            if (!isAuthorized) {
                return res.status(401).json({ message: "Unauthorized" });
            }
          
            this.#service.deleteAccount(req.userId, (response) => {
                res.status(response.status).json(response);
            });


        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    addStudentAdminPriviledge = async (req, res) => {

        try {

            const isAuthorized = await this.#authValidator(req.isAuth);
            if (!isAuthorized) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const isInstitution = await this.#institutionValidator(req.type);
            if (!isInstitution) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const validation = validate(req.body, this.#constraint.studentPriviledge());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }
          
            this.#service.addStudentAdminPriviledge(req.body.userId, (response) => {
                res.status(response.status).json(response);
            });


        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    removeStudentAdminPriviledge = async (req, res) => {

        try {

            const isAuthorized = await this.#authValidator(req.isAuth);
            if (!isAuthorized) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const isInstitution = await this.#institutionValidator(req.type);
            if (!isInstitution) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const validation = validate(req.body, this.#constraint.studentPriviledge());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }
          
            this.#service.removeStudentAdminPriviledge(req.body.userId, (response) => {
                res.status(response.status).json(response);
            });


        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    addStaffAdminPriviledge = async (req, res) => {

        try {

            const isAuthorized = await this.#authValidator(req.isAuth);
            if (!isAuthorized) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const isInstitution = await this.#institutionValidator(req.type);
            if (!isInstitution) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const validation = validate(req.body, this.#constraint.addingStaffPriviledge());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }
          
            this.#service.addStaffAdminPriviledge(req.body.userId, req.body.levelId, (response) => {
                res.status(response.status).json(response);
            });


        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    removeStaffAdminPriviledge = async (req, res) => {

        try {

            const isAuthorized = await this.#authValidator(req.isAuth);
            if (!isAuthorized) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const isInstitution = await this.#institutionValidator(req.type);
            if (!isInstitution) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const validation = validate(req.body, this.#constraint.removingStaffPriviledge());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }
          
            this.#service.removeStaffAdminPriviledge(req.body.userId, (response) => {
                res.status(response.status).json(response);
            });


        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    updateStaffProfile = async (req, res) => {

        try {

            const isAuthorized = await this.#authValidator(req.isAuth);
            if (!isAuthorized) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const isStaff = await this.#staffValidator(req.type);
            if (!isStaff) {
                return res.status(401).json({ message: "Unauthorized" });
            }
          
            this.#service.updateTutorProfile(req.userId, req.body, (response) => {
                res.status(response.status).json(response);
            });


        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    //new

    createInstitution = async (req, res) => {

        try {

            const validation = validate(req.body, this.#constraint.createInstitution());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }
          
            this.#service.createInstitution(req.body, (response) => {
                res.status(response.status).json(response);
            });


        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    approveInstitution = async (req, res) => {

        try {

            const isAuthorized = await this.#authValidator(req.isAuth);
            if (!isAuthorized) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const isSuperAdmin = await this.#superAdminValidator(req.type);
            if (!isSuperAdmin) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const validation = validate(req.query, this.#constraint.approveInstitution());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }
          
            this.#service.approveInstitution(req.query.institutionId, (response) => {
                res.status(response.status).json(response);
            });


        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    getNewInstitutions = async (req, res) => {

        try {

            const isAuthorized = await this.#authValidator(req.isAuth);
            if (!isAuthorized) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const isSuperAdmin = await this.#superAdminValidator(req.type);
            if (!isSuperAdmin) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const validation = validate(req.query, this.#constraint.getInstitutions());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }
          
            this.#service.getNewInstitutions(req.query, (response) => {
                res.status(response.status).json(response);
            });


        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    getInstitutions = async (req, res) => {

        try {

            const isAuthorized = await this.#authValidator(req.isAuth);
            if (!isAuthorized) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const isSuperAdmin = await this.#superAdminValidator(req.type);
            if (!isSuperAdmin) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const validation = validate(req.query, this.#constraint.getInstitutions());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }
          
            this.#service.getInstitutions(req.query, (response) => {
                res.status(response.status).json(response);
            });


        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }


    disApproveInstitution = async (req, res) => {

        try {

            const isAuthorized = await this.#authValidator(req.isAuth);
            if (!isAuthorized) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const isSuperAdmin = await this.#superAdminValidator(req.type);
            if (!isSuperAdmin) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const validation = validate(req.query, this.#constraint.disApproveInstitution());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }
          
            this.#service.disApproveInstitution(req.query.institutionId, (response) => {
                res.status(response.status).json(response);
            });


        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    deleteInstitution = async (req, res) => {

        try {

            const isAuthorized = await this.#authValidator(req.isAuth);
            if (!isAuthorized) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const isSuperAdmin = await this.#superAdminValidator(req.type);
            if (!isSuperAdmin) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const validation = validate(req.query, this.#constraint.deleteInstitution());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }
          
            this.#service.deleteInstitution(req.query.institutionId, (response) => {
                res.status(response.status).json(response);
            });


        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    inviteStaff = async (req, res) => {

        try {

            // const isAuthorized = await this.#authValidator(req.isAuth);
            // if (!isAuthorized) {
            //     return res.status(401).json({ message: "Unauthorized" });
            // }

            // const isInstitution = await this.#institutionValidator(req.type);
            // if (!isInstitution) {
            //     return res.status(401).json({ message: "Unauthorized" });
            // }

            const validation = validate(req.body, this.#constraint.userInvitation());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }
          
            this.#service.inviteStaff(req.body.emailAddress, (response) => {
                res.status(response.status).json(response);
            });


        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    inviteStudent = async (req, res) => {

        try {

            // const isAuthorized = await this.#authValidator(req.isAuth);
            // if (!isAuthorized) {
            //     return res.status(401).json({ message: "Unauthorized" });
            // }

            // const isInstitution = await this.#institutionValidator(req.type);

            // const isStaff = await this.#staffValidator(req.type);

            // if (!isInstitution && !isStaff) {
            //     return res.status(401).json({ message: "Unauthorized" });
            // }

            const validation = validate(req.body, this.#constraint.userInvitation());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }
          
            this.#service.inviteStudent(req.body.emailAddress, (response) => {
                res.status(response.status).json(response);
            });


        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    deleteStaff = async (req, res) => {

        try {

            // const isAuthorized = await this.#authValidator(req.isAuth);
            // if (!isAuthorized) {
            //     return res.status(401).json({ message: "Unauthorized" });
            // }

            // const isInstitution = await this.#institutionValidator(req.type);
            // if (!isInstitution) {
            //     return res.status(401).json({ message: "Unauthorized" });
            // }

            const validation = validate(req.query, this.#constraint.userDeletion());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }
          
            this.#service.deleteStaff(req.query.userId, (response) => {
                res.status(response.status).json(response);
            });


        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    deleteStudent = async (req, res) => {

        try {

            // const isAuthorized = await this.#authValidator(req.isAuth);
            // if (!isAuthorized) {
            //     return res.status(401).json({ message: "Unauthorized" });
            // }

            // const isInstitution = await this.#institutionValidator(req.type);
            // if (!isInstitution) {
            //     return res.status(401).json({ message: "Unauthorized" });
            // }

            const validation = validate(req.query, this.#constraint.userDeletion());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }
          
            this.#service.deleteStudent(req.query.userId, (response) => {
                res.status(response.status).json(response);
            });


        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    #studentValidator = async (type) => {
        if (type == 4) {
            return true
        } else {
            return false
        }
    }

    #institutionValidator = async (type) => {
        if (type == 1) {
            return true
        } else {
            return false
        }
    }

    #superAdminValidator = async (type) => {
        if (type == 0) {
            return true
        } else {
            return false
        }
    }

    #staffValidator = async (type) => {
        if (type == 3) {
            return true
        } else {
            return false
        }
    }

    #authValidator = async (isAuth) => {
        if (isAuth) {
            return true
        } else {
            return false
        }
    }
}



module.exports = UserController;