const Member = require('../models/Member');

// @desc    Get Dashboard Stats
// @route   GET /api/dashboard/stats
// @access  Private
const getStats = async (req, res) => {
    try {
        const totalMembers = await Member.countDocuments();
        const activeMembers = await Member.countDocuments({ status: 'active' });

        // Calculate Revenue (Aggregation)
        const totalRevenueResult = await Member.aggregate([
            { $group: { _id: null, total: { $sum: "$paidAmount" } } }
        ]);
        const totalRevenue = totalRevenueResult[0] ? totalRevenueResult[0].total : 0;

        // Monthly Revenue (Mocking logic or complex aggregation needed based on JoinDate)
        // For simplicity, let's just send the raw counts and let frontend format graph, 
        // OR implements a simple aggregation if joinDate is consistent YYYY-MM-DD

        // Let's assume we want revenue by month for the current year
        // Since joinDate is string, this is tricky in Mongo directly without conversion.
        // We will send a basic "Monthly Growth" based on creation date which Mongoose handles automatically

        const monthlyRevenue = await Member.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    revenue: { $sum: "$paidAmount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Format for Recharts: [{name: 'Jan', revenue: 1000}, ...]
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const revenueData = monthlyRevenue.map(item => ({
            name: months[item._id - 1],
            revenue: item.revenue
        }));

        res.json({
            totalMembers,
            activeMembers,
            totalRevenue,
            revenueData
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getStats };
