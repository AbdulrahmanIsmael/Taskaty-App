import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../../../../theme/colors';

interface TaskSchedulePickerProps {
  date: Date | undefined;
  onDateChange: (date: Date) => void;
}

export function TaskSchedulePicker({ date, onDateChange }: TaskSchedulePickerProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDateSelect = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const currentDate = date || new Date();
      selectedDate.setHours(currentDate.getHours());
      selectedDate.setMinutes(currentDate.getMinutes());
      onDateChange(selectedDate);
    }
  };

  const handleTimeSelect = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = date ? new Date(date) : new Date();
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      onDateChange(newDate);
    }
  };

  return (
    <View>
      <View style={styles.dateContainer}>
        <TouchableOpacity 
          style={styles.dateButton} 
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons name="calendar-outline" size={20} color={colors.primary} />
          <Text style={styles.dateText}>
            {date ? date.toLocaleDateString() : 'Add Date'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.dateButton} 
          onPress={() => setShowTimePicker(true)}
        >
          <Ionicons name="time-outline" size={20} color={colors.primary} />
          <Text style={styles.dateText}>
            {date ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Add Time'}
          </Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={date || new Date()}
          mode="date"
          display="default"
          onValueChange={handleDateSelect}
          onDismiss={() => setShowDatePicker(false)}
          onNeutralButtonPress={() => setShowDatePicker(false)}
        />
      )}
      
      {showTimePicker && (
        <DateTimePicker
          value={date || new Date()}
          mode="time"
          display="default"
          onValueChange={handleTimeSelect}
          onDismiss={() => setShowTimePicker(false)}
          onNeutralButtonPress={() => setShowTimePicker(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dateContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: colors.gray50,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 12,
    gap: 8,
  },
  dateText: {
    fontSize: 14,
    color: colors.gray900,
    fontWeight: '500',
  },
});
