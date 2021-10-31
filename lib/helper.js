var helper = {};



helper.formatObject = (oldObject = {}, newObject ={}) => {
    let tempObj  = {}
    Object.keys(newObject).map(key => {
        if(oldObject.hasOwnProperty(key)){
            tempObj[key] = newObject[key];
        }
    })
    return {...oldObject, ...tempObj};
}



module.exports = helper;