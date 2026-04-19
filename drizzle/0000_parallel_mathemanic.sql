CREATE TABLE `price_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`route_id` integer NOT NULL,
	`price` real,
	`recorded_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`route_id`) REFERENCES `routes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_price_history_unique` ON `price_history` (`route_id`,`recorded_at`);--> statement-breakpoint
CREATE TABLE `proposals` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`origin` text NOT NULL,
	`destination` text NOT NULL,
	`departure_date` text,
	`return_date` text,
	`estimated_price` real,
	`currency` text DEFAULT 'USD' NOT NULL,
	`rationale` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`google_flights_url` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `routes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`origin` text NOT NULL,
	`destination` text NOT NULL,
	`price` real,
	`departure_date` text,
	`return_date` text,
	`airline` text,
	`flight_number` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_route_unique` ON `routes` (`origin`,`destination`,`departure_date`,`flight_number`);