import { RouterOutput } from "../../server/routerTrpc/_app";
import { z } from "zod";

export type Note = Partial<NonNullable<RouterOutput['notes']['list'][0]>>
export type Attachment = NonNullable<Note['attachments']>[0] & { size: any }
export type Tag = NonNullable<RouterOutput['tags']['list']>[0]
export type Config = NonNullable<RouterOutput['config']['list']>
export type LinkInfo = NonNullable<RouterOutput['public']['linkPreview']>
export type ResourceType = NonNullable<RouterOutput['attachments']['list']>[0]
export type Comment = NonNullable<RouterOutput['comments']['list']>
export type InstalledPluginInfo = NonNullable<RouterOutput['plugin']['getInstalledPlugins']>[0]
export type Conversation = NonNullable<RouterOutput['conversation']['list']>[0]
export type Message = NonNullable<RouterOutput['message']['list']>[0]
export enum NoteType {
  'BLINKO',
  'NOTE',
  'TODO'
}
export type PublicUser = NonNullable<RouterOutput['users']['publicUserList']>[0]
export function toNoteTypeEnum(v?: number, fallback: NoteType = NoteType.BLINKO): NoteType {
  switch (v) {
    case 0:
      return NoteType.BLINKO;
    case 1:
      return NoteType.NOTE;
    case 2:
      return NoteType.TODO;
    default:
      return fallback;
  }
}

export const ZUserPerferConfigKey = z.union([
  z.literal('textFoldLength'),
  z.literal('smallDeviceCardColumns'),
  z.literal('mediumDeviceCardColumns'),
  z.literal('largeDeviceCardColumns'),
  z.literal('timeFormat'),
  z.literal('isHiddenMobileBar'),
  z.literal('isHideCommentInCard'),
  z.literal('isOrderByCreateTime'),
  z.literal('language'),
  z.literal('theme'),
  z.literal('webhookEndpoint'),
  z.literal('toolbarVisibility'),
  z.literal('twoFactorEnabled'),
  z.literal('twoFactorSecret'),
  z.literal('themeColor'),
  z.literal('themeForegroundColor'),
  z.literal('isCloseDailyReview'),
  z.literal('maxHomePageWidth'),
  z.literal('isUseBlinkoHub'),
  z.literal('isHiddenNotification'),
  z.literal('hidePcEditor'),
  z.literal('defaultHomePage'),
  z.literal('desktopHotkeys'),
  z.literal('systemTray'),
]);

export const ZConfigKey = z.union([
  z.literal('isAutoArchived'),
  z.literal('autoArchivedDays'),
  z.literal('isUseAI'),
  z.literal('aiModelProvider'),
  z.literal('aiApiKey'),
  z.literal('aiApiEndpoint'),
  z.literal('aiApiVersion'),
  z.literal('aiModel'),
  z.literal('isAllowRegister'),
  z.literal('objectStorage'),
  z.literal('s3AccessKeyId'),
  z.literal('s3AccessKeySecret'),
  z.literal('s3Endpoint'),
  z.literal('s3Bucket'),
  z.literal('s3Region'),
  z.literal('s3CustomPath'),
  z.literal('localCustomPath'),
  z.literal('embeddingModel'),
  z.literal('embeddingDimensions'),
  z.literal('embeddingTopK'),
  z.literal('embeddingLambda'),
  z.literal('embeddingScore'),
  z.literal('excludeEmbeddingTagId'),
  z.literal('spotifyConsumerKey'),
  z.literal('spotifyConsumerSecret'),
  z.literal('isCloseBackgroundAnimation'),
  z.literal('customBackgroundUrl'),
  z.literal('oauth2Providers'),
  z.literal('embeddingApiEndpoint'),
  z.literal('embeddingApiKey'),
  z.literal('tavilyApiKey'),
  z.literal('tavilyMaxResult'),
  z.literal('isUseAiPostProcessing'),
  z.literal('aiCommentPrompt'),
  z.literal('aiTagsPrompt'),
  z.literal('aiPostProcessingMode'),
  z.literal('aiCustomPrompt'),
  z.literal('isUseHttpProxy'),
  z.literal('httpProxyHost'),
  z.literal('httpProxyPort'),
  z.literal('httpProxyUsername'),
  z.literal('httpProxyPassword'),
  z.literal('aiSmartEditPrompt'),
  z.literal('rerankModel'),
  z.literal('rerankTopK'),
  z.literal('rerankScore'),
  z.literal('rerankUseEembbingEndpoint'),
  z.literal('globalPrompt'),
  ZUserPerferConfigKey,
  z.any()
]);

export type ConfigKey = z.infer<typeof ZConfigKey>;

export const ZOAuth2ProviderSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string().optional(),
  wellKnown: z.string().optional(),
  scope: z.string().optional(),
  authorizationUrl: z.string().optional(),
  tokenUrl: z.string(),
  userinfoUrl: z.string(),
  clientId: z.string(),
  clientSecret: z.string(),
});

