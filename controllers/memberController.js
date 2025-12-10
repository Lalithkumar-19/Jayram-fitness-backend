const Member = require('../models/Member');
const { differenceInDays, parseISO } = require('date-fns');

// @desc    Get all members (with pagination & search)
// @route   GET /api/members
// @access  Private
const getMembers = async (req, res) => {
    try {
        const { search, page = 1, limit = 15 } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { surname: { $regex: search, $options: 'i' } },
                // MongoDB _id search requires ObjectId casting, usually simple regex on string fields is enough for basic search
            ];
        }

        const count = await Member.countDocuments(query);
        const members = await Member.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        res.json({
            members,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            totalMembers: count
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get expiring members
// @route   GET /api/members/expiring
// @access  Private
const getExpiringMembers = async (req, res) => {
    try {
        // Fetch all active members and filter in JS (simpler for date logic with string dates)
        // ideally convert dates to Date objects in DB for better querying
        const members = await Member.find({ status: 'active' });

        const expiringMembers = members.filter(m => {
            if (!m.endDate) return false;
            // Assuming endDate is YYYY-MM-DD string
            const daysJust = differenceInDays(new Date(m.endDate), new Date()); // date-fns 2.x/3.x might need parseISO if string
            // Actually let's use standard JS Date for safety if string format matches
            const days = differenceInDays(new Date(m.endDate), new Date());
            return days <= 5 && days >= 0;
        });

        res.json(expiringMembers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a member
// @route   POST /api/members
// @access  Private
const addMember = async (req, res) => {
    try {
        const member = await Member.create(req.body);
        res.status(201).json(member);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a member
// @route   PUT /api/members/:id
// @access  Private
const updateMember = async (req, res) => {
    try {
        const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (member) {
            res.json(member);
        } else {
            res.status(404).json({ message: 'Member not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a member
// @route   DELETE /api/members/:id
// @access  Private
const deleteMember = async (req, res) => {
    try {
        const member = await Member.findByIdAndDelete(req.params.id);
        if (member) {
            res.json({ message: 'Member removed' });
        } else {
            res.status(404).json({ message: 'Member not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getMembers, getExpiringMembers, addMember, updateMember, deleteMember };
