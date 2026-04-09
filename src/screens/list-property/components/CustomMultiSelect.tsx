import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Pressable,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import { ChevronDown, X, Search } from 'lucide-react-native';

interface Option {
  label: string;
  value: string | number;
}

interface CustomMultiSelectProps {
  placeholder: string;
  value: (string | number)[];
  options: Option[];
  onChange: (value: (string | number)[]) => void;
  onBlur?: () => void;
  error?: boolean;
}

const CustomMultiSelect: React.FC<CustomMultiSelectProps> = ({
  placeholder,
  value = [], // Default to empty array to prevent undefined issues
  options,
  onChange,
  onBlur,
  error = false,
}) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 480;
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter options based on search query
  const filteredOptions = (options || []).filter(option =>
    (option.label || '').toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Derive selected labels
  const selectedLabels = (value || [])
    .map(val => (options || []).find(opt => opt.value === val)?.label || val)
    .join(', ');

  const handleSelect = (optionValue: string | number) => {
    let newValue;
    if (value.includes(optionValue)) {
      newValue = value.filter(v => v !== optionValue);
    } else {
      newValue = [...value, optionValue];
    }
    onChange(newValue);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery('');
    if (onBlur) onBlur();
  };

  return (
    <View>
      <TouchableOpacity
        style={[styles.dropdown, error && styles.dropdownError]}
        onPress={() => setIsOpen(true)}
      >
        <Text
          style={[
            styles.dropdownText,
            isMobile && styles.dropdownTextMobile,
            value.length === 0 && styles.placeholderText,
          ]}
          numberOfLines={1}
        >
          {value.length > 0 ? selectedLabels : placeholder}
        </Text>
        <ChevronDown size={20} color="#999" />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <Pressable style={styles.modalOverlay} onPress={handleClose}>
          <Pressable
            style={styles.modalContent}
            onPress={e => e.stopPropagation()}
          >
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{placeholder}</Text>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
              >
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Search size={18} color="#999" style={styles.searchIcon} />
              <TextInput
                style={[styles.searchInput, isMobile && styles.searchInputMobile]}
                placeholder="Search..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                clearButtonMode="while-editing"
              />
            </View>

            {/* Options List */}
            <FlatList
              data={filteredOptions}
              keyExtractor={item => String(item.value)}
              renderItem={({ item }) => {
                const isSelected = value.includes(item.value);
                return (
                  <TouchableOpacity
                    style={[styles.option, isSelected && styles.optionSelected]}
                    onPress={() => handleSelect(item.value)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isMobile && styles.optionTextMobile,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                    {isSelected && (
                      <View style={styles.checkmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    {searchQuery ? 'No matches found' : 'No options available'}
                  </Text>
                </View>
              }
              style={styles.optionsList}
              showsVerticalScrollIndicator={false}
            />

            <TouchableOpacity style={styles.doneButton} onPress={handleClose}>
              <Text style={styles.doneButtonText}>Close</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: '#F2F2F2',
    height: 44,
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dropdownError: {
    borderColor: '#EE2529',
  },
  dropdownText: {
    fontSize: 18,
    color: '#333',
    flex: 1,
  },
  dropdownTextMobile: {
    fontSize: 14,
  },
  placeholderText: {
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  optionsList: {
    maxHeight: 400,
    minHeight: 100,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  optionSelected: {
    backgroundColor: '#FFEBEE',
  },
  optionText: {
    fontSize: 18,
    color: '#333',
    flex: 1,
  },
  optionTextMobile: {
    fontSize: 14,
  },
  optionTextSelected: {
    color: '#EE2529',
    fontWeight: '600',
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EE2529',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  doneButton: {
    backgroundColor: '#EE2529',
    padding: 12,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 18,
    color: '#333',
    padding: 0,
  },
  searchInputMobile: {
    fontSize: 14,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
    fontFamily: 'Montserrat',
  },
});

export default CustomMultiSelect;
