import { APIConfig, ChatRequest } from '../types';

class APIService {
  private config: APIConfig | null = null;

  setConfig(config: APIConfig) {
    this.config = config;
  }

  getConfig(): APIConfig | null {
    return this.config;
  }

  async sendMessage(
    messages: { role: string; content: string }[],
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    if (!this.config) {
      throw new Error('API未配置，请先配置API密钥');
    }

    const request: ChatRequest = {
      model: this.config.model,
      messages,
      stream: true,
    };

    try {
      const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `请求失败: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('响应体为空');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                fullContent += content;
                onChunk?.(content);
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }

      return fullContent;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('请求失败，请检查网络连接');
    }
  }

  async generateTitle(userQuestion: string, aiAnswer: string): Promise<string> {
    if (!this.config) {
      throw new Error('API未配置');
    }

    const messages = [
      {
        role: 'system',
        content: '你是一个标题生成助手。请根据用户的提问和AI的回答，生成一个简洁的标题（不超过15个字）。只返回标题文本，不要有任何解释。',
      },
      {
        role: 'user',
        content: `用户提问：${userQuestion}\n\nAI回答：${aiAnswer.slice(0, 500)}`,
      },
    ];

    const request: ChatRequest = {
      model: this.config.model,
      messages,
      stream: false,
    };

    try {
      const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('标题生成失败');
      }

      const data = await response.json();
      const title = data.choices?.[0]?.message?.content?.trim() || '新对话';
      return title.length > 20 ? title.slice(0, 20) + '...' : title;
    } catch (error) {
      console.error('生成标题失败:', error);
      return userQuestion.slice(0, 20) + (userQuestion.length > 20 ? '...' : '');
    }
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    if (!this.config) {
      return { success: false, message: 'API未配置' };
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      if (response.ok) {
        return { success: true, message: '连接成功' };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          message: errorData.error?.message || `连接失败: ${response.status}`,
        };
      }
    } catch (error) {
      return { success: false, message: '连接失败，请检查网络' };
    }
  }
}

export const apiService = new APIService();
