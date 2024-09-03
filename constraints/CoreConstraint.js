

let instance;


class CoreConstraint {

    constructor() {

        if (instance) return instance;


        instance = this;

    }

    getInstitutionStudents = () => {
        return {
            institutionId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
            page: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                }
            },
            size: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            }
        }
    }

    getInstitutionStaffs = () => {
        return {
            institutionId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
            page: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                }
            },
            size: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            }
        }
    }

    getInstitutionPriviledgeUsers = () => {
        return {
            institutionId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
            page: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                }
            },
            size: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            }
        }
    }

    getCoursesByDepartmentAndLevel = () => {
        return {
            departmentId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
            levelId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
            page: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                }
            },
            size: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            }
        }
    }

    getCoursesByDepartment = () => {
        return {
            departmentId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
            page: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                }
            },
            size: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            }
        }
    }

    getStaffCourses = () => {
        return {
            staffId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
            page: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                }
            },
            size: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            }
        }
    }

    getCourse = () => {
        return {
            courseId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            }
        }
    }

    createCourse = () => {
        return {
            courseCode: {
                presence: true,
                length: {
                    minimum: 2
                }
            },
            courseName: {
                presence: true,
                length: {
                    minimum: 3
                }
            },
            unit: {
                presence: true,
                numericality: {
                    onlyInteger: true
                }
            },
            requirementStatus: {
                presence: true,
                length: {
                    minimum: 2
                }
            },
            duration: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
            DepartmentId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
            VenueId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
            InstitutionId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
            LevelId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            }
        }
    }

    addStaffCourses = () => {
        return {
            staffId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
            courses: {
                presence: true,
                type: 'array'
            }
        }
    }

    editCourse = () => {
        return {
            courseId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            }
        }
    }

    deleteCourse = () => {
        return {
            courseId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            }
        }
    }

    getDepartments = () => {
        return {
            institutionId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
            page: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                }
            },
            size: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            }
        }
    }

    getByStaff = () => {
        return {
            staffId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
            page: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                }
            },
            size: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            }
        }
    }

    examCourse = () => {
        return {
            courseId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
        }
    }

    getBystaffId = () => {
        return {
            staffId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
        }
    }

    generateNewExamTable = () => {
        return {
            staffId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
            startsAt: {
                presence: true,
            },
            endsAt: {
                presence: true,
            }
        }
    }

    getExamBystudentId = () => {
        return {
            studentId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
        }
    }

    getExamByInstitution = () => {
        return {
            institutionId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
        }
    }

    getExamByDepartment = () => {
        return {
            departmentId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
        }
    }

    addExamCourse = () => {
        return {
            CourseId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
            LevelId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
            VenueId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
            duration: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
        }
    }

    getExamCourses = () => {
        return {
            departmentId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
        }
    }

    getByInstitutionId = () => {
        return {
            institutionId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
        }
    }

    addLevel = () => {
        return {
            InstitutionId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
            level: {
                presence: true,
                length: {
                    minimum: 2
                }
            }
        }
    }

    deleteLevel = () => {
        return {
            levelId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
        }
    }

    createDepartment = () => {
        return {
            name: {
                presence: true,
                length: {
                    minimum: 3
                }
            },
            InstitutionId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
            venues: {
                presence: true,
                type: "array"
            }
        }
    } 

    deleteDepartment = () => {
        return {
            departmentId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            }
        }
    } 

    updateDepartment = ()=> {
        return {
            departmentId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            }
        }
    } 

    getEvents = () => {
        return {
            institutionId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            }
        }
    }

    createEvent = () => {
        return {
            name: {
                presence: true,
                length: {
                    minimum: 3
                }
            },
            startFrom: {
                presence: true,
            },
            endsAt: {
                presence: true,
            },
            requirementStatus: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                }
            },
            recurring: {
                presence: true
            },
            InstitutionId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
            venueId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
            departments: {
                presence: true,
                type: 'array'
            },
            levels: {
                presence: true,
                type: 'array'
            }
        }
    } 

    deleteEvent = () => {
        return {
            eventId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            }
        }
    } 

    updateEvent = () => {
        return {
            eventId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            }
        }
    } 

    generateNewDepartmentTable = () => {
        return {
            staffId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
        }
    }

    getDepartmentTimeTable = () => {
        return {
            departmentId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            }
        }
    }

    getInstitutionTimeTable = () => {
        return {
            institutionId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            }
        }
    }

    getStaffTimeTable = () => {
        return {
            staffId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            }
        }
    }

    sendStaffTimeTable = () => {
        return {
            staffId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            }
        }
    }

    sendStudentTimeTable = () => {
        return {
            studentId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            }
        }
    }

    updateTimeTable = () => {
        return {
            staffId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
            courseId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
        }
    }

}


module.exports = CoreConstraint;