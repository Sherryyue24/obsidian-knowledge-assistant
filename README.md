# Obsidian Knowledge Assistant Plugin

A powerful Obsidian plugin that provides AI-powered intelligent note searching and Q&A functionality. Transform your note vault into an intelligent knowledge assistant using advanced semantic search and GPT models.

**[中文文档](README_ZH.md) | English**

## ✨ Core Features

### 🔍 Two Main Modes
- **Search**: Intelligent search based on content meaning and context
- **Q&A**: Answer questions based on note content with automatic source attribution

### 🧠 AI-Powered Intelligence
- Support for OpenAI GPT series models (GPT-3.5-turbo, GPT-4-turbo)
- Custom API endpoints supporting third-party compatible services
- Intelligent vector indexing and caching system
- Optional local embedding model support

### 🎨 Modern User Interface
- Seamless sidebar integration with Obsidian
- Real-time progress bars and animations
- Responsive layout for different screen sizes
- One-click copy with automatic Obsidian double-link conversion

## 🚀 Installation

### Method 1: Manual Installation
1. Download plugin files to `.obsidian/plugins/obsidian-knowledge-assistant/` directory
2. Enable the plugin in Obsidian settings
3. Configure your OpenAI API key

### Method 2: Community Plugin (Coming Soon)
1. Open Obsidian Settings → Third-party plugins → Community plugins
2. Search for "Knowledge Assistant"
3. Install and enable the plugin

## 📖 Usage Guide

### Basic Operations

1. **Open Plugin**: Click the 🧠 icon in the sidebar
2. **Select Mode**:
   - 🔍 **Search**: Enter descriptions for semantic search (check semantic search option, otherwise keyword search only)
   - 💬 **Q&A**: Enter questions to get intelligent answers based on your notes

### Smart Q&A Explained

Smart Q&A is the core feature of this plugin, working through:

1. **Question Understanding**: AI analyzes your question intent and key information
2. **Content Retrieval**: Searches for relevant information snippets in your note vault
3. **Answer Generation**: Generates accurate, helpful answers based on retrieved content
4. **Source Attribution**: Clearly marks the source files for each piece of information

**Usage Example**:

**Input Question**: What are the main types of machine learning?

**AI Answer**:
Machine learning is mainly divided into three types:

1. **Supervised Learning**: Uses labeled data to train models, such as classification and regression problems [Source 1]
2. **Unsupervised Learning**: Discovers hidden patterns from unlabeled data, such as cluster analysis [Source 2]
3. **Reinforcement Learning**: Learns optimal strategies through interaction with the environment, such as game AI [Source 1]

**Reference Sources**:
- [1] Machine Learning Basics.md
- [2] Introduction to Data Science.md

**One-Click Copy**: Click the 📋 copy button, and the answer will be automatically converted to Obsidian double-link format:
```
Machine learning is mainly divided into three types:

1. **Supervised Learning**: Uses labeled data to train models, such as classification and regression problems [[Machine Learning Basics]]
2. **Unsupervised Learning**: Discovers hidden patterns from unlabeled data, such as cluster analysis [[Introduction to Data Science]]
3. **Reinforcement Learning**: Learns optimal strategies through interaction with the environment, such as game AI [[Machine Learning Basics]]
```

## ⚙️ Configuration Options

### Basic AI Configuration
- **OpenAI API Key**: Required for AI functionality
- **API URL**: Default OpenAI official address, customizable for other compatible services
- **Model Selection**: GPT-3.5-turbo (fast & economical), GPT-4-turbo (high quality)
- **Temperature Setting**: 0.0-1.0, controls creativity and randomness of responses
- **Local Embedding**: Optional local vector model support

### Search Settings
- **Folder Access Control**: Limit search scope to specific folders
- **File Size Limit**: Skip oversized files to optimize performance
- **Max Search Results**: Control the number of returned results
- **Similarity Threshold**: Set minimum similarity requirement for semantic search

### Cache and Performance
- **Enable Cache**: Cache vector indices to improve search speed
- **Cache Expiration**: Automatic cache update interval
- **Cache Management**: Manual cache cleanup options
- **Batch Size**: Control batch size for vectorization processing

## 🔧 Advanced Features

### Custom API Endpoints
Support for third-party OpenAI-compatible services:
- **Azure OpenAI**: `https://your-resource.openai.azure.com/openai/deployments/your-deployment/`
- **Local Models**: `http://localhost:1234/v1`
- **Proxy Services**: `https://your-proxy.com/v1`

## 🛠️ Technical Features

- **Vector Search**: Uses cosine similarity for semantic relevance calculation
- **Smart Chunking**: Automatically splits long documents into appropriate segments
- **Incremental Indexing**: Only re-creates vectors for modified files
- **Error Recovery**: Automatic retry and error handling mechanisms
- **Multi-language Support**: Chinese and English interface switching

## ⚠️ Important Notes

1. **API Costs**: Using OpenAI API incurs costs, monitor usage recommended
2. **Network Connection**: Requires stable internet connection for AI services
3. **First Use**: Initial vector index creation takes time, please be patient
4. **File Formats**: Primarily supports Markdown format, limited support for others
5. **Privacy Security**: Note content is sent to AI service providers, consider privacy protection

## 🔍 Troubleshooting

### Error Code Explanations

- `API_KEY_INVALID`: Invalid or expired API key
- `NETWORK_ERROR`: Network connection issues
- `QUOTA_EXCEEDED`: API quota exceeded
- `FILE_TOO_LARGE`: File exceeds size limit
- `EMBEDDING_FAILED`: Vectorization processing failed

## 🔄 Changelog

### v1.0.0 (Current Version)
- ✨ Brand new smart Q&A functionality
- ✨ Support for two modes (search, Q&A)
- ✨ Modern sidebar interface design
- ✨ Real-time progress tracking and animations
- ✨ One-click copy with automatic double-link conversion
- ✨ Custom API endpoint support
- ✨ Complete settings panel and cache management
- ✨ Bilingual Chinese and English interface support

## 🤝 Contributing & Support

- **GitHub**: [Project Repository](https://github.com/Sherryyue24/obsidian-knowledge-assistant)
- **Bug Reports**: [Submit Issue](https://github.com/Sherryyue24/obsidian-knowledge-assistant/issues)
- **Feature Requests**: [Discussions](https://github.com/Sherryyue24/obsidian-knowledge-assistant/discussions)

---

**License**: MIT  
**Version**: 1.0.0  
**Compatibility**: Obsidian 1.0+  
**Author**: Sherry