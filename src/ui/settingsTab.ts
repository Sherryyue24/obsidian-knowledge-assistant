// settingsTab.ts
import { PluginSettingTab, Setting, Notice } from 'obsidian';
import MyPlugin from '../core/plugin';
import { EmbeddingService } from '../core/ai/embeddingService';
import { getI18nTexts } from '../utils/i18n';
import { getSettingsTexts, formatTemplate } from '../utils/settingsTexts';

export interface PluginSettings {
    
    // 提示语言设置
    language: string;          
    
    // 基本AI配置
    openaiApiKey: string;
    apiUrl: string;  // API URL
    model: string;
    temperature: number;
    localEmbedding: boolean;
    
    
    // 高级设置
    allowedFolders: string[];  // 允许AI访问的文件夹路径
    excludedFolders: string[]; // 排除的文件夹路径
    maxFileSize: number;       // 最大文件大小限制 (KB)
    enableCaching: boolean;    // 是否启用缓存
    cacheExpiry: number;       // 缓存过期时间 (小时)
    maxSearchResults: number;  // 最大搜索结果数量
}

export const DEFAULT_SETTINGS: PluginSettings = {
    // 基本AI配置
    openaiApiKey: '',
    apiUrl: 'https://api.openai.com/v1',
    model: 'gpt-4-turbo',
    temperature: 0.7,
    localEmbedding: false,
    language: 'zh-CN', // 默认中文
    
    // 高级设置
    allowedFolders: [],
    excludedFolders: ['Templates', '.trash'],
    maxFileSize: 1024, // 1MB
    enableCaching: true,
    cacheExpiry: 24, // 24小时
    maxSearchResults: 10,
};

export class SettingsTab extends PluginSettingTab {
    private plugin: MyPlugin;
    private settings: PluginSettings;