export const ZConfigSchema = z.object({
  isAutoArchived: z.boolean().optional(),
  autoArchivedDays: z.number().optional(),
  isUseAI: z.boolean().optional(),
  aiModelProvider: z.any().optional(),
  aiApiKey: z.any().optional(),
  aiApiEndpoint: z.any().optional(),
  aiApiVersion: z.any().optional(),
  aiModel: z.any().optional(),
  isHiddenMobileBar: z.boolean().optional(),
  isHideCommentInCard: z.boolean().optional(),
  toolbarVisibility: z.any().optional(),
  isAllowRegister: z.any().optional(),
  isCloseBackgroundAnimation: z.boolean().optional(),
  customBackgroundUrl: z.any().optional(),
  isOrderByCreateTime: z.any().optional(),
  timeFormat: z.any().optional(),
  smallDeviceCardColumns: z.any().optional(),
  mediumDeviceCardColumns: z.any().optional(),
  largeDeviceCardColumns: z.any().optional(),
  textFoldLength: z.number().optional(),
  objectStorage: z.any().optional(),
  s3AccessKeyId: z.any().optional(),
  s3AccessKeySecret: z.any().optional(),
  s3Endpoint: z.any().optional(),
  s3Bucket: z.any().optional(),
  s3CustomPath: z.any().optional(),
  s3Region: z.any().optional(),
  localCustomPath: z.any().optional(),
  embeddingModel: z.any().optional(),
  embeddingDimensions: z.number().optional(),
  embeddingTopK: z.number().optional(),
  embeddingLambda: z.number().optional(),
  embeddingScore: z.number().optional(),
  excludeEmbeddingTagId: z.number().optional(),
  language: z.any().optional(),
  theme: z.any().optional(),
  themeColor: z.any().optional(),
  themeForegroundColor: z.any().optional(),
  webhookEndpoint: z.any().optional(),
  twoFactorEnabled: z.boolean().optional(),
  twoFactorSecret: z.string().optional(),
  spotifyConsumerKey: z.string().optional(),
  spotifyConsumerSecret: z.string().optional(),
  isCloseDailyReview: z.boolean().optional(),
  maxHomePageWidth: z.number().optional(),
  oauth2Providers: z.array(ZOAuth2ProviderSchema).optional(),
  isUseBlinkoHub: z.boolean().optional(),
  embeddingApiEndpoint: z.string().optional(),
  embeddingApiKey: z.string().optional(),
  isHiddenNotification: z.boolean().optional(),
  tavilyApiKey: z.any().optional(),
  tavilyMaxResult: z.any().optional(),
  isUseAiPostProcessing: z.boolean().optional(),
  aiCommentPrompt: z.string().optional(),
  aiTagsPrompt: z.string().optional(),
  aiPostProcessingMode: z.string().optional(),
  aiCustomPrompt: z.string().optional(),
  isUseHttpProxy: z.boolean().optional(),
  httpProxyHost: z.string().optional(),
  httpProxyPort: z.number().optional(),
  httpProxyUsername: z.string().optional(),
  httpProxyPassword: z.string().optional(),
  aiSmartEditPrompt: z.string().optional(),
  rerankModel: z.string().optional(),
  rerankTopK: z.number().optional(),
  rerankScore: z.number().optional(),
  rerankUseEembbingEndpoint: z.boolean().optional(),
  hidePcEditor: z.boolean().optional(),
  globalPrompt: z.string().optional(),
  defaultHomePage: z.string().optional(),
  desktopHotkeys: z.any().optional(),
  systemTray: z.any().optional(),
});

export type GlobalConfig = z.infer<typeof ZConfigSchema>;

// Zod schema for plugin information
export const pluginInfoSchema = z.object({
  name: z.string(),
  author: z.string().optional(),
  url: z.string().optional(),
  version: z.string(),
  minAppVersion: z.string().optional(),
  displayName: z.any().optional(),
  description: z.any().optional(),
  readme: z.any().optional(),
  downloads: z.number().optional()
});

// Schema for plugin installation input (subset of PluginInfo)
export const installPluginSchema = pluginInfoSchema.omit({
  readme: true,
  downloads: true
});

// TypeScript types derived from the schemas
export type PluginInfo = z.infer<typeof pluginInfoSchema>;
export type InstallPluginInput = z.infer<typeof installPluginSchema>; 

export type RestoreResult = {
  type: 'success' | 'skip' | 'error';
  content?: string;
  error?: unknown;
  progress?: { current: number; total: number };
}

export type ProgressResult = {
  type: 'success' | 'skip' | 'error' | 'info';
  content?: string;
  error?: unknown;
}

// Desktop Hotkey Configuration Types
export interface HotkeyConfig {
  quickNote: string;           // 快速笔记快捷键，默认 "CommandOrControl+Shift+N"
  enabled: boolean;            // 是否启用快捷键
  systemTrayEnabled: boolean;  // 是否启用系统托盘
  windowBehavior: 'show' | 'hide' | 'minimize'; // 窗口行为
}

export const DEFAULT_HOTKEY_CONFIG: HotkeyConfig = {
  quickNote: 'Shift+Space',
  enabled: true,
  systemTrayEnabled: true,
  windowBehavior: 'show'
};

// System Tray Configuration
export interface SystemTrayConfig {
  enabled: boolean;
  showInTray: boolean;
  minimizeToTray: boolean;
  closeToTray: boolean;
}

export const DEFAULT_SYSTEM_TRAY_CONFIG: SystemTrayConfig = {
  enabled: true,
  showInTray: true,
  minimizeToTray: true,
  closeToTray: false
};

// Platform detection utility type
export interface PlatformInfo {
  isTauri: boolean;
  isDesktop: boolean;
  platform: 'windows' | 'macos' | 'linux' | 'android' | 'ios' | 'web';
}

// Hotkey event types for Tauri communication
export interface HotkeyEvent {
  type: 'quicknote-triggered' | 'window-toggle' | 'settings-open';
  payload?: any;
}

// Tray menu item types
export interface TrayMenuItem {
  id: string;
  label: string;
  accelerator?: string;
  enabled?: boolean;
  visible?: boolean;
  type?: 'normal' | 'separator' | 'submenu' | 'checkbox' | 'radio';
}