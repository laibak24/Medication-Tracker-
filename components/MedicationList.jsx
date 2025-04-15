import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import moment from 'moment';
import { getLocalStorage } from '@/service/Storage';
import { db } from '@/config/FirebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import EmptyState from '../components/EmptyState' 
const { width } = Dimensions.get('window');
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const medIcons = {
  Capsule: 'pill',
  Tablet: 'tablet',
  Syrup: 'bottle-tonic',
  Injection: 'needle',
};

export default function MedicationList() {
  const [medList, setMedList] = useState([]);
  const [currentMonth] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(moment.utc().startOf('day'));

  useEffect(() => {
    GetMedicationList(selectedDate.format('YYYY-MM-DD'));
  }, [selectedDate]);

  const generateMonthData = (baseDate) => {
    const monthStart = baseDate.clone().startOf('month');
    const monthEnd = baseDate.clone().endOf('month');
    const startDate = monthStart.clone().startOf('week');
    const endDate = monthEnd.clone().endOf('week');
    
    const days = [];
    let date = startDate.clone();
    
    while (date.isBefore(endDate)) {
      days.push({
        date: date.date(),
        formatted: date.format('YYYY-MM-DD'),
        isCurrentMonth: date.month() === baseDate.month(),
        isToday: date.isSame(moment(), 'day'),
        isSelected: date.isSame(selectedDate, 'day')
      });
      date = date.add(1, 'day');
    }
    return { days, month: baseDate.format('MMMM YYYY') };
  };

  const GetMedicationList = async (selectedDateISO) => {
    try {
      const user = await getLocalStorage('userDetail');
      if (!user?.email) return;
  
      const q = query(
        collection(db, 'medications'),
        where('userEmail', '==', user.email)
      );
  
      const querySnapshot = await getDocs(q);
      const filteredMeds = [];
      
      // Convert to UTC and normalize
      const selected = moment.utc(selectedDateISO).startOf('day');
  
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        
        // Parse dates as UTC and normalize
        const start = moment.utc(data.startDate).startOf('day');
        const end = moment.utc(data.endDate).endOf('day');
  
        //console.log('Comparing:', {
          //selected: selected.format(),
         // medication: `${start.format()} - ${end.format()}`,
         // matches: selected.isBetween(start, end, null, '[]')
        //});
  
        if (selected.isBetween(start, end, null, '[]')) {
          filteredMeds.push(data);
        }
      });
  
      //console.log('Filtered Medications:', filteredMeds);
      setMedList(filteredMeds);
    } catch (error) {
      console.error('Error fetching medications:', error);
    }
  };

  
  const renderDay = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.dayCell,
        !item.isCurrentMonth && styles.otherMonthDay,
        item.isSelected && styles.selectedDay,
        item.isToday && !item.isSelected && styles.todayDay
      ]}
      onPress={() => setSelectedDate(moment.utc(item.formatted, 'YYYY-MM-DD'))}
    >
      <Text style={[
        styles.dayText,
        !item.isCurrentMonth && styles.otherMonthText,
        item.isSelected && styles.selectedDayText,
        item.isToday && !item.isSelected && styles.todayText
      ]}>
        {item.date}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Calendar Section - Fixed Height */}
      <View style={styles.calendarContainer}>
        <Text style={styles.monthHeader}>
          {currentMonth.format('MMMM YYYY')}
        </Text>
        <View style={styles.daysHeader}>
          {daysOfWeek.map(day => (
            <Text key={day} style={styles.dayHeader}>{day}</Text>
          ))}
        </View>
        <FlatList
          data={generateMonthData(currentMonth).days}
          renderItem={renderDay}
          numColumns={7}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.daysGrid}
        />
      </View>

      {/* Medication List */}
      <View style={styles.listContainer}>
  {medList.length === 0 ? (
    <View style={styles.container}>
      <EmptyState />
    </View>
  ) : (
    <FlatList
      data={medList}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.medList}
      renderItem={({ item }) => (
          <View style={styles.medCard}>
            <MaterialCommunityIcons
              name={medIcons[item.medType] || 'pill'}
              size={40}
              color="#F44C61"
              style={styles.medIcon}
            />
            <View style={styles.medInfo}>
              <Text style={styles.medName}>{item.medName}</Text>
              <View style={styles.detailsRow}>
                <Text style={styles.medDetail}>{item.medType}</Text>
                <Text style={styles.medDetail}>•</Text>
                <Text style={styles.medDetail}>{item.dose} dose(s)</Text>
              </View>
              <View style={styles.detailsRow}>
                <Text style={styles.medDetail}>{item.mealTime}</Text>
                <Text style={styles.medDetail}>•</Text>
                <Text style={styles.medDetail}>{item.timeToTake}</Text>
              </View>
            </View>
          </View>
        )}
      />
  )}
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  calendarContainer: {
    height: 380, // Fixed height for calendar
    paddingHorizontal: 16,
  },
  listContainer: {
    flex: 1, // Takes remaining space
    backgroundColor: '#fff',
  },
  monthContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  monthHeader: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  daysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dayHeader: {
    width: (width - 40) / 7,
    textAlign: 'center',
    color: '#6B7280',
    fontWeight: '500',
    fontSize: 14,
  },
  daysGrid: {
    justifyContent: 'flex-start',
  },
  dayCell: {
    width: (width - 40) / 7,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 2,
  },
  dayText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  selectedDay: {
    backgroundColor: '#F44C61',
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  todayDay: {
    borderWidth: 2,
    borderColor: '#F44C61',
  },
  todayText: {
    color: '#F44C61',
    fontWeight: '700',
  },
  otherMonthDay: {
    opacity: 0.5,
  },
  otherMonthText: {
    color: '#9CA3AF',
  },
  medList: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  medListContainer: {
    flex: 1,
    backgroundColor: '#000000', // Temporary to verify visibility
  },
  medCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  medIcon: {
    marginRight: 16,
  },
  medInfo: {
    flex: 1,
  },
  medName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  medDetail: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 8,
  },
});