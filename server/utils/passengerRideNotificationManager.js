/*
 * passengerRideNotificationManager.js
 *
 * Manages passenger HTTP long-polling connections.
 *
 * A passenger sends one request and the server keeps
 * the connection open until the ride status changes
 * or the timeout is reached.
 */

const waitingPassengers = new Map();

/*
 * Add a passenger request to the waiting list.
 */
function addWaitingPassenger(
    passengerId,
    waiter
) {
    if (!waitingPassengers.has(passengerId)) {
        waitingPassengers.set(
            passengerId,
            []
        );
    }

    waitingPassengers
        .get(passengerId)
        .push(waiter);
}

/*
 * Remove a specific waiting request.
 */
function removeWaitingPassenger(
    passengerId,
    waiter
) {
    const waitingList =
        waitingPassengers.get(
            passengerId
        );

    if (!waitingList) {
        return;
    }

    const index =
        waitingList.indexOf(waiter);

    if (index !== -1) {
        waitingList.splice(
            index,
            1
        );
    }

    if (waitingList.length === 0) {
        waitingPassengers.delete(
            passengerId
        );
    }
}

/*
 * Notify the passenger that the ride
 * has been accepted.
 */
function notifyRideAccepted(
    passengerId,
    reqId,
    tripId
) {
    const waitingList =
        waitingPassengers.get(
            passengerId
        );

    if (!waitingList) {
        return false;
    }

    let notified = false;

    /*
     * Copy the array because successful
     * notifications remove entries from it.
     */
    for (
        const waiter of [...waitingList]
    ) {
        if (
            Number(waiter.reqId) !==
            Number(reqId)
        ) {
            continue;
        }

        clearTimeout(
            waiter.timeout
        );

        if (!waiter.res.writableEnded) {
            waiter.res.status(200).json({
                type: "ride_accepted",
                data: {
                    req_id: Number(reqId),
                    trip_id: Number(tripId)
                }
            });
        }

        removeWaitingPassenger(
            passengerId,
            waiter
        );

        notified = true;
    }

    return notified;
}

module.exports = {
    addWaitingPassenger,
    removeWaitingPassenger,
    notifyRideAccepted
};