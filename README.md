# Obstinate Social Media

Highlight :

```sql
SELECT posts.*,
    users.name as author,
    users.avatar as avatar,
    (SELECT COUNT(*) FROM post_like WHERE post_id = posts.id) AS nbLikes,
    (SELECT COUNT(*) FROM post_like WHERE post_id = posts.id AND user_id = ?) as isLiked
FROM posts
JOIN users
ON users.id = posts.id_user WHERE posts.id = ?
UNION
SELECT commentsBis.*
FROM (
    SELECT comments.*,
        users.name as author,
        users.avatar as avatar,
        0 AS nbLikes,
        0 AS isLiked
    FROM comments
    JOIN users
    ON users.id = comments.user_id WHERE comments.post_id = ?
    ORDER BY comments.id DESC
) as commentsBis
```
