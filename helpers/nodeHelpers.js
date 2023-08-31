
function checkValidWriteInput(node, voltage, upperLim, lowerLim) {
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