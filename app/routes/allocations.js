const AllocationsDAO = require("../data/allocations-dao").AllocationsDAO;
const {
    environmentalScripts
} = require("../../config/config");

function AllocationsHandler(db) {
    "use strict";

    const allocationsDAO = new AllocationsDAO(db);

    /**
     * Collect the lookup arguments the allocations view needs from the request.
     */
    const readLookupArgs = (req) => ({
        userId: req.params.userId,
        threshold: req.query.threshold
    });

    this.displayAllocations = (req, res, next) => {
        const {
            userId,
            threshold
        } = readLookupArgs(req);

        allocationsDAO.getByUserIdAndThreshold(userId, threshold, (err, allocations) => {
            if (err) return next(err);

            return res.render("allocations", {
                userId,
                allocations,
                environmentalScripts
            });
        });
    };
}

module.exports = AllocationsHandler;
