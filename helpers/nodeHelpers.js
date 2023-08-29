
function checkValidWriteInput(voltage, node) {
    if(typeof(voltage) === "number" && (voltage <= 10 && voltage >= 0) ){
        return true 
    }
    else{
        node.status({fill:"red", shape:"ring", text:"please enter a valid number to write voltage"});
    }

    return false;
      
}

module.exports = {
    checkValidWriteInput
}