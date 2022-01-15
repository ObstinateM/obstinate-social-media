require('dotenv').config();
const mysql = require('mysql');

const option = {
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: 'test',
    port: process.env.SQL_PORT
};

if (!process.env.PRODUCTION) {
    option.socket = '/Applications/MAMP/tmp/mysql/mysql.sock';
}

const database = mysql.createConnection(option);

const request = [
    'CREATE TABLE IF NOT EXISTS `comments` ( `id` int(11) NOT NULL AUTO_INCREMENT, `user_id` int(11) DEFAULT NULL, `post_id` int(11) DEFAULT NULL, `content` text, PRIMARY KEY (`id`), KEY `user_id` (`user_id`), KEY `post_id` (`post_id`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8;',
    'CREATE TABLE IF NOT EXISTS `follow` ( `id` int(11) NOT NULL AUTO_INCREMENT, `follower` int(11) DEFAULT NULL, `following` int(11) DEFAULT NULL, PRIMARY KEY (`id`), KEY `follower` (`follower`), KEY `following` (`following`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8;',
    'CREATE TABLE IF NOT EXISTS `messages` ( `id` int(11) NOT NULL AUTO_INCREMENT, `room_id` int(11) DEFAULT NULL, `user_id` int(11) DEFAULT NULL, `content` text, `timestamp` varchar(255) NOT NULL, PRIMARY KEY (`id`), KEY `room_id` (`room_id`), KEY `user_id` (`user_id`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8;',
    'CREATE TABLE IF NOT EXISTS `posts` ( `id` int(11) NOT NULL AUTO_INCREMENT, `id_user` int(11) DEFAULT NULL, `content` text, `image` text, PRIMARY KEY (`id`), KEY `id_user` (`id_user`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8;',
    'CREATE TABLE IF NOT EXISTS `post_like` ( `id` int(11) NOT NULL AUTO_INCREMENT, `post_id` int(11) DEFAULT NULL, `user_id` int(11) DEFAULT NULL, PRIMARY KEY (`id`), KEY `post_id` (`post_id`), KEY `user_id` (`user_id`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8;',
    'CREATE TABLE IF NOT EXISTS `refreshToken` ( `id` int(11) NOT NULL AUTO_INCREMENT, `refreshToken` text, PRIMARY KEY (`id`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8;',
    'CREATE TABLE IF NOT EXISTS `rooms` ( `id` int(11) NOT NULL AUTO_INCREMENT, `name` varchar(1000) NOT NULL, PRIMARY KEY (`id`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8;',
    'CREATE TABLE IF NOT EXISTS `room_user` ( `id` int(11) NOT NULL AUTO_INCREMENT, `room_id` int(11) DEFAULT NULL, `user_id` int(11) DEFAULT NULL, PRIMARY KEY (`id`), KEY `room_id` (`room_id`), KEY `user_id` (`user_id`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8;',
    'CREATE TABLE IF NOT EXISTS `users` ( `id` int(11) NOT NULL AUTO_INCREMENT, `name` varchar(25) NOT NULL, `email` varchar(50) NOT NULL, `password` varchar(255) NOT NULL, `avatar` varchar(100) DEFAULT NULL, `bio` varchar(255) DEFAULT NULL, PRIMARY KEY (`id`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8;',
    'ALTER TABLE `comments` ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`), ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`);',
    'ALTER TABLE `follow` ADD CONSTRAINT `follow_ibfk_1` FOREIGN KEY (`follower`) REFERENCES `users` (`id`), ADD CONSTRAINT `follow_ibfk_2` FOREIGN KEY (`following`) REFERENCES `users` (`id`);',
    'ALTER TABLE `messages` ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`), ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);',
    'ALTER TABLE `posts` ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`);',
    'ALTER TABLE `post_like` ADD CONSTRAINT `post_like_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`), ADD CONSTRAINT `post_like_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);',
    'ALTER TABLE `room_user` ADD CONSTRAINT `room_user_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`), ADD CONSTRAINT `room_user_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);'
];

request.forEach(element =>
    database.query(element, error => {
        error ? console.log(error) : console.log(`Request successfull ${element.slice(0, 45)}`);
    })
);

database.end();
