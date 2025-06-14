export interface SettingsTexts {
    // 基本配置
    basicAiConfig: string;
    basicAiConfigDesc: string;
    openaiApiKey: string;
    openaiApiKeyDesc: string;
    apiUrl: string;
    apiUrlDesc: string;
    validateApiKey: string;
    validateApiKeyDesc: string;
    validating: string;
    validate: string;
    aiModel: string;
    aiModelDesc: string;
    creativity: string;
    creativityDescTemplate: string; // 模板，需要替换数值
    localEmbeddingModel: string;
    localEmbeddingModelDesc: string;
    
    // 高级设置
    advancedSettings: string;
    advancedSettingsDesc: string;
    allowedFolders: string;
    allowedFoldersDesc: string;
    allowedFoldersPlaceholder: string;
    excludedFolders: string;
    excludedFoldersDesc: string;
    excludedFoldersPlaceholder: string;
    maxFileSize: string;
    maxFileSizeDescTemplate: string; // 模板，需要替换数值
    maxSearchResults: string;
    maxSearchResultsDescTemplate: string; // 模板，需要替换数值
    
    // 缓存设置
    cacheSettings: string;
    cacheSettingsDesc: string;
    enableCache: string;
    enableCacheDesc: string;
    cacheExpiry: string;
    cacheExpiryDescTemplate: string; // 模板，需要替换数值
    cacheManagement: string;
    cacheManagementDesc: string;
    clearCache: string;
    
    // 重置设置
    resetSettings: string;
    resetSettingsDesc: string;
    resetAllSettings: string;
    resetAllSettingsDesc: string;
    resetSettingsBtn: string;
}

export const SETTINGS_TEXTS: Record<string, SettingsTexts> = {
    'zh-CN': {
        // 基本配置
        basicAiConfig: '🤖 基本 AI 配置',
        basicAiConfigDesc: '配置AI模型和API密钥',
        openaiApiKey: 'OpenAI API Key',
        openaiApiKeyDesc: '输入你的OpenAI API密钥',
        apiUrl: 'API URL',
        apiUrlDesc: '输入API端点URL，默认为OpenAI官方地址',
        validateApiKey: '验证API密钥',
        validateApiKeyDesc: '测试API密钥是否有效',
        validating: '验证中...',
        validate: '验证',
        aiModel: 'AI模型',
        aiModelDesc: '选择使用的AI模型',
        creativity: '创意度',
        creativityDescTemplate: '控制回答的创造性 (当前: {value})',
        localEmbeddingModel: '本地嵌入模型',
        localEmbeddingModelDesc: '使用本地模型处理语义搜索（首次使用需下载模型，约100MB）',
        
        // 高级设置
        advancedSettings: '⚙️ 高级设置',
        advancedSettingsDesc: '文件访问控制和性能优化',
        allowedFolders: '允许访问的文件夹',
        allowedFoldersDesc: '指定AI可以访问的文件夹路径，留空表示允许所有文件夹',
        allowedFoldersPlaceholder: '例如：日记\n工作笔记\n学习资料',
        excludedFolders: '排除的文件夹',
        excludedFoldersDesc: '指定AI不能访问的文件夹路径',
        excludedFoldersPlaceholder: '例如：Templates\n.trash\n个人隐私',
        maxFileSize: '最大文件大小',
        maxFileSizeDescTemplate: '单个文件的最大大小限制 (当前: {value} KB)',
        maxSearchResults: '最大搜索结果数',
        maxSearchResultsDescTemplate: '每次搜索返回的最大结果数量 (当前: {value})',
        
        // 缓存设置
        cacheSettings: '🗄️ 缓存设置',
        cacheSettingsDesc: '管理搜索缓存和性能优化',
        enableCache: '启用缓存',
        enableCacheDesc: '缓存搜索结果以提高性能',
        cacheExpiry: '缓存过期时间',
        cacheExpiryDescTemplate: '缓存的有效期 (当前: {value} 小时)',
        cacheManagement: '缓存管理',
        cacheManagementDesc: '清除所有缓存数据',
        clearCache: '清除缓存',
        
        // 重置设置
        resetSettings: '🔄 重置设置',
        resetSettingsDesc: '恢复默认配置',
        resetAllSettings: '重置所有设置',
        resetAllSettingsDesc: '将所有设置恢复为默认值（不会删除API密钥）',
        resetSettingsBtn: '重置设置'
    },
    'en-US': {
        // 基本配置
        basicAiConfig: '🤖 Basic AI Configuration',
        basicAiConfigDesc: 'Configure AI model and API key',
        openaiApiKey: 'OpenAI API Key',
        openaiApiKeyDesc: 'Enter your OpenAI API key',
        apiUrl: 'API URL',
        apiUrlDesc: 'Enter API endpoint URL, defaults to OpenAI official address',
        validateApiKey: 'Validate API Key',
        validateApiKeyDesc: 'Test if the API key is valid',
        validating: 'Validating...',
        validate: 'Validate',
        aiModel: 'AI Model',
        aiModelDesc: 'Select the AI model to use',
        creativity: 'Creativity',
        creativityDescTemplate: 'Control the creativity of responses (current: {value})',
        localEmbeddingModel: 'Local Embedding Model',
        localEmbeddingModelDesc: 'Use local model for semantic search (first use requires downloading model, ~100MB)',
        
        // 高级设置
        advancedSettings: '⚙️ Advanced Settings',
        advancedSettingsDesc: 'File access control and performance optimization',
        allowedFolders: 'Allowed Folders',
        allowedFoldersDesc: 'Specify folder paths that AI can access, leave empty to allow all folders',
        allowedFoldersPlaceholder: 'e.g.: Diary\nWork Notes\nStudy Materials',
        excludedFolders: 'Excluded Folders',
        excludedFoldersDesc: 'Specify folder paths that AI cannot access',
        excludedFoldersPlaceholder: 'e.g.: Templates\n.trash\nPrivate',
        maxFileSize: 'Max File Size',
        maxFileSizeDescTemplate: 'Maximum size limit for individual files (current: {value} KB)',
        maxSearchResults: 'Max Search Results',
        maxSearchResultsDescTemplate: 'Maximum number of results returned per search (current: {value})',
        
        // 缓存设置
        cacheSettings: '🗄️ Cache Settings',
        cacheSettingsDesc: 'Manage search cache and performance optimization',
        enableCache: 'Enable Cache',
        enableCacheDesc: 'Cache search results to improve performance',
        cacheExpiry: 'Cache Expiry',
        cacheExpiryDescTemplate: 'Cache validity period (current: {value} hours)',
        cacheManagement: 'Cache Management',
        cacheManagementDesc: 'Clear all cache data',
        clearCache: 'Clear Cache',
        
        // 重置设置
        resetSettings: '🔄 Reset Settings',
        resetSettingsDesc: 'Restore default configuration',
        resetAllSettings: 'Reset All Settings',
        resetAllSettingsDesc: 'Restore all settings to default values (will not delete API key)',
        resetSettingsBtn: 'Reset Settings'
    }
};

export function getSettingsTexts(language: string): SettingsTexts {
    return SETTINGS_TEXTS[language] || SETTINGS_TEXTS['zh-CN'];
}

// 辅助函数：替换模板中的占位符
export function formatTemplate(template: string, value: number | string): string {
    return template.replace('{value}', value.toString());
} 