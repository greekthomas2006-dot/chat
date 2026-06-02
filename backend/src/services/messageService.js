import { query } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export const messageService = {
  async sendMessage(senderId, recipientId, text, mediaType, mediaUrl) {
    try {
      const messageId = uuidv4();
      
      const result = await query(
        `INSERT INTO messages 
         (id, sender_id, recipient_id, text, media_type, media_url, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
         RETURNING id, sender_id, recipient_id, text, created_at, media_type, media_url`,
        [messageId, senderId, recipientId, text, mediaType, mediaUrl]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getMessages(userId, limit = 50, offset = 0) {
    try {
      const result = await query(
        `SELECT m.*, u.username, u.avatar_url
         FROM messages m
         JOIN users u ON m.sender_id = u.id
         WHERE (m.sender_id = $1 OR m.recipient_id = $1) AND m.deleted_at IS NULL
         ORDER BY m.created_at DESC
         LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      );

      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  async searchMessages(userId, searchText) {
    try {
      const result = await query(
        `SELECT m.*, u.username, u.avatar_url
         FROM messages m
         JOIN users u ON m.sender_id = u.id
         WHERE (m.sender_id = $1 OR m.recipient_id = $1) 
         AND m.text ILIKE $2 
         AND m.deleted_at IS NULL
         ORDER BY m.created_at DESC
         LIMIT 100`,
        [userId, `%${searchText}%`]
      );

      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  async editMessage(messageId, newText, userId) {
    try {
      const result = await query(
        `UPDATE messages 
         SET text = $2, edited_at = CURRENT_TIMESTAMP
         WHERE id = $1 AND sender_id = $3
         RETURNING *`,
        [messageId, newText, userId]
      );

      if (result.rows.length === 0) {
        throw new Error('Message not found or unauthorized');
      }

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async deleteMessage(messageId, userId) {
    try {
      const result = await query(
        `UPDATE messages 
         SET deleted_at = CURRENT_TIMESTAMP
         WHERE id = $1 AND sender_id = $2
         RETURNING *`,
        [messageId, userId]
      );

      if (result.rows.length === 0) {
        throw new Error('Message not found or unauthorized');
      }

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async markAsRead(messageId, userId) {
    try {
      await query(
        `UPDATE messages 
         SET read_at = CURRENT_TIMESTAMP
         WHERE id = $1 AND recipient_id = $2`,
        [messageId, userId]
      );
    } catch (error) {
      throw error;
    }
  },

  async addReaction(messageId, userId, emoji) {
    try {
      const result = await query(
        `INSERT INTO reactions (id, message_id, user_id, emoji, created_at)
         VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
         ON CONFLICT (message_id, user_id, emoji) DO NOTHING
         RETURNING *`,
        [uuidv4(), messageId, userId, emoji]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async removeReaction(messageId, userId, emoji) {
    try {
      await query(
        'DELETE FROM reactions WHERE message_id = $1 AND user_id = $2 AND emoji = $3',
        [messageId, userId, emoji]
      );
    } catch (error) {
      throw error;
    }
  },

  async pinMessage(messageId, userId) {
    try {
      const result = await query(
        `UPDATE messages 
         SET is_pinned = true
         WHERE id = $1 AND (sender_id = $2 OR recipient_id = $2)
         RETURNING *`,
        [messageId, userId]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async unpinMessage(messageId, userId) {
    try {
      const result = await query(
        `UPDATE messages 
         SET is_pinned = false
         WHERE id = $1 AND (sender_id = $2 OR recipient_id = $2)
         RETURNING *`,
        [messageId, userId]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getPinnedMessages(userId) {
    try {
      const result = await query(
        `SELECT m.*, u.username, u.avatar_url
         FROM messages m
         JOIN users u ON m.sender_id = u.id
         WHERE (m.sender_id = $1 OR m.recipient_id = $1) 
         AND m.is_pinned = true
         AND m.deleted_at IS NULL
         ORDER BY m.created_at DESC`,
        [userId]
      );

      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  async replyToMessage(senderId, recipientId, text, replyToId) {
    try {
      const messageId = uuidv4();
      
      const result = await query(
        `INSERT INTO messages 
         (id, sender_id, recipient_id, text, reply_to_id, created_at)
         VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
         RETURNING *`,
        [messageId, senderId, recipientId, text, replyToId]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
};
