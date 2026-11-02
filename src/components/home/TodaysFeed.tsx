import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Droplet } from 'lucide-react-native';
import { useHomeStore, FeedItem } from '../../store/useHomeStore';
import { COLORS } from '../../constants/colors';

const FeedTimelineItem = ({ item, isLast }: { item: FeedItem, isLast: boolean }) => {
  return (
    <View style={styles.timelineRow}>
      {/* Left Timeline connecting line and dot */}
      <View style={styles.timelineLeft}>
        <View style={[
          styles.dot,
          item.type === 'critical' ? styles.dotCritical : item.type === 'alert' ? styles.dotAlert : styles.dotRoutine
        ]} />
        {!isLast && <View style={styles.line} />}
      </View>

      {/* Right Content */}
      <View style={[styles.card, item.type === 'alert' && styles.cardAlert]}>
        <View style={styles.cardHeader}>
          <Text style={styles.time}>{item.time}</Text>
          {item.tag && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{item.tag}</Text>
            </View>
          )}
        </View>
        <View style={styles.cardBody}>
          {item.type === 'alert' && (
             <View style={styles.alertIconWrapper}>
               <Droplet color="#1976D2" size={16} />
             </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{item.title}</Text>
            {item.description && <Text style={styles.description}>{item.description}</Text>}
          </View>
        </View>
      </View>
    </View>
  );
};

const TodaysFeed = () => {
  const { feeds } = useHomeStore();

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Today's Feed</Text>
      <View style={styles.timelineContainer}>
        {feeds.map((feed, index) => (
          <FeedTimelineItem key={feed.id} item={feed} isLast={index === feeds.length - 1} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E5631',
    marginBottom: 16,
  },
  timelineContainer: {
    paddingLeft: 4,
  },
  timelineRow: {
    flexDirection: 'row',
  },
  timelineLeft: {
    alignItems: 'center',
    width: 20,
    marginRight: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 16,
    zIndex: 1,
  },
  dotCritical: {
    backgroundColor: '#1E5631',
  },
  dotAlert: {
    backgroundColor: '#4285F4',
  },
  dotRoutine: {
    backgroundColor: '#9E9E9E',
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: '#E0E0E0',
    marginTop: -8,
    marginBottom: -16,
  },
  card: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  cardAlert: {
    backgroundColor: COLORS.white,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  time: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  tag: {
    backgroundColor: '#1E5631',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    color: COLORS.white,
    fontSize: 8,
    fontWeight: 'bold',
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  alertIconWrapper: {
    backgroundColor: '#E3F2FD',
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: COLORS.textLight,
  }
});

export default React.memo(TodaysFeed);
