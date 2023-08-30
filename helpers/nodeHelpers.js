
function checkValidWriteInput(voltage, node) {
    const upperLim = 10
    const lowerLim = 0
    if(typeof(voltage) === "number" && (voltage <= upperLim && voltage >= lowerLim) ){
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