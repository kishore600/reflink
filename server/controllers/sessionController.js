// controllers/sessionController.js
import Session from "../models/Session.js";
import ConsultingOffer from "../models/ConsultingOffer.js";
import User from "../models/User.js";

// @desc    Book a consulting session
// @route   POST /api/sessions
// @access  Private
const bookSession = async (req, res) => {
  try {
    const { consultingOfferId, scheduledAt, notes } = req.body;
    const consultingOffer = await ConsultingOffer.findById(consultingOfferId);
    if (!consultingOffer) {
      return res.status(404).json({
        message: "Consulting offer not found",
      });
    }

    // Check if the employee is trying to book their own offer
    if (consultingOffer.createdBy.toString() === req.user.id) {
      return res.status(400).json({
        message: "Cannot book your own consulting offer",
      });
    }

    // Check if user has already booked this offer
    if (consultingOffer.bookedUsers?.includes(req.user.id)) {
      return res.status(400).json({
        message: "You have already booked this session",
      });
    }

    const session = await Session.create({
      consultingOffer: consultingOfferId,
      jobSeeker: consultingOffer.createdBy,
      employee: req.user.id,
      scheduledAt,
      duration: consultingOffer.duration,
      notes,
    });
console.log(consultingOffer)
    // Add user to bookedUsers array
    consultingOffer.bookedUsers?.push(req.user.id);
    await consultingOffer.save();

    // Update user's available slots
    await User.findByIdAndUpdate(consultingOffer.createdBy, {
      $inc: { availableSlots: -1 },
    });

    await session.populate("consultingOffer jobSeeker employee");

    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
// @desc    Get user's sessions
// @route   GET /api/sessions
// @access  Private
const getUserSessions = async (req, res) => {
  try {
    const { type = "all" } = req.query;
    let query = {};

    if (type === "as-jobseeker") {
      query.jobSeeker = req.user.id;
    } else if (type === "as-employee") {
      query.employee = req.user.id;
    } else {
      query = {
        $or: [{ jobSeeker: req.user.id }, { employee: req.user.id }],
      };
    }

    const sessions = await Session.find(query)
      .populate("consultingOffer")
      .populate("jobSeeker", "name username title")
      .populate("employee", "name username title")
      .sort({ scheduledAt: -1 });

    res.json(sessions);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// @desc    Update session status
// @route   PUT /api/sessions/:id/status
// @access  Private
const updateSessionStatus = async (req, res) => {
  try {
    const { status, meetingLink, notes } = req.body;

    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    // Check if user is part of this session
    if (
      session.jobSeeker.toString() !== req.user.id &&
      session.employee.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "Not authorized to update this session",
      });
    }

    session.status = status;
    if (meetingLink) session.meetingLink = meetingLink;
    if (notes) session.notes = notes;

    if (status === "completed") {
      // Increment completed sessions for job seeker
      await User.findByIdAndUpdate(session.jobSeeker, {
        $inc: { completedSessions: 1 },
      });
    }

    await session.save();
    await session.populate("consultingOffer jobSeeker employee");

    res.json(session);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const cancelSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    // Check if user is part of this session
    if (
      session.jobSeeker.toString() !== req.user.id &&
      session.employee.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "Not authorized to cancel this session",
      });
    }

    // Check if session can be cancelled (only scheduled sessions can be cancelled)
    if (session.status !== "scheduled") {
      return res.status(400).json({
        message: "Only scheduled sessions can be cancelled",
      });
    }

    // Remove user from bookedUsers array in consulting offer
    await ConsultingOffer.findByIdAndUpdate(session.consultingOffer, {
      $pull: { bookedUsers: session.employee },
    });

    // Restore available slot for job seeker
    await User.findByIdAndUpdate(session.jobSeeker, {
      $inc: { availableSlots: 1 },
    });

    // Update session status
    session.status = "cancelled";
    await session.save();

    await session.populate("consultingOffer jobSeeker employee");

    res.json({
      message: "Session cancelled successfully",
      session,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export { bookSession, getUserSessions, updateSessionStatus, cancelSession };
