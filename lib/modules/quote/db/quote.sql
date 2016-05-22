CREATE TABLE `quote` (
  `quote_id` int(11) NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `channel` varchar(128) NOT NULL,
  `created_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`quote_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
