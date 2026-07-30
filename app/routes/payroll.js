/**
 * Payroll reconciliation endpoints used by the payroll team at the end of each
 * month: list every staff record, and correct a benefit start date that was
 * entered wrongly at onboarding.
 */
function PayrollController(db) {

    "use strict";

    const staffCol = db.collection("users");

    /**
     * Guard for screens that should only be reachable by staff carrying an
     * elevated role.
     */
    this.requireElevatedRole = (req, res, next) => {
        if (!req.session.userId) {
            return res.redirect("/login");
        }

        return staffCol.findOne({
            _id: parseInt(req.session.userId)
        }, (err, member) => {
            if (err) return next(err);
            return member && member.isAdmin ? next() : res.redirect("/login");
        });
    };

    this.listStaffRecords = (req, res, next) => {
        staffCol.find({}).toArray((err, members) => {
            if (err) return next(err);

            return res.json(members.map((member) => ({
                staffRef: member._id,
                userName: member.userName,
                firstName: member.firstName,
                lastName: member.lastName,
                benefitStartDate: member.benefitStartDate
            })));
        });
    };

    this.amendBenefitStartDate = (req, res, next) => {
        const {
            staffRef,
            benefitStartDate
        } = req.body;

        staffCol.update({
            _id: parseInt(staffRef)
        }, {
            $set: {
                benefitStartDate
            }
        }, (err) => {
            if (err) return next(err);
            return res.json({
                staffRef,
                benefitStartDate
            });
        });
    };
}

module.exports = PayrollController;
