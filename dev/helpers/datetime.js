'use strict'

function currentTime() {
    const date = new Date()
    return date.toLocaleTimeString()
}

function currentDate() {
    const date = new Date()
    return date.toDateString()
}

module.exports = {
    "print-current-time": currentTime,
    "print-current-date": currentDate
}