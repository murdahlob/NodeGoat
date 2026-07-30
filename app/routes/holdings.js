/**
 * Read-only JSON feed that backs the holdings widget on the dashboard. The
 * widget refreshes on a timer, so this deliberately returns a small payload
 * and does not render a view.
 */
function HoldingsController(db) {

    "use strict";

    const holdingsCol = db.collection("allocations");

    const loadHoldings = (accountRef, callback) => {
        holdingsCol.findOne({
            userId: parseInt(accountRef)
        }, callback);
    };

    this.fetchHoldings = (req, res, next) => {
        const {
            accountRef
        } = req.params;

        loadHoldings(accountRef, (err, record) => {
            if (err) return next(err);

            return res.json({
                accountRef,
                stocks: record ? record.stocks : 0,
                funds: record ? record.funds : 0,
                bonds: record ? record.bonds : 0
            });
        });
    };
}

module.exports = HoldingsController;
