import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import moment from 'moment';
import { GetDateRangeToDisplay } from './../service/ConvertDateTime';
import { getLocalStorage } from '@/service/Storage';
import { db } from '@/config/FirebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Icon mapping based on medicine type
const medIcons = {
  Capsule: 'pill',
  Tablet: 'tablet',
  Syrup: 'bottle-tonic',
  Injection: 'needle',
};

export default function MedicationList() {
  const [medList, setMedList] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [selectedDate, setSelectedDate] = useState(moment().format('MM/DD/YYYY'));

  useEffect(() => {
    GetDateRangeList();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      GetMedicationList(selectedDate);
    }
  }, [selectedDate]);

  const GetDateRangeList = () => {
    const range = GetDateRangeToDisplay();
    setDateRange(range);
  };

  const GetMedicationList = async (selectedDate) => {
    try {
      const user = await getLocalStorage('userDetail');
      if (!user?.email) {
        console.warn('User email not found');
        return;
      }

      const q = query(
        collection(db, 'medications'),
        where('userEmail', '==', user.email)
      );

      const querySnapshot = await getDocs(q);
      const filteredMeds = [];
      const selected = moment(selectedDate, 'MM/DD/YYYY');

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const start = moment(data.startDate);
        const end = moment(data.endDate);

        if (selected.isSameOrAfter(start, 'day') && selected.isSameOrBefore(end, 'day')) {
          filteredMeds.push(data);
        }
      });

      setMedList(filteredMeds);
    } catch (error) {
      console.error('Error fetching medication list:', error);
    }
  };

  const renderDateItem = ({ item }) => {
    const isSelected = item.FormattedDate === selectedDate;
    return (
      <TouchableOpacity
        onPress={() => setSelectedDate(item.FormattedDate)}
        style={[styles.dateItem, isSelected && styles.selectedDateItem]}
      >
        <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>{item.day}</Text>
        <Text style={[styles.dateText, isSelected && styles.selectedDateText]}>{item.date}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Medication List</Text>

      <FlatList
        data={dateRange}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderDateItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.dateListContainer}
      />

      <FlatList
        data={medList}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => (
          <View style={styles.medCard}>
            <MaterialCommunityIcons
              name={medIcons[item.medType] || 'pill'}
              size={36}
              color="#F44C61"
              style={styles.medIcon}
            />
            <View style={styles.medInfo}>
              <Text style={styles.medName}>{item.medName}</Text>
              <Text style={styles.medDetail}>
                {item.medType} • {item.dose} dose(s)
              </Text>
              <Text style={styles.medDetail}>
                {item.mealTime} • {item.timeToTake}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  dateListContainer: {
    paddingVertical: 8,
    marginBottom: 16,
  },
  dateItem: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 24,
    backgroundColor: '#f2f2f2',
    marginRight: 10,
    minWidth: 60,
  },
  selectedDateItem: {
    backgroundColor: '#F44C61',
  },
  dayText: {
    fontSize: 12,
    color: '#555',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  selectedDayText: {
    color: '#fff',
  },
  selectedDateText: {
    color: '#fff',
  },
  medCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef6f6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
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
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  medDetail: {
    fontSize: 14,
    color: '#666',
  },
  medDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
  },
});
