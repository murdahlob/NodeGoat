/* The ProfileDAO must be constructed with a connected database object */
function ProfileDAO(db) {

    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof ProfileDAO)) {
        console.log("Warning: ProfileDAO constructor called without 'new' operator");
        return new ProfileDAO(db);
    }

    const users = db.collection("users");

    const PROFILE_FIELDS = [
        "firstName",
        "lastName",
        "address",
        "bankAcc",
        "bankRouting",
        "ssn",
        "dob"
    ];

    /**
     * Copy the submitted profile values into an update document. Fields the
     * form left empty are skipped so they are not overwritten with blanks.
     */
    const buildUpdateDocument = (submitted) => {
        const user = {};

        PROFILE_FIELDS.forEach((field) => {
            if (submitted[field]) {
                user[field] = submitted[field];
            }
        });

        return user;
    };

    this.updateUser = (userId, firstName, lastName, ssn, dob, address, bankAcc, bankRouting, callback) => {

        const user = buildUpdateDocument({
            firstName,
            lastName,
            address,
            bankAcc,
            bankRouting,
            ssn,
            dob
        });

        users.update({
                _id: parseInt(userId)
            }, {
                $set: user
            },
            (err) => {
                if (err) return callback(err, null);

                console.log("Updated user profile");
                return callback(null, user);
            }
        );
    };

    this.getByUserId = (userId, callback) => {
        users.findOne({
                _id: parseInt(userId)
            },
            (err, user) => err ? callback(err, null) : callback(null, user)
        );
    };
}

module.exports = { ProfileDAO };
