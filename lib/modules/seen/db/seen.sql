CREATE TABLE `seen_user` (
  `seen_user_id` int(11) NOT NULL AUTO_INCREMENT,
  `channel` varchar(255) NOT NULL,
  `nick` varchar(255) NOT NULL,
  `last_seen` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `action` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`seen_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

CREATE TABLE `seen_user_alias` (
  `channel` varchar(255) NOT NULL,
  `seen_user_id` int(11) NOT NULL,
  `alias_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`channel`, `seen_user_id`, `alias_id`),
  FOREIGN KEY (`seen_user_id`)
    REFERENCES `seen_user`(`seen_user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (`alias_id`)
    REFERENCES `seen_user`(`seen_user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
