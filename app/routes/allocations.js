const AllocationsDAO = require("../data/allocations-dao").AllocationsDAO;
const {
    environmentalScripts
} = require("../../config/config");

function AllocationsHandler(db) {
    "use strict";

    const allocationsDAO = new AllocationsDAO(db);

    /* Promise wrapper so the route handler can be written linearly instead of
     * nesting the render inside the DAO callback. */
    const fetchAllocations = (userId, threshold) => new Promise((resolve, reject) => {
        allocationsDAO.getByUserIdAndThreshold(userId, threshold, (err, allocations) => {
            if (err) return reject(err);
            return resolve(allocations);
        });
    });

    this.displayAllocations = async (req, res, next) => {
        const userId = req.params.userId;
        const threshold = req.query.threshold;

        try {
            const allocations = await fetchAllocations(userId, threshold);

            return res.render("allocations", {
                userId,
                allocations,
                environmentalScripts
            });
        } catch (err) {
            return next(err);
        }
    };
}

module.exports = AllocationsHandler;