    constructor(plugin: MyPlugin) {
        super(plugin.app, plugin);
        this.plugin = plugin;
        this.settings = plugin.settings;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();
        
        const texts = getI18nTexts(this.settings.language);
        const settingsTexts = getSettingsTexts(this.settings.language);

        // 提示语言选择 - 放在最上面
        new Setting(containerEl)
        .setName('语言Language')
        .setDesc('选择插件使用的语言Select the language used by the plugin')
        .addDropdown(dropdown => dropdown
            .addOption('zh-CN', '中文')
            .addOption('en-US', 'English')
            .setValue(this.settings.language)
            .onChange(async (value) => {
                this.settings.language = value;
                await this.plugin.saveSettings();
                const newTexts = getI18nTexts(value);
                new Notice(newTexts.languageUpdated);
                // 刷新侧边栏界面
                this.plugin.refreshSidebarLanguage();
                // 刷新设置界面
                this.display();
            }));
    

        // ================================
        // 基本 AI 配置
        // ================================
        this.createSectionHeader(containerEl, settingsTexts.basicAiConfig, settingsTexts.basicAiConfigDesc);
        

        // OpenAI API 密钥设置
        new Setting(containerEl)
            .setName(settingsTexts.openaiApiKey)
            .setDesc(settingsTexts.openaiApiKeyDesc)
            .addText(text => text
                .setPlaceholder('sk-...')
                .setValue(this.settings.openaiApiKey)
                .onChange(async (value) => {
                    this.settings.openaiApiKey = value;
                    await this.plugin.saveSettings();
                }));

        // API URL设置
        new Setting(containerEl)
            .setName(settingsTexts.apiUrl)
            .setDesc(settingsTexts.apiUrlDesc)
            .addText(text => text
                .setPlaceholder('https://api.openai.com/v1')
                .setValue(this.settings.apiUrl)
                .onChange(async (value) => {
                    this.settings.apiUrl = value;
                    await this.plugin.saveSettings();
                }));
                
        new Setting(containerEl)
            .setName(settingsTexts.validateApiKey)
            .setDesc(settingsTexts.validateApiKeyDesc)
            .addButton(btn => btn
                .setButtonText(settingsTexts.validate)
                .onClick(async () => {
                    if (!this.settings.openaiApiKey) {
                        new Notice(texts.noApiKey);
                        return;
                    }
                    btn.setButtonText(settingsTexts.validating);
                    btn.setDisabled(true);
                    
                    const service = new EmbeddingService(this.settings);
                    const valid = await service.validateApiKey();
                    
                    btn.setButtonText(settingsTexts.validate);
                    btn.setDisabled(false);
                    
                    if (valid) {
                        new Notice(texts.apiKeyValid);
                    } else {
                        new Notice(texts.apiKeyInvalid);
                    }
                })
            );

        // 模型选择
        new Setting(containerEl)
            .setName(settingsTexts.aiModel)
            .setDesc(settingsTexts.aiModelDesc)
            .addDropdown(dropdown => dropdown
                .addOption('gpt-3.5-turbo', 'GPT-3.5 Turbo')
                .addOption('gpt-4-turbo', 'GPT-4 Turbo')
                .setValue(this.settings.model)
                .onChange(async (value) => {
                    this.settings.model = value as any;
                    await this.plugin.saveSettings();
                }));
        
        // 温度参数
        new Setting(containerEl)
            .setName(settingsTexts.creativity)
            .setDesc(formatTemplate(settingsTexts.creativityDescTemplate, this.settings.temperature))
            .addSlider(slider => slider
                .setLimits(0, 1, 0.1)
                .setValue(this.settings.temperature)
                .onChange(async (value) => {
                    this.settings.temperature = value;
                    await this.plugin.saveSettings();
                    // 更新描述
                    const newDesc = formatTemplate(settingsTexts.creativityDescTemplate, value);
                    slider.sliderEl.parentElement?.parentElement?.querySelector('.setting-item-description')
                        ?.setText(newDesc);
                }));

        // 本地嵌入模型选项
        new Setting(containerEl)
            .setName(settingsTexts.localEmbeddingModel)
            .setDesc(settingsTexts.localEmbeddingModelDesc)
            .addToggle(toggle => toggle
                .setValue(this.settings.localEmbedding)
                .onChange(async (value) => {
                    this.settings.localEmbedding = value;
                    await this.plugin.saveSettings();
                    if (value) {
                        const texts = getI18nTexts(this.settings.language);
                        new Notice(texts.localModelDownload);
                    }
                }));



        // ================================  
        // 高级设置
        // ================================
        this.createSectionHeader(containerEl, settingsTexts.advancedSettings, settingsTexts.advancedSettingsDesc);

        // 允许访问的文件夹
        new Setting(containerEl)
            .setName(settingsTexts.allowedFolders)
            .setDesc(settingsTexts.allowedFoldersDesc)
            .addTextArea(text => text
                .setPlaceholder(settingsTexts.allowedFoldersPlaceholder)
                .setValue(this.settings.allowedFolders.join('\n'))
                .onChange(async (value) => {
                    this.settings.allowedFolders = value.split('\n')
                        .map(folder => folder.trim())
                        .filter(folder => folder.length > 0);
                    await this.plugin.saveSettings();
                }));

        // 排除的文件夹
        new Setting(containerEl)
            .setName(settingsTexts.excludedFolders)
            .setDesc(settingsTexts.excludedFoldersDesc)
            .addTextArea(text => text
                .setPlaceholder(settingsTexts.excludedFoldersPlaceholder)
                .setValue(this.settings.excludedFolders.join('\n'))
                .onChange(async (value) => {
                    this.settings.excludedFolders = value.split('\n')
                        .map(folder => folder.trim())
                        .filter(folder => folder.length > 0);
                    await this.plugin.saveSettings();
                }));

        // 最大文件大小限制
        new Setting(containerEl)
            .setName(settingsTexts.maxFileSize)
            .setDesc(formatTemplate(settingsTexts.maxFileSizeDescTemplate, this.settings.maxFileSize))
            .addSlider(slider => slider
                .setLimits(100, 5000, 100)
                .setValue(this.settings.maxFileSize)
                .onChange(async (value) => {
                    this.settings.maxFileSize = value;
                    await this.plugin.saveSettings();
                    const newDesc = formatTemplate(settingsTexts.maxFileSizeDescTemplate, value);
                    slider.sliderEl.parentElement?.parentElement?.querySelector('.setting-item-description')
                        ?.setText(newDesc);
                }));

        // 最大搜索结果数
        new Setting(containerEl)
            .setName(settingsTexts.maxSearchResults)
            .setDesc(formatTemplate(settingsTexts.maxSearchResultsDescTemplate, this.settings.maxSearchResults))
            .addSlider(slider => slider
                .setLimits(5, 50, 5)
                .setValue(this.settings.maxSearchResults)
                .onChange(async (value) => {
                    this.settings.maxSearchResults = value;
                    await this.plugin.saveSettings();
                    const newDesc = formatTemplate(settingsTexts.maxSearchResultsDescTemplate, value);
                    slider.sliderEl.parentElement?.parentElement?.querySelector('.setting-item-description')
                        ?.setText(newDesc);
                }));

        // ================================
        // 缓存设置
        // ================================
        this.createSectionHeader(containerEl, settingsTexts.cacheSettings, settingsTexts.cacheSettingsDesc);

        // 启用缓存
        new Setting(containerEl)
            .setName(settingsTexts.enableCache)
            .setDesc(settingsTexts.enableCacheDesc)
            .addToggle(toggle => toggle
                .setValue(this.settings.enableCaching)
                .onChange(async (value) => {
                    this.settings.enableCaching = value;
                    await this.plugin.saveSettings();
                }));

        // 缓存过期时间
        new Setting(containerEl)
            .setName(settingsTexts.cacheExpiry)
            .setDesc(formatTemplate(settingsTexts.cacheExpiryDescTemplate, this.settings.cacheExpiry))
            .addSlider(slider => slider
                .setLimits(1, 168, 1) // 1小时到7天
                .setValue(this.settings.cacheExpiry)
                .onChange(async (value) => {
                    this.settings.cacheExpiry = value;
                    await this.plugin.saveSettings();
                    const newDesc = formatTemplate(settingsTexts.cacheExpiryDescTemplate, value);
                    slider.sliderEl.parentElement?.parentElement?.querySelector('.setting-item-description')
                        ?.setText(newDesc);
                }));

        // 缓存管理按钮
        new Setting(containerEl)
            .setName(settingsTexts.cacheManagement)
            .setDesc(settingsTexts.cacheManagementDesc)
            .addButton(btn => btn
                .setButtonText(settingsTexts.clearCache)
                .setWarning()
                .onClick(async () => {
                    this.plugin.clearCache();
                    new Notice(texts.cacheCleared);
                }));

        // ================================
        // 重置设置
        // ================================
        this.createSectionHeader(containerEl, settingsTexts.resetSettings, settingsTexts.resetSettingsDesc);
        
        new Setting(containerEl)
            .setName(settingsTexts.resetAllSettings)
            .setDesc(settingsTexts.resetAllSettingsDesc)
            .addButton(btn => btn
                .setButtonText(settingsTexts.resetSettingsBtn)
                .setWarning()
                .onClick(async () => {
                    const apiKey = this.settings.openaiApiKey; // 保留API密钥
                    this.settings = { ...DEFAULT_SETTINGS, openaiApiKey: apiKey };
                    this.plugin.settings = this.settings;
                    await this.plugin.saveSettings();
                    this.display(); // 刷新界面
                    new Notice(texts.settingsReset);
                }));
    }

    // 创建分节标题
    private createSectionHeader(containerEl: HTMLElement, title: string, description: string) {
        // 添加间距
        containerEl.createEl('div', { cls: 'setting-item-section-spacer' });
        
        const headerEl = containerEl.createEl('div', { cls: 'setting-item-heading' });
        headerEl.style.marginTop = '2em';
        headerEl.style.marginBottom = '1em';
        headerEl.style.paddingBottom = '0.5em';
        headerEl.style.borderBottom = '2px solid var(--background-modifier-border)';
        
        const titleEl = headerEl.createEl('div', { text: title, cls: 'setting-item-name' });
        titleEl.style.fontSize = '1.2em';
        titleEl.style.fontWeight = 'bold';
        titleEl.style.color = 'var(--text-accent)';
        
        const descEl = headerEl.createEl('div', { text: description, cls: 'setting-item-description' });
        descEl.style.fontSize = '0.9em';
        descEl.style.marginTop = '0.3em';
        descEl.style.color = 'var(--text-muted)';
    }
}