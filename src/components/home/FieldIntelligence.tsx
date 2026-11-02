import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight, Droplet, FlaskConical, Bug } from 'lucide-react-native';
import { useHomeStore, FieldAlert } from '../../store/useHomeStore';
import { COLORS } from '../../constants/colors';

const getIconAndColor = (priority: string) => {
  switch (priority) {
    case 'Red': return { Icon: Bug, color: '#D32F2F', bg: '#FFEAEA' };
    case 'Orange': return { Icon: FlaskConical, color: '#F57C00', bg: '#FFF3E0' };
    case 'Amber': return { Icon: Droplet, color: '#1976D2', bg: '#E3F2FD' }; // Based on image, amber has blue icon in the image? Actually, Amber in image shows a droplet with blueish tint. We'll stick to a blueish tint.
    default: return { Icon: Droplet, color: '#1976D2', bg: '#E3F2FD' };
  }
};

const FieldIntelligence = () => {
  const { alerts } = useHomeStore();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Field Intelligence</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {alerts.map((alert: FieldAlert) => {
        const { Icon, color, bg } = getIconAndColor(alert.priority);
        return (
          <TouchableOpacity key={alert.id} style={styles.card} activeOpacity={0.7}>
            <View style={[styles.iconWrapper, { backgroundColor: bg }]}>
              <Icon color={color} size={20} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{alert.title}</Text>
              <Text style={styles.subtitle}>{alert.timeAgo} • Priority {alert.priority}</Text>
            </View>
            <ChevronRight color={COLORS.textLight} size={20} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E5631',
  },
  viewAll: {
    fontSize: 12,
    color: '#1E5631',
    textDecorationLine: 'underline',
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: COLORS.textLight,
  }
});

export default React.memo(FieldIntelligence);
