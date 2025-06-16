export interface I18nTexts {
    // 搜索相关
    search: string;
    question: string;
    searchPlaceholder: string;
    questionPlaceholder: string;
    semanticSearchHint: string;
    qaHint: string;
    
    // 搜索类型按钮
    qaBtn: string;
    
    // 操作按钮
    clearBtn: string;
    refreshBtn: string;
    
    // 统计信息
    notesCount: string;
    vectorsCount: string;
    
    // 通知消息
    noResults: string;
    noApiKey: string;
    apiKeyValid: string;
    apiKeyInvalid: string;
    cacheCleared: string;
    settingsReset: string;
    languageUpdated: string;
    localModelDownload: string;
    
    // 错误消息
    apiRequestFailed: string;
    noRelevantContent: string;
    operationCancelled: string;
    searchFailedError: string;
    
    // 欢迎消息
    welcomeTitle: string;
    welcomeDesc: string;
    featuresTitle: string;
    keywordSearchDesc: string;
    semanticSearchDesc: string;
    qaDesc: string;
    clickHint: string;
    
    // 加载和处理状态
    thinking: string;
    searching: string;
    noNotesFound: string;
    noVectorData: string;
    creatingIndex: string;
    searchingContent: string;
    generatingAnswer: string;
    preparingResults: string;
    
    // 结果显示
    noResultsFound: string;
    tryDifferentSearch: string;
    keywordSearchType: string;
    semanticSearchType: string;
    similarity: string;
    qaProcessing: string;
    searchingNotes: string;
    preparingSearch: string;
    creatingIndexPrefix: string;
    
    // Q&A相关
    questionLabel: string;
    aiAnswerLabel: string;
    referenceSources: string;
    notesUnit: string;
    clickToOpen: string;
    snippetLabel: string;
    
    // 复制功能相关
    copyBtn: string;
    copyBtnTitle: string;
    copySuccess: string;
    copySuccessNotice: string;
    copyError: string;
    
    // Embedding服务相关
    embeddingApiError: string;
    embeddingApiRequestFailed: string;
    invalidApiResponseFormat: string;
    apiReturnedInvalidData: string;
    embeddingApiCallFailed: string;
    returnZeroVectorFallback: string;
    startCreatingVectorIndex: string;
    beginCreatingVectorIndex: string;
    vectorIndexCreationCancelled: string;
    processingNote: string;
    processingNoteLabel: string;
    processNoteError: string;
    progress: string;
    successful: string;
    failed: string;
    vectorIndexCreationComplete: string;
    totalProcessed: string;
    completedLabel: string;
    filesFailedToProcess: string;
    checkApiConfigOrNetwork: string;
    semanticRetrievalScores: string;
    semanticSearchFailed: string;
    localEmbeddingModelLoaded: string;
    localEmbeddingModelLoadFailed: string;
    
    // AI服务相关
    openaiApiKeyNotConfigured: string;
    apiRequestFailedWithStatus: string;
    apiReturnedAbnormalDataFormat: string;
    errorGeneratingAnswer: string;
    getModelListFailed: string;
    
    // 笔记服务相关
    skipLargeFile: string;
    loadedNotesFromFiles: string;
    
    // 新的UI文本
    searchModeBtn: string;
    qaModeBtn: string;
    semanticCheckbox: string;
    searchModeDesc: string;
    qaModeDesc: string;
    
    // 设置界面文本
    languageSetting: string;
    languageSettingDesc: string;
    basicAiConfig: string;
    basicAiConfigDesc: string;
    openaiApiKey: string;
    openaiApiKeyDesc: string;
    validateApiKey: string;
    validateApiKeyDesc: string;
    validating: string;
    validate: string;
    aiModel: string;
    aiModelDesc: string;
    creativity: string;
    creativityDesc: string;
    localEmbeddingModel: string;
    localEmbeddingModelDesc: string;
    advancedSettings: string;
    advancedSettingsDesc: string;
    allowedFolders: string;
    allowedFoldersDesc: string;
    allowedFoldersPlaceholder: string;
    excludedFolders: string;
    excludedFoldersDesc: string;
    excludedFoldersPlaceholder: string;
    maxFileSize: string;
    maxFileSizeDesc: string;
    maxSearchResults: string;
    maxSearchResultsDesc: string;
    cacheSettings: string;
    cacheSettingsDesc: string;
    enableCache: string;
    enableCacheDesc: string;
    cacheExpiry: string;
    cacheExpiryDesc: string;
    cacheManagement: string;
    cacheManagementDesc: string;
    clearCache: string;
    resetSettings: string;
    resetSettingsDesc: string;
    resetAllSettings: string;
    resetAllSettingsDesc: string;
    resetSettingsBtn: string;
}

