export interface YieldData {
  value: number;
}

export interface Variety {
  variety_id: string;
  variety_name: string;
  duration_days: number;
  target_yield: YieldData;
}

export interface EstimatedProfit {
  expected_income_per_acre: number;
  profit_level: string;
}

export interface InputCost {
  investment_per_acre: number;
}

export interface FertilizerItem {
  name: string;
  source_type?: string;
  dosage_kg: number;
  cost: number;
}

export interface FertilizerOption {
  type: 'chemical' | 'bio';
  items: FertilizerItem[];
  total_cost: number;
}

export interface FertilizerRequirement {
  recommended_type: string;
  options: FertilizerOption[];
}

export interface RiskFactor {
  risk_score: number;
  risk_label: string;
  insurance_eligible: boolean;
  claim_amount_estimate: number;
}

export interface MarketDemand {
  level: string;
  note: string;
}

export interface CropDetail {
  recommended_variety_id: string;
  varieties: Variety[];
  estimated_profit: EstimatedProfit;
  input_cost: InputCost;
  fertilizer_requirement: FertilizerRequirement;
  risk_factor: RiskFactor;
  market_demand: MarketDemand;
  farming_tips: string[];
}

export interface CropItem {
  rank: number;
  crop_id: string;
  crop_name: string;
  image_url: string;
  highlight_tag: string;
  profit_level: string;
  expected_yield: YieldData;
  water_requirement: string;
  duration_days: number;
  detail: CropDetail;
}
