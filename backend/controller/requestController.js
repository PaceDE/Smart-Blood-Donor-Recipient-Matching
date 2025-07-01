
import RequestInfo from "../models/requestinfo.js";


const currentRequest = async (req,res) =>{
    const request = await RequestInfo.findOne({
        requester:req.user._id,
        status:'pending'
    })
    res.json(request || null);
}

export {currentRequest};