export const I18N_TEXTS: Record<string, I18nTexts> = {
    'zh-CN': {
        // 搜索相关
        search: '搜索',
        question: '提问',
        searchPlaceholder: '输入关键词搜索笔记...',
        questionPlaceholder: '输入问题...',
        semanticSearchHint: '请输入语义搜索内容',
        qaHint: '请输入你的问题',
        
        // 搜索类型按钮
        qaBtn: '💬 问答',
        
        // 操作按钮
        clearBtn: '🗑️ 清除',
        refreshBtn: '🔄 刷新缓存',
        
        // 统计信息
        notesCount: '笔记',
        vectorsCount: '向量',
        
        // 通知消息
        noResults: '未找到相关的笔记',
        noApiKey: '请先输入API密钥',
        apiKeyValid: '✅ API密钥有效',
        apiKeyInvalid: '❌ API密钥无效或无权限',
        cacheCleared: '✅ 缓存已清除',
        settingsReset: '✅ 设置已重置',
        languageUpdated: '语言设置已更新',
        localModelDownload: '本地模型将在下次语义搜索时自动下载',
        
        // 错误消息
        apiRequestFailed: '❌ API请求失败，请检查API密钥和网络连接',
        noRelevantContent: '未找到相关的笔记内容，无法回答问题',
        operationCancelled: '⏹️ 操作已取消',
        searchFailedError: '❌ 搜索失败',
        
        // 欢迎消息
        welcomeTitle: '👋 欢迎使用 Knowledge Assistant',
        welcomeDesc: '选择功能类型并输入内容开始使用',
        featuresTitle: '💡 功能说明:',
        keywordSearchDesc: '• 🔍 关键词搜索：快速精确匹配',
        semanticSearchDesc: '• 🧠 语义搜索：理解内容含义',
        qaDesc: '• 💬 智能问答：基于笔记内容回答问题',
        clickHint: '• 点击标题打开笔记',
        searchModeBtn: '🔍搜索',
        qaModeBtn: '💬问答',
        semanticCheckbox: '语义搜索',
        searchModeDesc: '在笔记中搜索相关内容',
        qaModeDesc: '基于笔记内容回答问题',
        
        // 加载和处理状态
        thinking: '🤔 思考中...',
        searching: '🔄 搜索中...',
        noNotesFound: '没有找到任何笔记',
        noVectorData: '没有可用的向量数据，请检查API配置',
        creatingIndex: '正在创建向量索引...',
        searchingContent: '搜索相关内容...',
        generatingAnswer: '生成答案...',
        preparingResults: '准备显示结果...',
        
        // 结果显示
        noResultsFound: '😔 未找到相关笔记',
        tryDifferentSearch: '尝试更改搜索词或使用不同的搜索类型',
        keywordSearchType: '关键词搜索',
        semanticSearchType: '语义搜索',
        similarity: '相似度',
        qaProcessing: '🤔 AI 问答处理中',
        searchingNotes: '正在搜索相关笔记...',
        preparingSearch: '准备搜索...',
        creatingIndexPrefix: '创建索引',
        
        // Q&A相关
        questionLabel: '💬 问题',
        aiAnswerLabel: '🤖 AI 回答',
        referenceSources: '📚 参考来源',
        notesUnit: '个笔记',
        clickToOpen: '点击打开文件',
        snippetLabel: '片段',
        
        // 复制功能相关
        copyBtn: '📋 复制',
        copyBtnTitle: '复制AI回答',
        copySuccess: '✅ 已复制',
        copySuccessNotice: '✅ AI回答已复制到剪贴板（含双链格式）',
        copyError: '❌ 复制失败，请手动选择文本复制',
        
        // Embedding服务相关
        embeddingApiError: 'Embedding API错误',
        embeddingApiRequestFailed: 'Embedding API请求失败',
        invalidApiResponseFormat: '无效的API响应格式',
        apiReturnedInvalidData: 'API返回的数据格式无效',
        embeddingApiCallFailed: 'Embedding API调用失败',
        returnZeroVectorFallback: '返回零向量作为fallback',
        startCreatingVectorIndex: '开始创建向量索引',
        beginCreatingVectorIndex: '开始创建向量索引...',
        vectorIndexCreationCancelled: '向量索引创建被用户取消',
        processingNote: '处理笔记',
        processingNoteLabel: '处理',
        processNoteError: '处理笔记时出错',
        progress: '进度',
        successful: '成功',
        failed: '失败',
        vectorIndexCreationComplete: '向量索引创建完成！',
        totalProcessed: '总共处理',
        completedLabel: '完成！',
        filesFailedToProcess: '个文件处理失败，请检查API配置或网络连接',
        checkApiConfigOrNetwork: '请检查API配置或网络连接',
        semanticRetrievalScores: '语义检索分数',
        semanticSearchFailed: '语义搜索失败',
        localEmbeddingModelLoaded: '本地embedding模型加载成功',
        localEmbeddingModelLoadFailed: '本地embedding模型加载失败',
        
        // AI服务相关
        openaiApiKeyNotConfigured: 'OpenAI API密钥未配置',
        apiRequestFailedWithStatus: 'API请求失败',
        apiReturnedAbnormalDataFormat: 'API返回数据格式异常',
        errorGeneratingAnswer: '生成答案时出错',
        getModelListFailed: '获取模型列表失败',
        
        // 笔记服务相关
        skipLargeFile: '跳过大文件',
        loadedNotesFromFiles: '加载了',
        

        
        // 设置界面文本
        languageSetting: '语言Language',
        languageSettingDesc: '选择插件使用的语言Select the language used by the plugin',
        basicAiConfig: '🤖 基本 AI 配置',
        basicAiConfigDesc: '配置AI模型和API密钥',
        openaiApiKey: 'OpenAI API Key',
        openaiApiKeyDesc: '输入你的OpenAI API密钥',
        validateApiKey: '验证API密钥',
        validateApiKeyDesc: '测试API密钥是否有效',
        validating: '验证中...',
        validate: '验证',
        aiModel: 'AI模型',
        aiModelDesc: '选择使用的AI模型',
        creativity: '创意度',
        creativityDesc: '控制回答的创造性',
        localEmbeddingModel: '本地嵌入模型',
        localEmbeddingModelDesc: '使用本地模型处理语义搜索（首次使用需下载模型，约100MB）',
        advancedSettings: '⚙️ 高级设置',
        advancedSettingsDesc: '文件访问控制和性能优化',
        allowedFolders: '允许访问的文件夹',
        allowedFoldersDesc: '指定AI可以访问的文件夹路径，留空表示允许所有文件夹',
        allowedFoldersPlaceholder: '例如：日记\n工作笔记\n学习资料',
        excludedFolders: '排除的文件夹',
        excludedFoldersDesc: '指定AI不能访问的文件夹路径',
        excludedFoldersPlaceholder: '例如：Templates\n.trash\n个人隐私',
        maxFileSize: '最大文件大小',
        maxFileSizeDesc: '单个文件的最大大小限制',
        maxSearchResults: '最大搜索结果数',
        maxSearchResultsDesc: '每次搜索返回的最大结果数量',
        cacheSettings: '🗄️ 缓存设置',
        cacheSettingsDesc: '管理搜索缓存和性能优化',
        enableCache: '启用缓存',
        enableCacheDesc: '缓存搜索结果以提高性能',
        cacheExpiry: '缓存过期时间',
        cacheExpiryDesc: '缓存的有效期',
        cacheManagement: '缓存管理',
        cacheManagementDesc: '清除所有缓存数据',
        clearCache: '清除缓存',
        resetSettings: '🔄 重置设置',
        resetSettingsDesc: '恢复默认配置',
        resetAllSettings: '重置所有设置',
        resetAllSettingsDesc: '将所有设置恢复为默认值（不会删除API密钥）',
        resetSettingsBtn: '重置设置'
    },
    'en-US': {
        // 搜索相关
        search: 'Search',
        question: 'Ask',
        searchPlaceholder: 'Enter keywords to search notes...',
        questionPlaceholder: 'Enter your question...',
        semanticSearchHint: 'Please enter semantic search content',
        qaHint: 'Please enter your question',
        
        // 搜索类型按钮
        qaBtn: '💬 Q&A',
        
        // 操作按钮
        clearBtn: '🗑️ Clear',
        refreshBtn: '🔄 Refresh Cache',
        
        // 统计信息
        notesCount: 'Notes',
        vectorsCount: 'Vectors',
        
        // 通知消息
        noResults: 'No relevant notes found',
        noApiKey: 'Please enter API key first',
        apiKeyValid: '✅ API key is valid',
        apiKeyInvalid: '❌ API key is invalid or no permission',
        cacheCleared: '✅ Cache cleared',
        settingsReset: '✅ Settings reset',
        languageUpdated: 'Language setting updated',
        localModelDownload: 'Local model will be downloaded automatically on next semantic search',
        
        // 错误消息
        apiRequestFailed: '❌ API request failed, please check API key and network connection',
        noRelevantContent: 'No relevant note content found, unable to answer the question',
        operationCancelled: '⏹️ Operation cancelled',
        searchFailedError: '❌ Search failed',
        
        // 欢迎消息
        welcomeTitle: '👋 Welcome to Knowledge Assistant',
        welcomeDesc: 'Select a function type and enter content to start',
        featuresTitle: '💡 Features:',
        keywordSearchDesc: '• 🔍 Keyword Search: Fast and precise matching',
        semanticSearchDesc: '• 🧠 Semantic Search: Understand content meaning',
        qaDesc: '• 💬 Smart Q&A: Answer questions based on note content',
        clickHint: '• Click title to open note',
        
        // 加载和处理状态
        thinking: '🤔 Thinking...',
        searching: '🔄 Searching...',
        noNotesFound: 'No notes found',
        noVectorData: 'No vector data available, please check API configuration',
        creatingIndex: 'Creating vector index...',
        searchingContent: 'Searching related content...',
        generatingAnswer: 'Generating answer...',
        preparingResults: 'Preparing results...',
        
        // 结果显示
        noResultsFound: '😔 No relevant notes found',
        tryDifferentSearch: 'Try changing search terms or using a different search type',
        keywordSearchType: 'Keyword Search',
        semanticSearchType: 'Semantic Search',
        similarity: 'Similarity',
        qaProcessing: '🤔 AI Q&A Processing',
        searchingNotes: 'Searching related notes...',
        preparingSearch: 'Preparing search...',
        creatingIndexPrefix: 'Creating index',
        
        // Q&A相关
        questionLabel: '💬 Question',
        aiAnswerLabel: '🤖 AI Answer',
        referenceSources: '📚 Reference Sources',
        notesUnit: 'notes',
        clickToOpen: 'Click to open file',
        snippetLabel: 'Snippet',
        
        // 复制功能相关
        copyBtn: '📋 Copy',
        copyBtnTitle: 'Copy AI Answer',
        copySuccess: '✅ Copied',
        copySuccessNotice: '✅ AI answer copied to clipboard (with double-link format)',
        copyError: '❌ Copy failed, please manually select and copy text',
        
        // Embedding服务相关
        embeddingApiError: 'Embedding API Error',
        embeddingApiRequestFailed: 'Embedding API request failed',
        invalidApiResponseFormat: 'Invalid API response format',
        apiReturnedInvalidData: 'API returned invalid data format',
        embeddingApiCallFailed: 'Embedding API call failed',
        returnZeroVectorFallback: 'Returning zero vector as fallback',
        startCreatingVectorIndex: 'Starting to create vector index',
        beginCreatingVectorIndex: 'Starting to create vector index...',
        vectorIndexCreationCancelled: 'Vector index creation cancelled by user',
        processingNote: 'Processing note',
        processingNoteLabel: 'Processing',
        processNoteError: 'Error processing note',
        progress: 'Progress',
        successful: 'Successful',
        failed: 'Failed',
        vectorIndexCreationComplete: 'Vector index creation complete!',
        totalProcessed: 'Total processed',
        completedLabel: 'Complete!',
        filesFailedToProcess: 'files failed to process, please check API configuration or network connection',
        checkApiConfigOrNetwork: 'Please check API configuration or network connection',
        semanticRetrievalScores: 'Semantic retrieval scores',
        semanticSearchFailed: 'Semantic search failed',
        localEmbeddingModelLoaded: 'Local embedding model loaded successfully',
        localEmbeddingModelLoadFailed: 'Local embedding model load failed',
        
        // AI服务相关
        openaiApiKeyNotConfigured: 'OpenAI API key not configured',
        apiRequestFailedWithStatus: 'API request failed',
        apiReturnedAbnormalDataFormat: 'API returned abnormal data format',
        errorGeneratingAnswer: 'Error generating answer',
        getModelListFailed: 'Failed to get model list',
        
        // 笔记服务相关
        skipLargeFile: 'Skip large file',
        loadedNotesFromFiles: 'Loaded',
        
        // 新的UI文本
        searchModeBtn: '🔍Search',
        qaModeBtn: ' 💬Q&A',
        semanticCheckbox: 'Semantic Search',
        searchModeDesc: 'Search for relevant content in notes',
        qaModeDesc: 'Answer questions based on note content',
        
        // 设置界面文本
        languageSetting: 'Language语言',
        languageSettingDesc: 'Select the language used by the plugin选择插件使用的语言',
        basicAiConfig: '🤖 Basic AI Configuration',
        basicAiConfigDesc: 'Configure AI model and API key',
        openaiApiKey: 'OpenAI API Key',
        openaiApiKeyDesc: 'Enter your OpenAI API key',
        validateApiKey: 'Validate API Key',
        validateApiKeyDesc: 'Test if the API key is valid',
        validating: 'Validating...',
        validate: 'Validate',
        aiModel: 'AI Model',
        aiModelDesc: 'Select the AI model to use',
        creativity: 'Creativity',
        creativityDesc: 'Control the creativity of responses',
        localEmbeddingModel: 'Local Embedding Model',
        localEmbeddingModelDesc: 'Use local model for semantic search (first use requires downloading model, ~100MB)',
        advancedSettings: '⚙️ Advanced Settings',
        advancedSettingsDesc: 'File access control and performance optimization',
        allowedFolders: 'Allowed Folders',
        allowedFoldersDesc: 'Specify folder paths that AI can access, leave empty to allow all folders',
        allowedFoldersPlaceholder: 'e.g.: Diary\nWork Notes\nStudy Materials',
        excludedFolders: 'Excluded Folders',
        excludedFoldersDesc: 'Specify folder paths that AI cannot access',
        excludedFoldersPlaceholder: 'e.g.: Templates\n.trash\nPrivate',
        maxFileSize: 'Max File Size',
        maxFileSizeDesc: 'Maximum size limit for individual files',
        maxSearchResults: 'Max Search Results',
        maxSearchResultsDesc: 'Maximum number of results returned per search',
        cacheSettings: '🗄️ Cache Settings',
        cacheSettingsDesc: 'Manage search cache and performance optimization',
        enableCache: 'Enable Cache',
        enableCacheDesc: 'Cache search results to improve performance',
        cacheExpiry: 'Cache Expiry',
        cacheExpiryDesc: 'Cache validity period',
        cacheManagement: 'Cache Management',
        cacheManagementDesc: 'Clear all cache data',
        clearCache: 'Clear Cache',
        resetSettings: '🔄 Reset Settings',
        resetSettingsDesc: 'Restore default configuration',
        resetAllSettings: 'Reset All Settings',
        resetAllSettingsDesc: 'Restore all settings to default values (will not delete API key)',
        resetSettingsBtn: 'Reset Settings'
    }
};

export function getI18nTexts(language: string): I18nTexts {
    return I18N_TEXTS[language] || I18N_TEXTS['zh-CN'];
} 