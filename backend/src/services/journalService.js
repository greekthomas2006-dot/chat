import { query } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export const journalService = {
  async createEntry(userId, title, content, tags, mood) {
    try {
      const entryId = uuidv4();
      const result = await query(
        `INSERT INTO journal_entries 
         (id, user_id, title, content, tags, mood, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         RETURNING *`,
        [entryId, userId, title, content, tags, mood]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getEntries(userId, limit = 20, offset = 0) {
    try {
      const result = await query(
        `SELECT * FROM journal_entries 
         WHERE user_id = $1 AND deleted_at IS NULL
         ORDER BY created_at DESC
         LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  async getEntry(entryId, userId) {
    try {
      const result = await query(
        `SELECT * FROM journal_entries 
         WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
        [entryId, userId]
      );
      if (result.rows.length === 0) throw new Error('Entry not found');
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async updateEntry(entryId, userId, updates) {
    try {
      const { title, content, tags, mood } = updates;
      const result = await query(
        `UPDATE journal_entries 
         SET title = COALESCE($3, title),
             content = COALESCE($4, content),
             tags = COALESCE($5, tags),
             mood = COALESCE($6, mood),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $1 AND user_id = $2
         RETURNING *`,
        [entryId, userId, title, content, tags, mood]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async deleteEntry(entryId, userId) {
    try {
      await query(
        `UPDATE journal_entries SET deleted_at = CURRENT_TIMESTAMP
         WHERE id = $1 AND user_id = $2`,
        [entryId, userId]
      );
    } catch (error) {
      throw error;
    }
  },

  async toggleFavorite(entryId, userId) {
    try {
      const result = await query(
        `UPDATE journal_entries 
         SET is_favorite = NOT is_favorite
         WHERE id = $1 AND user_id = $2
         RETURNING *`,
        [entryId, userId]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async addComment(entryId, userId, commentText) {
    try {
      const commentId = uuidv4();
      const result = await query(
        `INSERT INTO journal_comments 
         (id, journal_entry_id, user_id, comment_text, created_at)
         VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
         RETURNING *`,
        [commentId, entryId, userId, commentText]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getComments(entryId) {
    try {
      const result = await query(
        `SELECT jc.*, u.username, u.avatar_url
         FROM journal_comments jc
         JOIN users u ON jc.user_id = u.id
         WHERE jc.journal_entry_id = $1 AND jc.deleted_at IS NULL
         ORDER BY jc.created_at ASC`,
        [entryId]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  async searchEntries(userId, searchText) {
    try {
      const result = await query(
        `SELECT * FROM journal_entries 
         WHERE user_id = $1 
         AND (title ILIKE $2 OR content ILIKE $2)
         AND deleted_at IS NULL
         ORDER BY created_at DESC`,
        [userId, `%${searchText}%`]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
};
