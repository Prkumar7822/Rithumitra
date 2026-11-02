import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, Calendar, TrendingUp, Droplet, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useCropStore } from '../store/useCropStore';
import { COLORS } from '../constants/colors';

const CropDetailsScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { recommendations } = useCropStore();
  
  const cropId = route.params?.cropId;
  const crop = useMemo(() => recommendations.find(c => c.crop_id === cropId) || recommendations[0], [cropId, recommendations]);

  if (!crop) return null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.headerAbsolute}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <ArrowLeft color={COLORS.primary} size={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <Bell color={COLORS.primary} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Image source={{ uri: crop.image_url }} style={styles.heroImage} />
        
        <View style={styles.contentContainer}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{crop.highlight_tag}</Text>
          </View>
          <Text style={styles.title}>{crop.crop_name}</Text>
          <Text style={styles.subtitle}>{crop.detail.varieties[0].variety_name}</Text>

          {/* Growth Insights */}
          <Text style={styles.sectionTitle}>Growth Insights</Text>
          <View style={styles.insightsRow}>
            <View style={styles.insightCard}>
              <Calendar color={COLORS.primary} size={20} />
              <Text style={styles.insightLabel}>Duration</Text>
              <Text style={styles.insightValue}>{crop.duration_days} Days</Text>
            </View>
            <View style={styles.insightCard}>
              <TrendingUp color={COLORS.primary} size={20} />
              <Text style={styles.insightLabel}>Yield</Text>
              <Text style={styles.insightValue}>{crop.expected_yield.value} q/acre</Text>
            </View>
            <View style={styles.insightCard}>
              <Droplet color={COLORS.primary} size={20} />
              <Text style={styles.insightLabel}>Water</Text>
              <Text style={styles.insightValue}>{crop.water_requirement}</Text>
            </View>
          </View>

          {/* Additional details */}
          <View style={styles.listCard}>
            <ShieldCheck color="#1A4D2E" size={24} />
            <View style={styles.listCardText}>
              <Text style={styles.listCardTitle}>High Market Demand</Text>
              <Text style={styles.listCardSub}>{crop.detail.market_demand.note}</Text>
            </View>
          </View>

          <View style={styles.listCard}>
            <CheckCircle2 color="#1A4D2E" size={24} />
            <View style={styles.listCardText}>
              <Text style={styles.listCardTitle}>Good Yield</Text>
              <Text style={styles.listCardSub}>Average {crop.expected_yield.value} quintals per acre</Text>
            </View>
          </View>

          {/* Financials */}
          <Text style={styles.sectionTitle}>Estimated Financials</Text>
          <View style={styles.financeRow}>
            <View style={[styles.financeCard, styles.financeInvestment]}>
              <Text style={styles.financeLabel}>Investment</Text>
              <Text style={styles.financeValueInvestment}>?{crop.detail.input_cost.investment_per_acre.toLocaleString()}</Text>
              <Text style={styles.financeSub}>per acre</Text>
            </View>
            <View style={[styles.financeCard, styles.financeIncome]}>
              <Text style={styles.financeLabel}>Expected Income</Text>
              <Text style={styles.financeValueIncome}>?{crop.detail.estimated_profit.expected_income_per_acre.toLocaleString()}</Text>
              <Text style={styles.financeSub}>per acre</Text>
            </View>
          </View>

          {/* Fertilizers */}
          <Text style={styles.sectionTitle}>Chemical Fertilizers</Text>
          {crop.detail.fertilizer_requirement.options.find(o => o.type === 'chemical')?.items.map((item, index) => (
            <View key={index} style={styles.fertilizerItem}>
              <View>
                <Text style={styles.fertSource}>{item.source_type?.toUpperCase()}</Text>
                <Text style={styles.fertName}>{item.name}</Text>
                <Text style={styles.fertDosage}>{item.dosage_kg} kg</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.fertCostLabel}>Cost</Text>
                <Text style={styles.fertCostValue}>?{item.cost.toLocaleString()}</Text>
              </View>
            </View>
          ))}

          <Text style={styles.sectionTitle}>Bio-Fertilizers</Text>
          {crop.detail.fertilizer_requirement.options.find(o => o.type === 'bio')?.items.map((item, index) => (
            <View key={index} style={styles.fertilizerItem}>
              <View>
                <Text style={styles.fertName}>{item.name}</Text>
                <Text style={styles.fertDosage}>{item.dosage_kg} kg</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.fertCostLabel}>Cost</Text>
                <Text style={styles.fertCostValue}>?{item.cost.toLocaleString()}</Text>
              </View>
            </View>
          ))}

          {/* Farming Tips */}
          <Text style={styles.sectionTitle}>Farming Tips</Text>
          {crop.detail.farming_tips.map((tip, index) => (
            <View key={index} style={styles.tipRow}>
              <MapPin color={COLORS.primary} size={16} style={{ marginTop: 2, marginRight: 8 }} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}

        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.startBtn} activeOpacity={0.8}>
          <Text style={styles.startBtnText}>Start Cultivation</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerAbsolute: {
    position: 'absolute',
    top: 40, // rough safe area margin
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  iconBtn: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    padding: 8,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  heroImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 20,
    marginTop: -20,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  tag: {
    backgroundColor: '#FFE0B2',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  tagText: {
    color: '#E65100',
    fontWeight: 'bold',
    fontSize: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginTop: 16,
    marginBottom: 12,
  },
  insightsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  insightCard: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
  },
  insightLabel: {
    fontSize: 10,
    color: COLORS.textLight,
    marginTop: 8,
    marginBottom: 4,
  },
  insightValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  listCardText: {
    marginLeft: 16,
  },
  listCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  listCardSub: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  financeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  financeCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  financeInvestment: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FFE0B2',
    marginRight: 8,
  },
  financeIncome: {
    backgroundColor: '#E8F5E9',
    borderColor: '#C8E6C9',
    marginLeft: 8,
  },
  financeLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  financeValueInvestment: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D84315',
  },
  financeValueIncome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  financeSub: {
    fontSize: 10,
    color: COLORS.textLight,
  },
  fertilizerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  fertSource: {
    fontSize: 10,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  fertName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  fertDosage: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  fertCostLabel: {
    fontSize: 10,
    color: COLORS.textLight,
  },
  fertCostValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D84315',
  },
  tipRow: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textDark,
    lineHeight: 18,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  startBtn: {
    backgroundColor: '#1A4D2E',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  startBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default CropDetailsScreen;
