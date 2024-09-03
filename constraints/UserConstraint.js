

let instance;


class UserConstraint {

    constructor() {

        if (instance) return instance;


        instance = this;

    }

    userregistration = () => {
        return {
            emailAddress: {
                presence: true,
                email: true
            },
            password: {
                presence: true,
                length: {
                    minimum: 8,
                    message: "must be at least 8 characters"
                }
            },
        }
    }

    confirmEmailAndPassword = () => {
        return {
            emailAddress: {
                presence: true,
                email: true
            },
            password: {
                presence: true,
                length: {
                    minimum: 8,
                    message: "must be at least 8 characters"
                }
            },
        }
    }

    activateAccount = () => {
        return {
            token: {
                presence: true,
            }
        }
    }


    initiatePasswordChange = () => {
        return {
            emailAddress: {
                presence: true,
                email: true
            }
        }
    }

    requestnewActivationLink = () => {
        return {
            emailAddress: {
                presence: true,
                email: true
            }
        }
    }

    completePasswordReset = () => {
        return {
            otp: {
                presence: true
            },
            newPassword: {
                presence: true,
                length: {
                    minimum: 8,
                    message: "must be at least 8 characters"
                }
            }
        }
    }

    createStudentProfile = () => {
        return {
            fullName: {
                presence: true,
                length: {
                    minimum: 2,
                }
            },
            institutionId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
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
            }
        }
    }

    createStaffProfile = () => {
        return {
            fullName: {
                presence: true,
                length: {
                    minimum: 2,
                }
            },
            departmentId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
        }
    }

    addingStaffPriviledge = () => {
        return {
            levelId: {
                presence: true,
            },
            userId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
        }
    }
    

    studentPriviledge = () => {
        return {
            userId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
        }
    }

    userDeletion = () => {
        return {
            userId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
        }
    }

    removingStaffPriviledge = () => {
        return {
            userId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
        }
    }

    approveInstitution = () => {
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

    disApproveInstitution = () => {
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

    getInstitutions = () => {
        return {
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
            },
        }
    }

    userInvitation = () => {
        return {
            emailAddress: {
                presence: true,
                email: true
            },
        }
    }

    deleteInstitution = () => {
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

    createInstitution = () => {
        return {
            businessEmail: {
                presence: true,
                email: true
            },
            name: {
                presence: true,
                length: {
                    minimum: 3,
                }
            },
            yearOfReg: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
            countryOfReg: {
                presence: true,
                length: {
                    minimum: 3,
                }
            },
            registrationNumber: {
                presence: true,
                length: {
                    minimum: 3,
                }
            },
        }
    }

}


module.exports = UserConstraint;