const validate = require('validate.js');
const CoreService = require('../services/CoreService');
const CoreConstraint = require('../constraints/CoreConstraint');
const Logger = require('../utils/Logger');
const UserService = require('../services/UserService');


let instance;


class CoreController {

    #service;
    #constraint;
    #logger;
    #userService;


    constructor() {

        if (instance) return instance;

        this.#service = new CoreService();
        this.#logger = new Logger().getLogger();
        this.#constraint = new CoreConstraint();
        this.#userService = new UserService();

        instance = this;

    }

    getLevelsByInstitutionId = async (req, res) => {
        try {
            const validation = validate(req.query, this.#constraint.getByInstitutionId());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })
            
            }

            this.#service.getLevelsByInstitutionId(req.query.institutionId, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err);
            res.status(500).json({message: "Internal Server error"})
        }
    }

    getDepartmentsByInstitutionId = async (req, res) => {
        try {
            const validation = validate(req.query, this.#constraint.getByInstitutionId());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })
            
            }

            this.#service.getDepartmentsByInstitutionId(req.query.institutionId, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err);
            res.status(500).json({message: "Internal Server error"})
        }
    }

    createLevel = async (req, res) => {
        try {
            const profile = await new Promise((resolve, reject) => {
                this.#userService.getUserProfile(req.userId, resp => resolve(resp));
            });

            if (profile.status != 200) {
                return res.status(profile.status).json({message: "Unauthorised"});
            }

            req.body.InstitutionId = profile.data.profile.profileId;

            const validation = validate(req.body, this.#constraint.addLevel());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })
            
            }

            this.#service.addLevel(req.body, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err);
            res.status(500).json({message: "Internal Server error"})
        }
    }

    deleteLevel = async (req, res) => {
        try {
            const validation = validate(req.query, this.#constraint.deleteLevel());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })
            
            }

            this.#service.deleteLevel(req.query.levelId, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err);
            res.status(500).json({message: "Internal Server error"})
        }
    }

