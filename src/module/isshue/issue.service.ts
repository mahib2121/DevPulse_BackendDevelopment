import pool from "../../db/database";

export const createIssue = async (
  title: string,
  description: string,
  type: string,
  reporterId: number,
) => {
  const result = await pool.query(
    `
    INSERT INTO issues
    (
      title,
      description,
      type,
      reporter_id
    )
    VALUES
    (
      $1,
      $2,
      $3,
      $4
    )
    RETURNING *
    `,
    [title, description, type, reporterId],
  );

  return result.rows[0];
};

export const getAllIssues = async () => {
  const result = await pool.query(`
    SELECT *
    FROM issues
    ORDER BY created_at DESC
  `);

  return result.rows;
};
export const getIssueById = async (id: number) => {
  const result = await pool.query(
    `
    SELECT *
    FROM issues
    WHERE id = $1
    `,
    [id],
  );

  return result.rows[0];
};

export const updateIssue = async (
  id: number,
  fields: { title?: string; description?: string; type?: string },
) => {
  const keys = Object.keys(fields);
  const values = Object.values(fields);

  if (keys.length === 0) {
    return await getIssueById(id);
  }

  const setClause = keys
    .map((key, index) => `${key} = $${index + 1}`)
    .join(", ");

  const query = `
    UPDATE issues
    SET ${setClause}, updated_at = CURRENT_TIMESTAMP
    WHERE id = $${keys.length + 1}
    RETURNING *
  `;

  const result = await pool.query(query, [...values, id]);

  return result.rows[0];
};

export const deleteIssue = async (id: number) => {
  const result = await pool.query(
    `
    DELETE FROM issues
    WHERE id = $1
    RETURNING *
    `,
    [id],
  );

  return result.rows[0];
};
