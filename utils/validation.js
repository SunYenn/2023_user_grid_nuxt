export function checkYN(data) {
    const validate = /^[NY]{1}$/

    if(!validate.test(data) || !data) {
        return false
    } else {
        return true
    }
}

export function require(data) {

    if(!data) {
        return false
    } else {
        return true
    }

}

export function checkCd(data) {
    const validate = /^[a-zA-Z0-9]{2}$/

    if(!validate.test(data) || !data) {
        return false
    } else {
        return true
    }
}