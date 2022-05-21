class FabricError extends Error{
    constructor(message){
        super(message);
        this.name = this.constructor.name;
        //this.stack = (new Error()).stack;
        Error.captureStackTrace(this, this.constructor);
    }

}

class EndorsementError extends Error{
    constructor(message){
        super(message);
        this.name = this.constructor.name;
        //this.stack = (new Error()).stack;
        Error.captureStackTrace(this, this.constructor);
    }

}

class ParameterError extends Error{
    constructor(message){
        super(message);
        this.name = this.constructor.name;
        //this.stack = (new Error()).stack;
        Error.captureStackTrace(this, this.constructor);
    }

}

module.exports = {
    FabricError: FabricError,
    EndorsementError: EndorsementError, 
    ParameterError:ParameterError
}