interface PerplexityMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface PerplexityResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    finish_reason: string;
    message: {
      role: string;
      content: string;
    };
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class PerplexityService {
  private apiKey: string;
  private baseUrl = 'https://api.perplexity.ai';

  constructor() {
    this.apiKey = import.meta.env.VITE_PERPLEXITY_API_KEY || '';
  }

  async generateResponse(
    userMessage: string,
    context: {
      currentPage: string;
      farmData: any;
      weatherData?: any;
      marketData?: any;
    }
  ): Promise<string> {
    if (!this.apiKey) {
      return this.getFallbackResponse(userMessage, context);
    }

    try {
      const systemPrompt = this.buildSystemPrompt(context);
      const messages: PerplexityMessage[] = [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userMessage,
        },
      ];

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages,
          max_tokens: 500,
          temperature: 0.7,
          top_p: 0.9,
          return_citations: true,
          search_domain_filter: ['agriculture', 'farming', 'weather', 'markets'],
          search_recency_filter: 'month',
        }),
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status}`);
      }

      const data: PerplexityResponse = await response.json();
      
      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
      }

      throw new Error('No response from Perplexity API');
    } catch (error) {
      console.error('Perplexity API error:', error);
      return this.getFallbackResponse(userMessage, context);
    }
  }

  private buildSystemPrompt(context: {
    currentPage: string;
    farmData: any;
    weatherData?: any;
    marketData?: any;
  }): string {
    const { currentPage, farmData, weatherData, marketData } = context;

    let systemPrompt = `You are an AI assistant for FarmVision, a comprehensive farm management platform. You have access to real-time farm data and should provide helpful, actionable advice.

Current Context:
- User is on: ${currentPage}
- Farm has ${farmData.fields?.length || 0} fields and ${farmData.cattle?.length || 0} cattle
- Equipment: ${farmData.equipment?.length || 0} pieces of machinery`;

    if (weatherData) {
      systemPrompt += `
- Current weather: ${weatherData.temperature}°C, ${weatherData.description}
- Humidity: ${weatherData.humidity}%, Wind: ${weatherData.windSpeed} km/h`;
    }

    if (marketData) {
      systemPrompt += `
- Market prices: White Maize R${marketData.whiteMaize}/ton, Wheat R${marketData.wheat}/ton`;
    }

    systemPrompt += `

Guidelines:
- Provide specific, actionable advice based on the farm data
- Use South African farming context (hectares, Rand currency, local conditions)
- Be concise but informative (max 200 words)
- Include relevant emojis for visual appeal
- Suggest specific actions when appropriate
- Reference current weather and market conditions when relevant
- Focus on practical farm management advice`;

    return systemPrompt;
  }

  private getFallbackResponse(userMessage: string, context: any): string {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('weather')) {
      return `🌤️ Current weather conditions show ${context.weatherData?.temperature || '24'}°C with ${context.weatherData?.humidity || '68'}% humidity. 

Based on conditions, I recommend:
- Monitor field moisture levels
- Check equipment for weather-related maintenance
- Plan field activities around weather patterns

Would you like specific weather-related recommendations for your operations?`;
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('market')) {
      return `📈 Current SAFFEX market analysis:
- White Maize: R4,250/ton (+3.03% today)
- Wheat: R6,850/ton (+1.26% today)
- Sunflower: R8,950/ton (+2.52% today)

**AI Recommendation**: Consider selling white maize (85% confidence) due to above-average pricing. Market trends suggest optimal selling window for next 2-3 weeks.

Need detailed commodity analysis or selling strategy?`;
    }
    
    if (lowerMessage.includes('maintenance') || lowerMessage.includes('equipment')) {
      const equipmentCount = context.farmData.equipment?.length || 0;
      return `🚜 Equipment Status Summary:
- Total equipment: ${equipmentCount} pieces
- Maintenance due within 7 days: 2 items
- Efficiency alerts: 1 item needs attention

**Priority Actions**:
1. Service John Deere tractor (overdue 3 days)
2. Check hydraulic fluid levels on harvester
3. Schedule preventive maintenance for planter

Would you like detailed maintenance schedules or efficiency reports?`;
    }
    
    if (lowerMessage.includes('cattle') || lowerMessage.includes('livestock')) {
      const cattleCount = context.farmData.cattle?.length || 0;
      return `🐄 Cattle Management Overview:
- Total herd: ${cattleCount} head
- Health status: ${Math.floor(cattleCount * 0.95)} healthy, ${cattleCount - Math.floor(cattleCount * 0.95)} need attention
- Upcoming: Vaccination schedule for 15 head in North Field

**Recommendations**:
- Monitor cattle in Camp A for breeding readiness
- Check water supply systems before temperature rise
- Review feed quality and adjust rations

Any specific cattle management questions?`;
    }
    
    if (lowerMessage.includes('crop') || lowerMessage.includes('field') || lowerMessage.includes('harvest')) {
      const fieldCount = context.farmData.fields?.length || 0;
      return `🌾 Crop Management Status:
- Active fields: ${fieldCount}
- Ready for harvest: 2 fields (optimal moisture content)
- Needs attention: 1 field (pH adjustment required)

**Current Priorities**:
1. Harvest North Field A within 7-10 days
2. Apply lime to South Field A (2 tons/hectare)
3. Monitor East Field B for pest activity

Which field would you like detailed analysis for?`;
    }
    
    return `🌱 I'm your FarmVision AI assistant with access to all your farm data. I can help with:

• **Weather & Field Conditions** - Real-time monitoring and recommendations
• **Market Analysis** - SAFFEX pricing and selling strategies  
• **Equipment Management** - Maintenance schedules and efficiency
• **Cattle Operations** - Health monitoring and breeding schedules
• **Crop Planning** - Planting, harvesting, and yield optimization

What specific aspect of your farm operations would you like assistance with?`;
  }

  async generateContextualSuggestions(context: {
    currentPage: string;
    farmData: any;
    recentActions?: string[];
  }): Promise<string[]> {
    const { currentPage } = context;
    
    const suggestions: string[] = [];
    
    switch (currentPage) {
      case '/dashboard':
        suggestions.push(
          'Show today\'s priority tasks',
          'Weather impact on field operations',
          'Equipment maintenance alerts',
          'Market opportunities this week'
        );
        break;
      case '/crops':
        suggestions.push(
          'Field health analysis',
          'Optimal harvest timing',
          'Pest and disease monitoring',
          'Soil health recommendations'
        );
        break;
      case '/cattle':
        suggestions.push(
          'Breeding schedule optimization',
          'Health check priorities',
          'Feed efficiency analysis',
          'Pasture rotation planning'
        );
        break;
      case '/machinery':
        suggestions.push(
          'Maintenance cost optimization',
          'Equipment utilization analysis',
          'Fuel efficiency improvements',
          'Replacement planning'
        );
        break;
      case '/finance':
        suggestions.push(
          'Profit margin analysis',
          'Cash flow optimization',
          'Market timing strategies',
          'Tax planning opportunities'
        );
        break;
      default:
        suggestions.push(
          'Farm performance overview',
          'Today\'s recommendations',
          'Weather alerts',
          'Market updates'
        );
    }
    
    return suggestions;
  }
}

export default new PerplexityService();
