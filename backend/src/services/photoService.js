import { query } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export const photoService = {
  async uploadPhoto(uploaderId, url, caption, tags, photoDate) {
    try {
      const photoId = uuidv4();
      const result = await query(
        `INSERT INTO photos 
         (id, uploader_id, url, caption, tags, photo_date, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
         RETURNING *`,
        [photoId, uploaderId, url, caption, tags, photoDate]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getPhotos(limit = 50, offset = 0) {
    try {
      const result = await query(
        `SELECT * FROM photos WHERE deleted_at IS NULL
         ORDER BY photo_date DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  async toggleFavorite(photoId) {
    try {
      const result = await query(
        `UPDATE photos SET is_favorite = NOT is_favorite WHERE id = $1 RETURNING *`,
        [photoId]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async createAlbum(creatorId, title, description) {
    try {
      const albumId = uuidv4();
      const result = await query(
        `INSERT INTO albums (id, created_by_id, title, description, created_at)
         VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
         RETURNING *`,
        [albumId, creatorId, title, description]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getAlbums() {
    try {
      const result = await query('SELECT * FROM albums ORDER BY created_at DESC');
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  async addPhotoToAlbum(photoId, albumId) {
    try {
      await query('UPDATE photos SET album_id = $1 WHERE id = $2', [albumId, photoId]);
    } catch (error) {
      throw error;
    }
  }
};
