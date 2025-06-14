export interface PromptTemplates {
    systemPrompt: string;
    promptTemplate: {
        contextHeader: string;
        sourceLabel: string;
        pathLabel: string;
        relevanceLabel: string;
        contentSummaryLabel: string;
        separator: string;
        questionLabel: string;
        requirementsLabel: string;
        requirements: string[];
        answerPrompt: string;
    };
}

export const PROMPT_TEMPLATES: Record<string, PromptTemplates> = {
    'zh-CN': {
        systemPrompt: '你是一个专业的知识管理助手。你的任务是基于用户提供的笔记内容回答问题。请确保答案准确、有条理，并明确标注信息来源。',
        promptTemplate: {
            contextHeader: '**可用的笔记内容：**\n\n',
            sourceLabel: '**[来源',
            pathLabel: '路径: ',
            relevanceLabel: '相关度: ',
            contentSummaryLabel: '内容摘要:\n',
            separator: '---\n\n',
            questionLabel: '**问题：** ',
            requirementsLabel: '**回答要求：**\n',
            requirements: [
                '1. 基于上述笔记内容回答问题，不要编造信息',
                '2. 在答案中明确标注信息来源，使用格式：[来源 X]',
                '3. 如果笔记内容不足以完整回答问题，请明确说明',
                '4. 使用清晰的结构组织答案（如使用标题、列表等）',
                '5. 保持客观和准确，避免过度解读',
                '6. 如果发现相关但不完全匹配的信息，也可以提及'
            ],
            answerPrompt: '请开始回答：'
        }
    },
    'en-US': {
        systemPrompt: 'You are a professional knowledge management assistant. Your task is to answer questions based on the note content provided by the user. Please ensure answers are accurate, well-structured, and clearly cite information sources.',
        promptTemplate: {
            contextHeader: '**Available Note Content:**\n\n',
            sourceLabel: '**[Source',
            pathLabel: 'Path: ',
            relevanceLabel: 'Relevance: ',
            contentSummaryLabel: 'Content Summary:\n',
            separator: '---\n\n',
            questionLabel: '**Question:** ',
            requirementsLabel: '**Answer Requirements:**\n',
            requirements: [
                '1. Answer the question based on the above note content, do not make up information',
                '2. Clearly cite information sources in the answer using format: [Source X]',
                '3. If the note content is insufficient to fully answer the question, please state this clearly',
                '4. Use clear structure to organize the answer (such as using headings, lists, etc.)',
                '5. Stay objective and accurate, avoid over-interpretation',
                '6. If you find relevant but not completely matching information, you may also mention it'
            ],
            answerPrompt: 'Please begin your answer:'
        }
    }
};

export function getPromptTemplates(language: string): PromptTemplates {
    return PROMPT_TEMPLATES[language] || PROMPT_TEMPLATES['zh-CN'];
} 