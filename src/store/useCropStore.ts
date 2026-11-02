import { create } from 'zustand';
import { CropItem } from '../models/cropTypes';

interface CropState {
  recommendations: CropItem[];
  isIntercropping: boolean;
  setIsIntercropping: (value: boolean) => void;
  selectedCrop: CropItem | null;
  setSelectedCrop: (crop: CropItem | null) => void;
}

const mockRecommendations: CropItem[] = [
  {
    rank: 1,
    crop_id: 'CROP-012',
    crop_name: 'Paddy',
    image_url: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&q=80&w=800',
    highlight_tag: 'Perfect Match',
    profit_level: 'High',
    expected_yield: { value: 25 },
    water_requirement: 'High',
    duration_days: 120,
    detail: {
      recommended_variety_id: 'VAR-101',
      varieties: [
        { variety_id: 'VAR-101', variety_name: 'BPT 5204', duration_days: 120, target_yield: { value: 25 } },
        { variety_id: 'VAR-102', variety_name: 'MTU 1010', duration_days: 130, target_yield: { value: 28 } }
      ],
      estimated_profit: { expected_income_per_acre: 95000, profit_level: 'High' },
      input_cost: { investment_per_acre: 45000 },
      fertilizer_requirement: {
        recommended_type: 'chemical',
        options: [
          {
            type: 'chemical',
            items: [
              { name: 'Urea', source_type: 'Nitrogen source', dosage_kg: 90, cost: 2160 },
              { name: 'MOP', source_type: 'Potassium source', dosage_kg: 40, cost: 1520 },
              { name: 'SSP', source_type: 'Phosphorus source', dosage_kg: 60, cost: 1450 }
            ],
            total_cost: 5130
          },
          {
            type: 'bio',
            items: [
              { name: 'Azospirillum', dosage_kg: 2.0, cost: 560 },
              { name: 'PSB', dosage_kg: 2.0, cost: 480 },
              { name: 'Trichoderma', dosage_kg: 2.0, cost: 600 }
            ],
            total_cost: 1640
          }
        ]
      },
      risk_factor: { risk_score: 0.22, risk_label: 'Low', insurance_eligible: true, claim_amount_estimate: 12000 },
      market_demand: { level: 'High', note: 'Stable pricing in local markets' },
      farming_tips: [
        'Keep water depth at 5-10cm during the vegetative phase.',
        'Use organic fertilizers like vermicompost for better quality.'
      ]
    }
  },
  {
    rank: 2,
    crop_id: 'CROP-045',
    crop_name: 'Tomato',
    image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800',
    highlight_tag: 'Best for Season',
    profit_level: 'Very High',
    expected_yield: { value: 15 },
    water_requirement: 'Medium',
    duration_days: 90,
    detail: {
      recommended_variety_id: 'VAR-201',
      varieties: [
        { variety_id: 'VAR-201', variety_name: 'Arka Rakshak', duration_days: 90, target_yield: { value: 15 } }
      ],
      estimated_profit: { expected_income_per_acre: 180000, profit_level: 'Very High' },
      input_cost: { investment_per_acre: 62000 },
      fertilizer_requirement: {
        recommended_type: 'chemical',
        options: [
          {
            type: 'chemical',
            items: [
              { name: 'Urea', source_type: 'Nitrogen source', dosage_kg: 110, cost: 2640 },
              { name: 'MOP', source_type: 'Potassium source', dosage_kg: 80, cost: 3040 },
              { name: 'SSP', source_type: 'Phosphorus source', dosage_kg: 90, cost: 2175 }
            ],
            total_cost: 7855
          },
          {
            type: 'bio',
            items: [
              { name: 'Azospirillum', dosage_kg: 2.5, cost: 700 },
              { name: 'PSB', dosage_kg: 2.5, cost: 600 }
            ],
            total_cost: 1300
          }
        ]
      },
      risk_factor: { risk_score: 0.41, risk_label: 'Medium', insurance_eligible: true, claim_amount_estimate: 18000 },
      market_demand: { level: 'High', note: 'Price volatile but demand strong in season' },
      farming_tips: [
        'Stake plants early to prevent fruit rot.',
        'Apply mulch to retain soil moisture.'
      ]
    }
  }
];

export const useCropStore = create<CropState>((set) => ({
  recommendations: mockRecommendations,
  isIntercropping: false,
  setIsIntercropping: (value) => set({ isIntercropping: value }),
  selectedCrop: null,
  setSelectedCrop: (crop) => set({ selectedCrop: crop }),
}));
