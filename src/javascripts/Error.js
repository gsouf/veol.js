class VeolError extends Error {

    constructor (errorType, message) {
        super(message);
        this.errorType = errorType;
    }

}
VeolError.ERR_INVALID_DATA = 'invdata';


export default VeolError;
