const db = require('../models');
const User = db.users;

exports.updateAvatar = async (req, res) => {
  try {
    const userId = req.userId;
    const { avatar } = req.body;
    if (!avatar) return res.status(400).json({ message: 'avatar is required' });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.avatar = avatar;
    await user.save();

    // Return updated public user info (without password)
    return res.json({ id: user.id, username: user.username, email: user.email, avatar: user.avatar });
  } catch (err) {
    console.error('Error updating avatar:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ id: user.id, username: user.username, email: user.email, avatar: user.avatar });
  } catch (err) {
    console.error('Error fetching profile:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
