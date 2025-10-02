interface MarketPrice {
  commodity: string;
  grade: string;
  currentPrice: number;
  priceChange: number;
  percentChange: number;
  timestamp: string;
  volume?: number;
  high?: number;
  low?: number;
}

interface HistoricalPrice {
  date: string;
  price: number;
  volume: number;
}

interface MarketRecommendation {
  action: 'HOLD' | 'SELL' | 'BUY';
  confidence: number;
  reasoning: string;
  projectedPrice: number;
  timeframe: string;
  factors: string[];
}

class SaffexService {
  // private baseUrl = 'https://api.saffex.co.za/v1';
  
  async getCurrentPrices(): Promise<MarketPrice[]> {
    try {
      const mockPrices: MarketPrice[] = [
        {
          commodity: 'White Maize',
          grade: 'Grade 1',
          currentPrice: 4250,
          priceChange: 125,
          percentChange: 3.03,
          timestamp: new Date().toISOString(),
          volume: 15420,
          high: 4280,
          low: 4180,
        },
        {
          commodity: 'Yellow Maize',
          grade: 'Grade 1',
          currentPrice: 4180,
          priceChange: -45,
          percentChange: -1.06,
          timestamp: new Date().toISOString(),
          volume: 12350,
          high: 4220,
          low: 4150,
        },
        {
          commodity: 'Wheat',
          grade: 'Grade 1 (Bread)',
          currentPrice: 6850,
          priceChange: 85,
          percentChange: 1.26,
          timestamp: new Date().toISOString(),
          volume: 8920,
          high: 6890,
          low: 6780,
        },
        {
          commodity: 'Sunflower',
          grade: 'Grade 1',
          currentPrice: 8950,
          priceChange: 220,
          percentChange: 2.52,
          timestamp: new Date().toISOString(),
          volume: 5640,
          high: 8980,
          low: 8750,
        },
        {
          commodity: 'Soybean',
          grade: 'Grade 1',
          currentPrice: 12450,
          priceChange: -180,
          percentChange: -1.42,
          timestamp: new Date().toISOString(),
          volume: 3280,
          high: 12580,
          low: 12350,
        },
      ];

      return mockPrices;
    } catch (error) {
      console.error('Error fetching current prices:', error);
      throw new Error('Failed to fetch current market prices');
    }
  }

  async getHistoricalPrices(_commodity: string, days: number = 365): Promise<HistoricalPrice[]> {
    try {
      const mockHistoricalData: HistoricalPrice[] = [];
      const basePrice = 4000;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        
        const volatility = 0.02;
        const trend = Math.sin(i / 30) * 0.001;
        const randomChange = (Math.random() - 0.5) * volatility;
        const priceMultiplier = 1 + trend + randomChange;
        
        mockHistoricalData.push({
          date: date.toISOString().split('T')[0],
          price: Math.round(basePrice * priceMultiplier),
          volume: Math.floor(Math.random() * 20000) + 5000,
        });
      }

      return mockHistoricalData;
    } catch (error) {
      console.error('Error fetching historical prices:', error);
      throw new Error('Failed to fetch historical price data');
    }
  }

  async getMarketRecommendation(commodity: string, currentInventory: number, storageCosts: number): Promise<MarketRecommendation> {
    try {
      const currentPrices = await this.getCurrentPrices();
      const historicalPrices = await this.getHistoricalPrices(commodity, 365);
      
      const currentPrice = currentPrices.find(p => p.commodity.toLowerCase().includes(commodity.toLowerCase()))?.currentPrice || 0;
      const avgHistoricalPrice = historicalPrices.reduce((sum, p) => sum + p.price, 0) / historicalPrices.length;
      const recentTrend = this.calculateTrend(historicalPrices.slice(-30));
      
      let action: 'HOLD' | 'SELL' | 'BUY' = 'HOLD';
      let confidence = 0;
      let reasoning = '';
      let projectedPrice = currentPrice;
      const factors: string[] = [];

      if (currentPrice > avgHistoricalPrice * 1.1) {
        action = 'SELL';
        confidence += 30;
        factors.push('Current price 10%+ above historical average');
      } else if (currentPrice < avgHistoricalPrice * 0.9) {
        action = 'BUY';
        confidence += 25;
        factors.push('Current price 10%+ below historical average');
      }

      if (recentTrend > 0.02) {
        if (action === 'SELL') confidence += 20;
        factors.push('Strong upward price trend (2%+ in 30 days)');
        projectedPrice = currentPrice * 1.05;
      } else if (recentTrend < -0.02) {
        if (action === 'HOLD') action = 'SELL';
        confidence += 15;
        factors.push('Downward price trend (-2%+ in 30 days)');
        projectedPrice = currentPrice * 0.95;
      }

      const monthlyCostPerTon = storageCosts / currentInventory;
      if (monthlyCostPerTon > currentPrice * 0.01) {
        if (action === 'HOLD') action = 'SELL';
        confidence += 15;
        factors.push('High storage costs (>1% of commodity value per month)');
      }

      const currentMonth = new Date().getMonth();
      if ([2, 3, 4].includes(currentMonth)) { // March-May (harvest season)
        if (action === 'SELL') confidence += 10;
        factors.push('Harvest season - typically higher supply');
      } else if ([8, 9, 10].includes(currentMonth)) { // Sep-Nov (planting season)
        if (action === 'HOLD' || action === 'BUY') confidence += 10;
        factors.push('Pre-planting season - typically higher demand');
      }

      confidence = Math.min(confidence, 95); // Cap confidence at 95%

      if (action === 'SELL') {
        reasoning = `Recommend selling ${commodity}. Market conditions favor immediate sale.`;
      } else if (action === 'BUY') {
        reasoning = `Consider purchasing more ${commodity}. Current prices are attractive.`;
      } else {
        reasoning = `Hold current ${commodity} inventory. Market conditions are neutral.`;
      }

      return {
        action,
        confidence,
        reasoning,
        projectedPrice,
        timeframe: '30-60 days',
        factors,
      };
    } catch (error) {
      console.error('Error generating market recommendation:', error);
      throw new Error('Failed to generate market recommendation');
    }
  }

  private calculateTrend(prices: HistoricalPrice[]): number {
    if (prices.length < 2) return 0;
    
    const firstPrice = prices[0].price;
    const lastPrice = prices[prices.length - 1].price;
    
    return (lastPrice - firstPrice) / firstPrice;
  }

  async getCommodityNews(_commodity?: string): Promise<any[]> {
    try {
      const mockNews = [
        {
          id: '1',
          title: 'South African Maize Exports Reach Record High',
          summary: 'Favorable weather conditions and strong international demand drive export growth.',
          timestamp: new Date().toISOString(),
          source: 'AgriNews SA',
          impact: 'positive',
        },
        {
          id: '2',
          title: 'Drought Concerns in Western Cape Affect Wheat Prices',
          summary: 'Limited rainfall in key wheat-producing regions raises supply concerns.',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          source: 'Farmer\'s Weekly',
          impact: 'negative',
        },
      ];

      return mockNews;
    } catch (error) {
      console.error('Error fetching commodity news:', error);
      return [];
    }
  }
}

export default new SaffexService();
