import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, Image, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { auth, db } from '@/config/FirebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { getLocalStorage } from '@/service/Storage';
import moment from 'moment';

const { width } = Dimensions.get('window');

const COLORS = {
  DRED: '#F44C61',
  DBLUE: '#003049',
  TEXT_PRIMARY: '#1F2937',
  TEXT_SECONDARY: '#6B7280',
  BACKGROUND: '#F9FAFB',
  WHITE: '#FFFFFF',
  BORDER: '#E5E7EB',
};

const medIcons = {
  Capsule: 'pill',
  Tablet: 'tablet',
  Syrup: 'bottle-tonic',
  Injection: 'needle',
};

export default function Profile() {
  const router = useRouter();
  const user = auth.currentUser;
  const [currentMeds, setCurrentMeds] = useState([]);
  const [medHistory, setMedHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(moment.utc().startOf('day'));

  useEffect(() => {
    fetchCurrentMeds();
    fetchMedications();
  }, []);

  useEffect(() => {
    fetchMedications();
  }, [selectedDate]);

  const fetchMedications = async () => {
    try {
      const userData = await getLocalStorage('userDetail');
      if (!userData?.email) return;

      const q = query(collection(db, 'medications'), where('userEmail', '==', userData.email));
      const querySnapshot = await getDocs(q);
      const meds = [];
      const selected = moment.utc(selectedDate).format('YYYY-MM-DD');

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const start = moment.utc(data.startDate).startOf('day');
        const end = moment.utc(data.endDate).endOf('day');
        const statusMap = data.statusMap || {};

        if (selectedDate.isBetween(start, end, null, '[]')) {
          meds.push({
            id: docSnap.id,
            ...data,
            status: (statusMap[selected] || '').toLowerCase(),
          });
        }
      });

      setMedHistory(meds);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching medications:', error);
      setLoading(false);
    }
  };

  const fetchCurrentMeds = async () => {
    try {
      const userData = await getLocalStorage('userDetail');
      if (!userData?.email) return;

      const q = query(collection(db, 'medications'), where('userEmail', '==', userData.email));
      const querySnapshot = await getDocs(q);
      const now = moment.utc();
      const current = [];

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const endDate = moment.utc(data.endDate);

        if (now.isBefore(endDate)) {
          current.push({ id: docSnap.id, ...data, status: 'active' });
        }
      });

      setCurrentMeds(current);
    } catch (error) {
      console.error('Error fetching current meds:', error);
    }
  };

  const last7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      days.push(moment.utc().subtract(i, 'days').startOf('day'));
    }
    return days;
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login/Signin');
    } catch (error) {
      console.error('Logout failed: ', error.message);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'taken':
        return <MaterialIcons name="check-circle" size={20} color="green" style={styles.statusIcon} />;
      case 'missed':
        return <MaterialIcons name="cancel" size={20} color={COLORS.DRED} style={styles.statusIcon} />;
      default:
        return <MaterialIcons name="help-outline" size={20} color="#9CA3AF" style={styles.statusIcon} />;
    }
  };

  const renderDayButton = (day) => (
    <TouchableOpacity
      key={day.format('YYYY-MM-DD')}
      style={[
        styles.dayButton,
        selectedDate.isSame(day, 'day') && styles.selectedDayButton
      ]}
      onPress={() => setSelectedDate(day)}
    >
      <Text style={[
        styles.dayText,
        selectedDate.isSame(day, 'day') && styles.selectedDayText
      ]}>
        {day.format('D')}
      </Text>
    </TouchableOpacity>
  );

  const renderMedicationItem = ({ item }) => (
    <View style={styles.medCard}>
      <MaterialCommunityIcons
        name={medIcons[item.medType] || 'pill'}
        size={30}
        color={COLORS.DRED}
        style={styles.medIcon}
      />
      <View style={styles.medInfo}>
        <Text style={styles.medName}>{item.medName}</Text>
        <Text style={styles.medDetail}>
          {item.dose} dose(s) • {item.mealTime} • {item.timeToTake}
        </Text>
      </View>
    </View>
  );

  const renderHistoryItem = ({ item }) => (
    <View style={styles.medCard}>
      {getStatusIcon(item.status)}
      <MaterialCommunityIcons
        name={medIcons[item.medType] || 'pill'}
        size={30}
        color={COLORS.DBLUE}
        style={styles.medIcon}
      />
      <View style={styles.medInfo}>
        <Text style={styles.medName}>{item.medName}</Text>
        <Text style={styles.medDetail}>
          {item.dose} dose(s) • {item.mealTime} • {item.timeToTake}
        </Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileCard}>
        {user?.photoURL ? (
          <Image source={{ uri: user.photoURL }} style={styles.avatar} />
        ) : (
          <FontAwesome name="user-circle" size={80} color={COLORS.DBLUE} />
        )}
        <Text style={styles.userName}>{user?.displayName || 'User Name'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <MaterialIcons name="logout" size={20} color={COLORS.DRED} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Medications</Text>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : currentMeds.length > 0 ? (
          <FlatList
            data={currentMeds}
            renderItem={renderMedicationItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.emptyText}>No current medications</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Medication History (Last 7 Days)</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysScroll}>
          {last7Days().map(day => renderDayButton(day))}
        </ScrollView>

        {loading ? (
          <Text style={styles.loadingText}>Loading history...</Text>
        ) : medHistory.length > 0 ? (
          <FlatList
            data={medHistory}
            renderItem={renderHistoryItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.emptyText}>No records for this day</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.BACKGROUND, padding: 16 },

  profileCard: {
    backgroundColor: COLORS.WHITE,
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 12 },
  userName: { fontSize: 22, fontWeight: '700', color: COLORS.TEXT_PRIMARY },
  userEmail: { fontSize: 14, color: COLORS.TEXT_SECONDARY, marginBottom: 12 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
  },
  logoutText: { fontSize: 16, fontWeight: '600', color: COLORS.DRED, marginLeft: 8 },

  section: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.TEXT_PRIMARY, marginBottom: 12 },

  medCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomColor: COLORS.BORDER, borderBottomWidth: 1 },
  medIcon: { marginHorizontal: 10 },
  medInfo: { flex: 1 },
  medName: { fontSize: 16, fontWeight: '600', color: COLORS.TEXT_PRIMARY },
  medDetail: { fontSize: 13, color: COLORS.TEXT_SECONDARY, marginTop: 2 },
  statusIcon: { marginRight: 8 },

  dayButton: {
    width: (width - 64) / 7,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  selectedDayButton: { backgroundColor: COLORS.DRED, borderColor: COLORS.DRED },
  dayText: { fontSize: 14, fontWeight: '600', color: COLORS.TEXT_PRIMARY },
  selectedDayText: { color: COLORS.WHITE },
  daysScroll: { marginBottom: 12, marginTop: 8 },

  emptyText: { fontSize: 14, color: COLORS.TEXT_SECONDARY, textAlign: 'center', paddingVertical: 12 },
  loadingText: { fontSize: 14, color: COLORS.TEXT_SECONDARY, textAlign: 'center', paddingVertical: 12 },
});
