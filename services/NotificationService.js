const Mailer = require("../utils/Mailer");

let instance;
class NotificationService {

    #mailer;

    constructor() {

        if (instance) return instance;

        this.#mailer = new Mailer();

        instance = this;

    }


    sendVerifyRegistration = async (message, callback) => {

       
        message.recipients.forEach(async (item) => {

            let info = {
                sender: "noreply@classoptima.bakare.tech",
                templateFile: "verify-registration.ejs",
                subject: "Account Created Successfully",
                recipients: item,
                data: message.data
            }

            this.#mailer.sendMail(info, (response) => {
                callback(response);
            })

        })


    }

    sendNewStudentTimeTable = async (message, callback) => {

       
        message.recipients.forEach(async (item) => {

            let info = {
                sender: "noreply@classoptima.bakare.tech",
                templateFile: "new-timetable.ejs",
                subject: "Your New Timetable is Ready on ClassOptima!",
                recipients: item,
                data: message.data,
                attachments: message.attachments
            }

            this.#mailer.sendMail(info, (response) => {
                callback(response);
            })

        })


    }

    sendOldStudentTimeTable = async (message, callback) => {

       
        message.recipients.forEach(async (item) => {

            let info = {
                sender: "noreply@classoptima.bakare.tech",
                templateFile: "old-timetable.ejs",
                subject: "Your ClassOptima Timetable Request",
                recipients: item,
                data: message.data,
                attachments: message.attachments
            }

            this.#mailer.sendMail(info, (response) => {
                callback(response);
            })

        })


    }

    sendUpdatedTimeTable = async (message, callback) => {

       
        message.recipients.forEach(async (item) => {

            let info = {
                sender: "noreply@classoptima.bakare.tech",
                templateFile: "update-timetable.ejs",
                subject: "Your Updated ClassOptima Timetable",
                recipients: item,
                data: message.data,
                attachments: message.attachments
            }

            this.#mailer.sendMail(info, (response) => {
                callback(response);
            })

        })


    }

    sendStaffTimeTable = async (message, callback) => {

       
        message.recipients.forEach(async (item) => {

            let info = {
                sender: "noreply@classoptima.bakare.tech",
                templateFile: "staff-timetable.ejs",
                subject: "Your ClassOptima Timetable Request",
                recipients: item,
                data: message.data,
                attachments: message.attachments
            }

            this.#mailer.sendMail(info, (response) => {
                callback(response);
            })

        })


    }

    sendAccountActivation = async (message, callback) => {

       
        message.recipients.forEach(async (item) => {

            let info = {
                sender: "noreply@classoptima.bakare.tech",
                templateFile: "account-activated.ejs",
                subject: "Account Activated Successfully",
                recipients: item,
                data: message.data
            }

            this.#mailer.sendMail(info, (response) => {
                callback(response);
            })

        })


    }

    sendInitiatePasswordReset = async (message, callback) => {

       
        message.recipients.forEach(async (item) => {

            let info = {
                sender: "noreply@classoptima.bakare.tech",
                templateFile: "initiate-password-reset.ejs",
                subject: "Password Reset Initiated",
                recipients: item,
                data: message.data
            }

            this.#mailer.sendMail(info, (response) => {
                callback(response);
            })

        })


    }

    sendCompletePasswordReset = async (message, callback) => {

       
        message.recipients.forEach(async (item) => {

            let info = {
                sender: "noreply@classoptima.bakare.tech",
                templateFile: "complete-password-reset.ejs",
                subject: "Password Reset Completed",
                recipients: item,
                data: message.data
            }

            this.#mailer.sendMail(info, (response) => {
                callback(response);
            })

        })


    }

    sendProfileUpdate = async (message, callback) => {

       
        message.recipients.forEach(async (item) => {

            let info = {
                sender: "noreply@classoptima.bakare.tech",
                templateFile: "profile-updated.ejs",
                subject: "Your Account Profile has been Updated",
                recipients: item,
                data: message.data
            }

            this.#mailer.sendMail(info, (response) => {
                callback(response);
            })

        })


    }

    sendAccountDelete = async (message, callback) => {

       
        message.recipients.forEach(async (item) => {

            let info = {
                sender: "noreply@classoptima.bakare.tech",
                templateFile: "account-deletion.ejs",
                subject: "Confirmation: ClassOptima Account Deletion Request Received",
                recipients: item,
                data: message.data
            }

            this.#mailer.sendMail(info, (response) => {
                callback(response);
            })

        })


    }

    sendAdministratoradding = async (message, callback) => {

       
        message.recipients.forEach(async (item) => {

            let info = {
                sender: "noreply@classoptima.bakare.tech",
                templateFile: "add-administrator.ejs",
                subject: "Congratulations on Your New Administrative Role in ClassOptima!",
                recipients: item,
                data: message.data
            }

            this.#mailer.sendMail(info, (response) => {
                callback(response);
            })

        })


    }

    sendInstitutionRegistration = async (message, callback) => {

       
        message.recipients.forEach(async (item) => {

            let info = {
                sender: "noreply@classoptima.bakare.tech",
                templateFile: "institution-reg.ejs",
                subject: "Welcome to ClassOptima - Streamline Your School's Timetable Management!",
                recipients: item,
                data: message.data
            }

            this.#mailer.sendMail(info, (response) => {
                callback(response);
            })

        })


    }

    sendInstitutionApproval = async (message, callback) => {

       
        message.recipients.forEach(async (item) => {

            let info = {
                sender: "noreply@classoptima.bakare.tech",
                templateFile: "institution-approval.ejs",
                subject: "ClassOptima Institution Account is Approved - Sign in Now!",
                recipients: item,
                data: message.data
            }

            this.#mailer.sendMail(info, (response) => {
                callback(response);
            })

        })


    }

    sendInstitutionDisApproval = async (message, callback) => {

       
        message.recipients.forEach(async (item) => {

            let info = {
                sender: "noreply@classoptima.bakare.tech",
                templateFile: "institution-disapproval.ejs",
                subject: "ClassOptima Registration Update",
                recipients: item,
                data: message.data
            }

            this.#mailer.sendMail(info, (response) => {
                callback(response);
            })

        })


    }

    sendStaffInvitations = async (message, callback) => {

       
        message.recipients.forEach(async (item) => {

            let info = {
                sender: "noreply@classoptima.bakare.tech",
                templateFile: "invite-staff.ejs",
                subject: "Invitation to ClassOptima - Activate Your Staff Account Now!",
                recipients: item,
                data: message.data
            }

            this.#mailer.sendMail(info, (response) => {
                callback(response);
            })

        })


    }

    sendStudentInvitations = async (message, callback) => {

       
        message.recipients.forEach(async (item) => {

            let info = {
                sender: "noreply@classoptima.bakare.tech",
                templateFile: "invite-student.ejs",
                subject: "Welcome to ClassOptima - Activate Your Student Account Now!",
                recipients: item,
                data: message.data
            }

            this.#mailer.sendMail(info, (response) => {
                callback(response);
            })

        })


    }

}

module.exports = NotificationService;