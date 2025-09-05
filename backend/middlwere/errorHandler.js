

const errorHandler = (err,req,res,next)=>{
    // console.log("==== ERROR STACK TRACE ====");
  console.log(err.stack);
      const message = err.message 
      const statusCode = err.statusCode || 500

    res.status(statusCode).json({
        message: message,
        statusCode: statusCode
    })

}

module.exports = errorHandler


