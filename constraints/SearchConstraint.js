

let instance;


class SearchConstraint {

    constructor() {

        if (instance) return instance;


        instance = this;

    }

    search = () => {
        return {
            key: {
                presence: true,
                length: {
                    minimum: 1
                }
            },
            service: {
                presence: true,
                length: {
                    minimum: 4
                }
            }
        }
    }
}

module.exports = SearchConstraint