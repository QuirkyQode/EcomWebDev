// HOF syntax fn is input for the second function  
// Function approach
// handler to make any regular function be handled asynchronously and centralize error handling
// const asyncHandler = () => {};
// const asyncHandler = (func) => {};
// const asyncHandler = (func) => () => {};
// const asyncHandler = (func) => async () => {};
const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        console.log(error)
        res.status(error.code || 500 ). json({
            success:false,
            message: error.message,
        })
    }
}


export default asyncHandler;