import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export const authService = {
  async register(email, password, username) {
    try {
      // Check if user exists
      const existingUser = await query(
        'SELECT id FROM users WHERE email = $1 OR username = $2',
        [email, username]
      );

      if (existingUser.rows.length > 0) {
        throw new Error('User already exists');
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS));

      // Create user
      const result = await query(
        `INSERT INTO users (id, email, password_hash, username)
         VALUES ($1, $2, $3, $4)
         RETURNING id, email, username, avatar_url, bio`,
        [uuidv4(), email, passwordHash, username]
      );

      const user = result.rows[0];

      // Generate token
      const token = jwt.sign(
        { id: user.id, email: user.email, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      return { user, token };
    } catch (error) {
      throw error;
    }
  },

  async login(email, password) {
    try {
      const result = await query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      const user = result.rows[0];

      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.password_hash);

      if (!passwordMatch) {
        throw new Error('Invalid password');
      }

      // Generate token
      const token = jwt.sign(
        { id: user.id, email: user.email, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      // Update last seen
      await query(
        'UPDATE users SET last_seen_at = CURRENT_TIMESTAMP WHERE id = $1',
        [user.id]
      );

      return {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          avatar_url: user.avatar_url,
          bio: user.bio
        },
        token
      };
    } catch (error) {
      throw error;
    }
  },

  async getProfile(userId) {
    try {
      const result = await query(
        `SELECT id, email, username, avatar_url, bio, theme_preference, created_at
         FROM users WHERE id = $1`,
        [userId]
      );

      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async updateProfile(userId, updates) {
    try {
      const { username, bio, avatar_url, theme_preference } = updates;

      const result = await query(
        `UPDATE users 
         SET username = COALESCE($2, username),
             bio = COALESCE($3, bio),
             avatar_url = COALESCE($4, avatar_url),
             theme_preference = COALESCE($5, theme_preference),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING id, email, username, avatar_url, bio, theme_preference`,
        [userId, username, bio, avatar_url, theme_preference]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async updateLastSeen(userId) {
    try {
      await query(
        'UPDATE users SET last_seen_at = CURRENT_TIMESTAMP, online_status = $2 WHERE id = $1',
        [userId, 'online']
      );
    } catch (error) {
      throw error;
    }
  },

  async setOffline(userId) {
    try {
      await query(
        'UPDATE users SET online_status = $2 WHERE id = $1',
        [userId, 'offline']
      );
    } catch (error) {
      throw error;
    }
  }
};
