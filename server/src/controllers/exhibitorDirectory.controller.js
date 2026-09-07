import exhibitorProfileModel from "../models/exhibitorProfile.model.js";

export const getDirectory = async (req, res) => {
  try {
    const { companyName, industry } = req.query;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const query = { approvalStatus: "approved" };

    if (companyName) {
      query.companyName = { $regex: companyName, $options: "i" };
    }
    
    if (industry) {
      query.industry = { $regex: industry, $options: "i" };
    }

    const total = await exhibitorProfileModel.countDocuments(query);
    const exhibitors = await exhibitorProfileModel.find(query)
      .select("-__v -createdAt -updatedAt")
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      status: "Ok",
      data: { exhibitors, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }
    });
  } catch (error) {
    console.error("Get Directory Error:", error);
    return res.status(500).json({ status: "Fail", message: "An unexpected error occurred" });
  }
};

