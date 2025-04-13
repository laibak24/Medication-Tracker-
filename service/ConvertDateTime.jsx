import { View, Text } from 'react-native';
import React from 'react';
import moment from 'moment'; // Make sure moment is installed

export default function ConvertDateTime() {
  return (
    <View>
      <Text>ConvertDateTime</Text>
    </View>
  );
}

export const GetDateRangeToDisplay = () => {
  const dateList = [];
  for (let i = 0; i <= 7; i++) {
    dateList.push({
      date: moment().add(i, 'days').format('DD'),
      day: moment().add(i, 'days').format('dd'),
      FormattedDate: moment().add(i, 'days').format('L'),
    });
  }
  return dateList;
};
