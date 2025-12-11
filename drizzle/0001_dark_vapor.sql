CREATE TABLE `fraudPredictions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`modelName` varchar(64) NOT NULL,
	`prediction` enum('fraud','legitimate') NOT NULL,
	`confidence` int NOT NULL,
	`features` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `fraudPredictions_id` PRIMARY KEY(`id`)
);
