const Notification = ({ notif, errorMsg }) => {
    if (notif === null && errorMsg === null) {
        return null
    }
    else if (notif !== null) {
        return (
            <div className="notification">
                {notif}
            </div>
        )
    }
    else {

        return (
            <div className="error">
                {errorMsg}
            </div>
        )
    }
}

export default Notification