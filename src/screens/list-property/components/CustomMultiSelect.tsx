import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Pressable,
  TextInput,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { ChevronDown, ChevronUp, X, Search } from 'lucide-react-native';

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
  value = [],
  options,
  onChange,
  onBlur,
  error = false,
}) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 480;
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef<View>(null);

  const filteredOptions = (options || []).filter(option =>
    (option.label || '').toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selectedOptions = (value || []).map(val => {
    const opt = (options || []).find(o => o.value === val);
    return opt ? opt : { label: String(val), value: val };
  });

  const handleSelect = (optionValue: string | number) => {
    let newValue;
    if (value.includes(optionValue)) {
      newValue = value.filter(v => v !== optionValue);
    } else {
      newValue = [...value, optionValue];
    }
    onChange(newValue);
  };

  const handleRemoveChip = (optionValue: string | number) => {
    onChange(value.filter(v => v !== optionValue));
  };

  const handleToggle = () => {
    if (!isOpen) {
      containerRef.current?.measureInWindow((x, y, w, h) => {
        setDropdownPos({ top: y + h + 5, left: x, width: w });
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
        style={[
          styles.dropdown,
          error && styles.dropdownError,
          isOpen && styles.dropdownOpen,
          value.length > 0 && styles.dropdownWithChips,
        ]}
        onPress={handleToggle}
        activeOpacity={0.8}
      >
        {value.length > 0 ? (
          <View style={styles.chipsContainer}>
            {selectedOptions.map(opt => (
              <View key={String(opt.value)} style={styles.chip}>
                <Text
                  style={[styles.chipText, isMobile && styles.chipTextMobile]}
                  numberOfLines={1}
                >
                  {opt.label}
                </Text>
                <TouchableOpacity
                  onPress={e => {
                    e.stopPropagation?.();
                    handleRemoveChip(opt.value);
                  }}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  style={styles.chipClose}
                >
                  <X size={14} color="#FFF" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <Text
            style={[
              styles.dropdownText,
              isMobile && styles.dropdownTextMobile,
              styles.placeholderText,
            ]}
            numberOfLines={1}
          >
            {placeholder}
          </Text>
        )}
        {isOpen ? (
          <ChevronUp size={20} color="#999" />
        ) : (
          <ChevronDown size={20} color="#999" />
        )}
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        <View
          style={[
            styles.popoverContent,
            {
              top: dropdownPos.top,
              left: dropdownPos.left,
              width: dropdownPos.width,
            },
          ]}
        >
          <View style={styles.searchContainer}>
            <Search size={18} color="#999" style={styles.searchIcon} />
            <TextInput
              style={[
                styles.searchInput,
                isMobile && styles.searchInputMobile,
                Platform.OS === 'web' && ({ outlineStyle: 'none' } as any),
              ]}
              placeholder="Search..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
              autoFocus
            />
          </View>

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
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
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
    minHeight: 44,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dropdownOpen: {
    borderColor: '#EE2529',
  },
  dropdownWithChips: {
    paddingVertical: 6,
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
  dropdownTextMobile: {
    fontSize: 14,
  },
  placeholderText: {
    color: '#999',
  },
  chipsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EE2529',
    borderRadius: 16,
    paddingLeft: 10,
    paddingRight: 6,
    paddingVertical: 4,
    maxWidth: 200,
  },
  chipText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '500',
    marginRight: 6,
    fontFamily: 'Montserrat',
  },
  chipTextMobile: {
    fontSize: 12,
  },
  chipClose: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
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
  searchInputMobile: {
    fontSize: 14,
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
  emptyContainer: {
    padding: 24,
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
