import { PluginSettings } from '../../ui/settingsTab';
import { SearchHit } from '../../types/interfaces';
import { getPromptTemplates } from './promptTemplates';
import { getI18nTexts } from '../../utils/i18n';

export class AIService {
    constructor(private settings: PluginSettings) {}

    private getApiEndpoint(): string {
        const baseUrl = this.settings.apiUrl || 'https://api.openai.com/v1';
        const endpoint = baseUrl.replace(/\/$/, '');
        return endpoint.endsWith('/chat/completions') ? endpoint : `${endpoint}/chat/completions`;
    }

    private getModelsEndpoint(): string {
        const baseUrl = this.settings.apiUrl || 'https://api.openai.com/v1';
        const endpoint = baseUrl.replace(/\/$/, '');
        return endpoint.endsWith('/models') ? endpoint : `${endpoint}/models`;
    }

    async generateAnswer(question: string, context: SearchHit[]): Promise<string> {
        if (!this.settings.openaiApiKey) {
            const texts = getI18nTexts(this.settings.language);
            throw new Error(texts.openaiApiKeyNotConfigured);
        }
        
        const prompt = this.buildPrompt(question, context);
        
        try {
            const response = await fetch(this.getApiEndpoint(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.settings.openaiApiKey}`
                },
                body: JSON.stringify({
                    model: this.settings.model,
                    messages: [
                        { 
                            role: 'system', 
                            content: getPromptTemplates(this.settings.language).systemPrompt
                        },
                        { role: 'user', content: prompt }
                    ],
                    temperature: this.settings.temperature,
                    max_tokens: 2000
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const texts = getI18nTexts(this.settings.language);
                throw new Error(`${texts.apiRequestFailedWithStatus} (${response.status}): ${errorData.error?.message || response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                const texts = getI18nTexts(this.settings.language);
                throw new Error(texts.apiReturnedAbnormalDataFormat);
            }
            
            return data.choices[0].message.content.trim();
        } catch (error) {
            const texts = getI18nTexts(this.settings.language);
            if (error.message.includes(texts.apiRequestFailedWithStatus)) {
                throw error;
            }
            throw new Error(`${texts.errorGeneratingAnswer}: ${error.message}`);
        }
    }

    private buildPrompt(question: string, context: SearchHit[]): string {
        const templates = getPromptTemplates(this.settings.language);
        const { promptTemplate } = templates;
        
        let prompt = promptTemplate.contextHeader;
        
        // 添加上下文信息
        context.forEach((hit, index) => {
            const snippets = hit.snippets.join('\n...\n');
            prompt += `${promptTemplate.sourceLabel} ${index + 1}] ${hit.name}**\n`;
            prompt += `${promptTemplate.pathLabel}${hit.path}\n`;
            if (hit.score !== undefined) {
                prompt += `${promptTemplate.relevanceLabel}${(hit.score * 100).toFixed(1)}%\n`;
            }
            prompt += `${promptTemplate.contentSummaryLabel}${snippets}\n\n`;
        });
        
        prompt += promptTemplate.separator;
        prompt += `${promptTemplate.questionLabel}${question}\n\n`;
        
        prompt += promptTemplate.requirementsLabel;
        promptTemplate.requirements.forEach(req => {
            prompt += `${req}\n`;
        });
        prompt += `\n${promptTemplate.answerPrompt}`;
        
        return prompt;
    }

    // 新增：验证API配置
    async validateApiConfiguration(): Promise<boolean> {
        if (!this.settings.openaiApiKey) {
            return false;
        }

        try {
            const response = await fetch(this.getModelsEndpoint(), {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.settings.openaiApiKey}`
                }
            });

            return response.ok;
        } catch (error) {
            return false;
        }
    }

    // 新增：获取可用模型列表
    async getAvailableModels(): Promise<string[]> {
        if (!this.settings.openaiApiKey) {
            const texts = getI18nTexts(this.settings.language);
            throw new Error(texts.openaiApiKeyNotConfigured);
        }

        try {
            const response = await fetch(this.getModelsEndpoint(), {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.settings.openaiApiKey}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch models: ${response.statusText}`);
            }

            const data = await response.json();
            return data.data
                .filter((model: any) => model.id.includes('gpt'))
                .map((model: any) => model.id)
                .sort();
        } catch (error) {
            const texts = getI18nTexts(this.settings.language);
            throw new Error(`${texts.getModelListFailed}: ${error.message}`);
        }
    }
}