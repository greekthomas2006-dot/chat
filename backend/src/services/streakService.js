import { query } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export const streakService = {
  async updateStreak() {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayDate = yesterday.toISOString().split('T')[0];

      const yesterdayMessages = await query(
        `SELECT DISTINCT sender_id FROM messages 
         WHERE DATE(created_at) = $1 AND deleted_at IS NULL`,
        [yesterdayDate]
      );

      if (yesterdayMessages.rows.length === 2) {
        const streakResult = await query(
          `UPDATE streaks 
           SET current_count = current_count + 1,
               last_message_date = CURRENT_DATE,
               longest_count = CASE 
                 WHEN current_count + 1 > longest_count THEN current_count + 1
                 ELSE longest_count
               END,
               updated_at = CURRENT_TIMESTAMP
           RETURNING *`
        );
        return streakResult.rows[0];
      } else {
        await query(
          `UPDATE streaks SET current_count = 0, updated_at = CURRENT_TIMESTAMP`
        );
      }
    } catch (error) {
      throw error;
    }
  },

  async getStreakData() {
    try {
      const result = await query('SELECT * FROM streaks LIMIT 1');
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  },

  async recordMilestone(milestoneDay) {
    try {
      const milestoneId = uuidv4();
      await query(
        `INSERT INTO streak_milestones (id, streak_id, milestone_days, achieved_at)
         SELECT $1, id, $2, CURRENT_TIMESTAMP FROM streaks LIMIT 1`,
        [milestoneId, milestoneDay]
      );
    } catch (error) {
      throw error;
    }
  }
};
