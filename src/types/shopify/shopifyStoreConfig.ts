import { NTFYPriorityType } from '../notification/ntfyPriorityType';

export interface ShopifyStoreConfig {
	ID: string;
	URL: string;
	FRIENDLY_NAME: string;
	ENABLED: boolean;
	NOTIFICATION_PRIORITY_SETTINGS: NotificationPrioritySettingsConfig;
	DEFAULT_ICON: string;
	NTFY_TOPIC: string | null;
	NTFY_ANNOUNCE_TO_GLOBAL_TOPIC: boolean;
}

export interface NotificationPrioritySettingsConfig {
	VERY_IMPORTANT: string[];
	VERY_IMPORTANT_TYPE: NTFYPriorityType;
}
