/* The UserDAO must be constructed with a connected database object */
function UserDAO(db) {

    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof UserDAO)) {
        console.log("Warning: UserDAO constructor called without 'new' operator");
        return new UserDAO(db);
    }

    const usersCol = db.collection("users");
    const countersCol = db.collection("counters");

    /**
     * Build the document persisted for a new signup. Optional fields are only
     * added when the form supplied them.
     */
    const buildUserDocument = (userName, firstName, lastName, password, email) => {
        const user = {
            userName,
            firstName,
            lastName,
            benefitStartDate: this.getRandomFutureDate(),
            password
        };

        if (email) {
            user.email = email;
        }

        return user;
    };

    const passwordsMatch = (storedPassword, suppliedPassword) => storedPassword === suppliedPassword;

    /**
     * Build an error the route layer can tell apart from a database error by
     * looking at the marker property.
     */
    const buildLoginError = (message, marker) => {
        const loginError = new Error(message);
        loginError[marker] = true;
        return loginError;
    };

    this.addUser = (userName, firstName, lastName, password, email, callback) => {
        const user = buildUserDocument(userName, firstName, lastName, password, email);

        this.getNextSequence("userId", (sequenceError, id) => {
            if (sequenceError) {
                return callback(sequenceError, null);
            }

            user._id = id;

            return usersCol.insert(user, (insertError, result) =>
                insertError ? callback(insertError, null) : callback(null, result.ops[0]));
        });
    };

    this.getRandomFutureDate = () => {
        const today = new Date();
        const day = (Math.floor(Math.random() * 10) + today.getDay()) % 29;
        const month = (Math.floor(Math.random() * 10) + today.getMonth()) % 12;
        const year = Math.ceil(Math.random() * 30) + today.getFullYear();
        return `${year}-${("0" + month).slice(-2)}-${("0" + day).slice(-2)}`;
    };

    this.validateLogin = (userName, password, callback) => {

        const onUserLoaded = (err, user) => {
            if (err) return callback(err, null);

            if (!user) {
                return callback(buildLoginError(`User: ${userName} does not exist`, "noSuchUser"), null);
            }

            if (!passwordsMatch(user.password, password)) {
                return callback(buildLoginError("Invalid password", "invalidPassword"), null);
            }

            return callback(null, user);
        };

        usersCol.findOne({
            userName
        }, onUserLoaded);
    };

    this.getUserById = (userId, callback) => {
        usersCol.findOne({
            _id: parseInt(userId)
        }, callback);
    };

    this.getUserByUserName = (userName, callback) => {
        usersCol.findOne({
            userName
        }, callback);
    };

    this.getNextSequence = (name, callback) => {
        countersCol.findAndModify({
                _id: name
            }, [], {
                $inc: {
                    seq: 1
                }
            }, {
                new: true
            },
            (err, data) => err ? callback(err, null) : callback(null, data.value.seq));
    };
}

module.exports = { UserDAO };
