
import RequestInfo from "../models/requestinfo.js";

const createRequest = async (req, res) => {
    try {

        const { requestInfo } = req.body;
        console.log("Hello")
        if (!requestInfo) {
            return res.status(400).json({ message: "Missing data" });
        }
        console.log(requestInfo)
        const request = new RequestInfo({ ...requestInfo, requester: req.user._id })
        await request.save();

        res.status(201).json({ message: "Blood request created successfully." })
    }
    catch (err) {
        console.error("Error creating blood request:", err);
        res.status(500).json({ message: "Server error while creating request." });
    }

};


const currentRequest = async (req, res) => {
    const request = await RequestInfo.findOne({
        requester: req.user._id,
        status: 'pending'
    })
    console.log("Found request:", request);
    res.json(request || null);
}

export { currentRequest,createRequest };