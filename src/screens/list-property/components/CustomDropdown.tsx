import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  TextInput,
  Pressable,
  Dimensions,
} from 'react-native';
import { ChevronDown, X, Search } from 'lucide-react-native';

interface Option {
  label: string;
  value: string;
}

interface CustomDropdownProps {
  placeholder: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  onBlur?: () => void;
  searchable?: boolean;
  error?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  placeholder,
  value,
  options,
  onChange,
  onBlur,
  searchable = false,
  error = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  
  const containerRef = useRef<View>(null);

  const selectedOption = options.find(opt => opt.value === value);

  const filteredOptions = searchable
    ? options.filter(opt =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : options;

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleToggle = () => {
    if (!isOpen) {
      containerRef.current?.measureInWindow((x, y, width, height) => {
        setDropdownPos({ top: y + height + 5, left: x, width });
        setIsOpen(true);
      });
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery('');
    if (onBlur) onBlur();
  };

  return (
    <View ref={containerRef} style={styles.container}>
      <TouchableOpacity
        style={[styles.dropdown, error && styles.dropdownError]}
        onPress={handleToggle}
      >
        <Text
          style={[
            styles.dropdownText,
            !selectedOption && styles.placeholderText,
          ]}
          numberOfLines={1}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <ChevronDown size={20} color="#999" />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <Pressable 
          style={StyleSheet.absoluteFill} 
          onPress={handleClose} 
        />
        <View
          style={[
            styles.popoverContent,
            {
              top: dropdownPos.top,
              left: dropdownPos.left,
              width: dropdownPos.width,
            }
          ]}
        >
            {/* Search */}
            {searchable && (
              <View style={styles.searchContainer}>
                <Search size={18} color="#999" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor="#999"
                />
              </View>
            )}

            {/* Options List */}
            <FlatList
              data={filteredOptions}
              keyExtractor={item => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    item.value === value && styles.optionSelected,
                  ]}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item.value === value && styles.optionTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.value === value && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              )}
              style={styles.optionsList}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
            />
          </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
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
    backgroundColor: '#FFF5F5',
  },
  dropdownText: {
    fontSize: 18,
    color: '#333',
    flex: 1,
    fontFamily: 'Montserrat',
  },
  placeholderText: {
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  popoverContent: {
    position: 'absolute',
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    maxHeight: 300,
    overflow: 'hidden',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    margin: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    height: 36,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    color: '#333',
    paddingVertical: 5,
    fontFamily: 'Montserrat',
  },
  optionsList: {
    maxHeight: 250,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
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
    fontFamily: 'Montserrat',
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
});

export default CustomDropdown;