    getInstitutionStudents = async (req, res) => {
        try {

            const profile = await new Promise((resolve, reject) => {
                this.#userService.getUserProfile(req.userId, resp => resolve(resp));
            });

            if (profile.status != 200) {
                return res.status(profile.status).json({message: "Unauthorised"});
            }

            req.query.institutionId = profile.data.profile.profileId;

            const validation = validate(req.query, this.#constraint.getInstitutionStudents());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })
            
            }

            this.#service.getInstitutionStudents(req.query, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    getInstitutionStaffs = async (req, res) => {
        try {

            const profile = await new Promise((resolve, reject) => {
                this.#userService.getUserProfile(req.userId, resp => resolve(resp));
            });

            if (profile.status != 200) {
                return res.status(profile.status).json({message: "Unauthorised"});
            }

            req.query.institutionId = profile.data.profile.profileId;

            const validation = validate(req.query, this.#constraint.getInstitutionStaffs());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }

            this.#service.getInstitutionStaffs(req.query, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    getInstitutionPriviledgeUsers = async (req, res) => {
        try {

            const profile = await new Promise((resolve, reject) => {
                this.#userService.getUserProfile(req.userId, resp => resolve(resp));
            });

            if (profile.status != 200) {
                return res.status(profile.status).json({message: "Unauthorised"});
            }

            req.query.institutionId = profile.data.profile.profileId;

            const validation = validate(req.query, this.#constraint.getInstitutionPriviledgeUsers());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }

            this.#service.getInstitutionPriviledgeUsers(req.query, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    getCoursesByDepartmentAndLevel = async (req, res) => {
        try {

            const validation = validate(req.query, this.#constraint.getCoursesByDepartmentAndLevel());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }

            this.#service.getCoursesByDepartmentAndLevel(req.query, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    getCoursesByDepartment = async (req, res) => {
        try {
            const validation = validate(req.query, this.#constraint.getCoursesByDepartment());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }

            this.#service.getCoursesByDepartment(req.query, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    getStaffCourses = async (req, res) => {
        try {
            const profile = await new Promise((resolve, reject) => {
                this.#userService.getUserProfile(req.userId, resp => resolve(resp));
            });

            if (profile.status != 200) {
                return res.status(profile.status).json({message: "Unauthorised"});
            }

            req.query.staffId = profile.data.profile.profileId;

            const validation = validate(req.query, this.#constraint.getStaffCourses());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }

            this.#service.getStaffCourses(req.query, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    getCourse = async (req, res) => {
        try {

            const validation = validate(req.query, this.#constraint.getCourse());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }

            this.#service.getCourse(req.query.courseId, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    createCourse = async (req, res) => {
        try {

            const validation = validate(req.body, this.#constraint.createCourse());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }

            this.#service.createCourse(req.body, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    addStaffCourses = async (req, res) => {
        try {

            const profile = await new Promise((resolve, reject) => {
                this.#userService.getUserProfile(req.userId, resp => resolve(resp));
            });

            if (profile.status != 200) {
                return res.status(profile.status).json({message: "Unauthorised"});
            }

            req.body.staffId = profile.data.profile.profileId;

            const validation = validate(req.body, this.#constraint.addStaffCourses());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }

            this.#service.addStaffCourses(req.body.staffId, req.body.courses, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    editCourse = async (req, res) => {
        try {

            const validation = validate(req.query, this.#constraint.editCourse());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }

            this.#service.editCourse(req.query.courseId, req.body, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    deleteCourse = async (req, res) => {
        try {
            const validation = validate(req.query, this.#constraint.deleteCourse());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }

            this.#service.deleteCourse(req.query.courseId, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    getDepartments = async (req, res) => {
        try {
            const profile = await new Promise((resolve, reject) => {
                this.#userService.getUserProfile(req.userId, resp => resolve(resp));
            });

            if (profile.status != 200) {
                return res.status(profile.status).json({message: "Unauthorised"});
            }

            req.query.institutionId = profile.data.profile.profileId;
            
            const validation = validate(req.query, this.#constraint.getDepartments());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }

            this.#service.getDepartments(req.query, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    createDepartment = async (req, res) => {
        try {

            const profile = await new Promise((resolve, reject) => {
                this.#userService.getUserProfile(req.userId, resp => resolve(resp));
            });

            if (profile.status != 200) {
                return res.status(profile.status).json({message: "Unauthorised"});
            }

            req.body.InstitutionId = profile.data.profile.profileId;

            const validation = validate(req.body, this.#constraint.createDepartment());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }

            this.#service.createDepartment(req.body, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({message: "Internal Server Error"});
        }
    } 

    deleteDepartment = async (req, res) => {
        try {

            const validation = validate(req.query, this.#constraint.deleteDepartment());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }

            this.#service.deleteDepartment(req.query.departmentId, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({message: "Internal Server Error"});
        }
    } 

    updateDepartment = async (req, res)=> {
        try {

            const validation = validate(req.query, this.#constraint.updateDepartment());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }

            this.#service.updateDepartment(req.query.departmentId, req.body, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({message: "Internal Server Error"});
        }
    } 

    getEvents = async (req, res) => {
        try {

            const profile = await new Promise((resolve, reject) => {
                this.#userService.getUserProfile(req.userId, resp => resolve(resp));
            });

            if (profile.status != 200) {
                return res.status(profile.status).json({message: "Unauthorised"});
            }

            req.query.institutionId = profile.data.profile.profileId;

            const validation = validate(req.query, this.#constraint.getEvents());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }

            this.#service.getEvents(req.query.institutionId, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    createEvent = async (req, res) => {
        try {
            const profile = await new Promise((resolve, reject) => {
                this.#userService.getUserProfile(req.userId, resp => resolve(resp));
            });

            if (profile.status != 200) {
                return res.status(profile.status).json({message: "Unauthorised"});
            }

            req.body.InstitutionId = profile.data.profile.profileId;

            const validation = validate(req.body, this.#constraint.createEvent());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }

            this.#service.createEvent(req.body, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({message: "Internal Server Error"});
        }
    } 

    deleteEvent = async (req, res) => {
        try {

            const validation = validate(req.query, this.#constraint.deleteEvent());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }

            this.#service.deleteEvent(req.query.eventId, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({message: "Internal Server Error"});
        }
    } 

    updateEvent = async (req, res) => {
        try {

            const validation = validate(req.query, this.#constraint.updateEvent());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }

            this.#service.updateEvent(req.query.eventId, req.body, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({message: "Internal Server Error"});
        }
    } 

    generateNewDepartmentTable = async (req, res) => {
        try {

            const profile = await new Promise((resolve, reject) => {
                this.#userService.getUserProfile(req.userId, resp => resolve(resp));
            });

            if (profile.status != 200) {
                return res.status(profile.status).json({message: "Unauthorised"});
            }

            req.query.staffId = profile.data.profile.profileId;

            const validation = validate(req.query, this.#constraint.generateNewDepartmentTable());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }

            this.#service.generateNewDepartmentTable(req.query.staffId, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    getDepartmentTimeTable = async (req, res) => {
        try {

            const validation = validate(req.query, this.#constraint.getDepartmentTimeTable());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }

            this.#service.getDepartmentTimeTable(req.query.departmentId, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    getStudentTimeTable = async (req, res) => {
        try {

            const profile = await new Promise((resolve, reject) => {
                this.#userService.getUserProfile(req.userId, resp => resolve(resp));
            });

            if (profile.status != 200) {
                return res.status(profile.status).json({message: "Unauthorised"});
            }

            req.query.studentId = profile.data.profile.profileId;

           
            this.#service.getStudentTimeTable(req.query.studentId, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    getInstitutionTimeTable = async (req, res) => {
        try {

            const profile = await new Promise((resolve, reject) => {
                this.#userService.getUserProfile(req.userId, resp => resolve(resp));
            });

            if (profile.status != 200) {
                return res.status(profile.status).json({message: "Unauthorised"});
            }

            req.query.institutionId = profile.data.profile.profileId;

            const validation = validate(req.query, this.#constraint.getInstitutionTimeTable());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }

            this.#service.getInstitutionTimeTable(req.query.institutionId, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    getStaffTimeTable = async (req, res) => {
        try {

            const profile = await new Promise((resolve, reject) => {
                this.#userService.getUserProfile(req.userId, resp => resolve(resp));
            });

            if (profile.status != 200) {
                return res.status(profile.status).json({message: "Unauthorised"});
            }

            req.query.staffId = profile.data.profile.profileId;

            const validation = validate(req.query, this.#constraint.getStaffTimeTable());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }


            this.#service.getStaffTimeTable(req.query.staffId, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    sendStaffTimeTable = async (req, res) => {
        try {

            const profile = await new Promise((resolve, reject) => {
                this.#userService.getUserProfile(req.userId, resp => resolve(resp));
            });

            if (profile.status != 200) {
                return res.status(profile.status).json({message: "Unauthorised"});
            }

            req.query.institutionId = profile.data.profile.profileId;

            const validation = validate(req.query, this.#constraint.sendStaffTimeTable());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }


            this.#service.sendStaffTimeTable(req.query.staffId, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    sendStudentTimeTable = async (req, res) => {
        try {

            const profile = await new Promise((resolve, reject) => {
                this.#userService.getUserProfile(req.userId, resp => resolve(resp));
            });

            if (profile.status != 200) {
                return res.status(profile.status).json({message: "Unauthorised"});
            }

            req.query.studentId = profile.data.profile.profileId;

            const validation = validate(req.query, this.#constraint.sendStudentTimeTable());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }

            this.#service.sendStudentTimeTable(req.query.studentId, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    updateTimeTable = async (req, res) => {
        try {

            const profile = await new Promise((resolve, reject) => {
                this.#userService.getUserProfile(req.userId, resp => resolve(resp));
            });

            if (profile.status != 200) {
                return res.status(profile.status).json({message: "Unauthorised"});
            }

            req.body.staffId = profile.data.profile.profileId;

            const validation = validate(req.body, this.#constraint.updateTimeTable());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }


            this.#service.updateTimeTable(req.body, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    getStaffByDepartmentId = async (req, res) => {
        try {

            const profile = await new Promise((resolve, reject) => {
                this.#userService.getUserProfile(req.userId, resp => resolve(resp));
            });

            if (profile.status != 200) {
                return res.status(profile.status).json({message: "Unauthorised"});
            }

            req.query.staffId = profile.data.profile.profileId;

            const validation = validate(req.query, this.#constraint.getByStaff());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }


            this.#service.getStaffByDepartmentId(req.query, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    getStudentByDepartmentId = async (req, res) => {
        try {

            const profile = await new Promise((resolve, reject) => {
                this.#userService.getUserProfile(req.userId, resp => resolve(resp));
            });

            if (profile.status != 200) {
                return res.status(profile.status).json({message: "Unauthorised"});
            }

            req.query.staffId = profile.data.profile.profileId;

            const validation = validate(req.query, this.#constraint.getByStaff());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }


            this.#service.getStudentByDepartmentId(req.query, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    updateExaminationCourse = async (req, res) => {
        try {
            const validation = validate(req.query, this.#constraint.examCourse());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }


            this.#service.updateExaminationCourse(req.query.courseId, req.body, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    getDepartmentExamCourses = async (req, res) => {
        try {
            const validation = validate(req.query, this.#constraint.getExamCourses());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }


            this.#service.getDepartmentExamCourses(req.query.departmentId, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    removeExaminationCourse = async (req, res) => {
        try {
            const validation = validate(req.query, this.#constraint.examCourse());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }


            this.#service.removeExaminationCourse(req.query.courseId, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    addExaminationCourse = async (req, res) => {
        try {
            const validation = validate(req.body, this.#constraint.addExamCourse());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }


            this.#service.addExaminationCourse(req.body, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    getStudentExamTimeTable = async (req, res) => {
        try {

            const profile = await new Promise((resolve, reject) => {
                this.#userService.getUserProfile(req.userId, resp => resolve(resp));
            });

            if (profile.status != 200) {
                return res.status(profile.status).json({message: "Unauthorised"});
            }

            req.query.studentId = profile.data.profile.profileId;


            const validation = validate(req.query, this.#constraint.getExamBystudentId());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }


            this.#service.getStudentExamTimetable(req.query.studentId, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    getStaffExamTimeTable = async (req, res) => {
        try {
            const profile = await new Promise((resolve, reject) => {
                this.#userService.getUserProfile(req.userId, resp => resolve(resp));
            });

            if (profile.status != 200) {
                return res.status(profile.status).json({message: "Unauthorised"});
            }

            req.query.staffId = profile.data.profile.profileId;

            const validation = validate(req.query, this.#constraint.getBystaffId());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }


            this.#service.getStaffExamTimetable(req.query.staffId, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    getDepartmentExamTimeTable = async (req, res) => {
        try {
            const validation = validate(req.query, this.#constraint.getExamByDepartment());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }

            this.#service.getDepartmentExamTimetable(req.query.departmentId, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    getInstitutionExamTimeTable = async (req, res) => {
        try {
            const profile = await new Promise((resolve, reject) => {
                this.#userService.getUserProfile(req.userId, resp => resolve(resp));
            });

            if (profile.status != 200) {
                return res.status(profile.status).json({message: "Unauthorised"});
            }

            req.query.institutionId = profile.data.profile.profileId;

            const validation = validate(req.query, this.#constraint.getExamByInstitution());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }


            this.#service.getIntitutionExamTimetable(req.query.institutionId, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err);
            res.status(500).json({message: "Internal Server Error"});
        }
    }


    generateNewExamTimeTable = async (req, res) => {
        try {
            const profile = await new Promise((resolve, reject) => {
                this.#userService.getUserProfile(req.userId, resp => resolve(resp));
            });

            if (profile.status != 200) {
                return res.status(profile.status).json({message: "Unauthorised"});
            }

            req.body.staffId = profile.data.profile.profileId;

            const validation = validate(req.body, this.#constraint.generateNewExamTable());

            if (validation) {

                return res.status(422).json({
                    message: "validation error",
                    data: validation
                })

            
            }


            this.#service.generateNewDepartmentExamTable(req.body.staffId, req.body, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    getInstitutionDashboard = async (req, res) => {
        try {

            const profile = await new Promise((resolve, reject) => {
                this.#userService.getUserProfile(req.userId, resp => resolve(resp));
            });

            if (profile.status != 200) {
                return res.status(profile.status).json({message: "Unauthorised"});
            }

            this.#service.getInstitutionDashboard(profile.data.profile.profileId, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    getStaffAdminDashboard = async (req, res) => {
        try {

            const profile = await new Promise((resolve, reject) => {
                this.#userService.getUserProfile(req.userId, resp => resolve(resp));
            });

            if (profile.status != 200) {
                return res.status(profile.status).json({message: "Unauthorised"});
            }

            this.#service.getStaffAdminDashboard(profile.data.profile.profileId, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (err) {
            this.#logger.error(err)
            res.status(500).json({message: "Internal Server Error"});
        }
    }

}


module.exports = CoreController;