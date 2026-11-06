function getPage(page) {
    if (page == null) {
        return 1;
    } else if (Number(page) > 0 && Number.isInteger(Number(page))) {
        return Number(page)
    } 

    return null;
}


module.exports = {getPage}