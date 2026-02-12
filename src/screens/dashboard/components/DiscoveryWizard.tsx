import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import {
  Building2,
  Percent,
  Home,
  DollarSign,
  User,
  Clock,
  LucideProps,
} from 'lucide-react-native';

interface Step {
  id: string;
  label: string;
  Icon: React.FC<LucideProps>;
}

const STEPS: Step[] = [
  { id: '1', label: 'Cities', Icon: Building2 },
  { id: '2', label: 'Annual Returns', Icon: Percent },
  { id: '3', label: 'Property Type', Icon: Home },
  { id: '4', label: 'Budget', Icon: DollarSign },
  { id: '5', label: 'Tenant Type', Icon: User },
  { id: '6', label: 'Tenure Left', Icon: Clock },
];

const StepCard = ({
  item,
  active,
  onPress,
}: {
  item: Step;
  active: boolean;
  onPress: () => void;
}) => {
  const IconComponent = item.Icon;
  return (
    <TouchableOpacity
      style={[styles.stepCard, active && styles.stepCardActive]}
      onPress={onPress}
    >
      <IconComponent
        size={32}
        color={active ? '#D32F2F' : '#666'}
        strokeWidth={1.5}
        style={styles.stepIcon}
      />
      <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );
};

const DiscoveryWizard = () => {
  const [activeStep, setActiveStep] = useState('1');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <View
      style={[
        styles.wizardContainer,
        { paddingHorizontal: isMobile ? 20 : 60 },
      ]}
    >
      <Text style={[styles.wizardTitle, { fontSize: isMobile ? 24 : 36 }]}>
        Discover Opportunities Built for You
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.stepsScroll,
          !isMobile && { justifyContent: 'center', flexGrow: 1 },
        ]}
        style={{ flexGrow: 0, marginBottom: 40, width: '100%' }}
      >
        {STEPS.map(step => (
          <StepCard
            key={step.id}
            item={step}
            active={activeStep === step.id}
            onPress={() => setActiveStep(step.id)}
          />
        ))}
      </ScrollView>

      <View
        style={[
          styles.wizardContentCard,
          isMobile && { paddingVertical: 20, paddingHorizontal: 15 },
        ]}
      >
        <View style={styles.wizardStepBadge}>
          <Text style={styles.wizardStepText}>Step {activeStep} of 6</Text>
        </View>
        <View style={styles.wizardProgressBadge}>
          <Text style={styles.wizardStepText}>
            {parseInt(activeStep) * 16}%
          </Text>
        </View>

        <Text style={[styles.wizardQuestion, { fontSize: isMobile ? 22 : 28 }]}>
          What's your {STEPS.find(s => s.id === activeStep)?.label} Preference?
        </Text>
        <Text style={styles.wizardSubtext}>
          Select your {STEPS.find(s => s.id === activeStep)?.label} Preference.
        </Text>

        <View style={styles.wizardOptions}>
          {['Pune', 'Mumbai', 'Gurgaon', 'New Delhi'].map(city => (
            <TouchableOpacity
              key={city}
              style={[
                styles.cityOption,
                isMobile && { width: 100, height: 80 },
                selectedCity === city && styles.cityOptionSelected,
              ]}
              onPress={() => setSelectedCity(city)}
            >
              <Text
                style={[
                  styles.cityOptionText,
                  selectedCity === city && styles.cityOptionTextSelected,
                ]}
              >
                {city}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.wizardActions}>
          <TouchableOpacity style={styles.skipBtn}>
            <Text style={styles.skipBtnText}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.showPropertiesBtn}>
            <Text style={styles.showPropertiesText}>Show Properties</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wizardContainer: {
    marginTop: 40,
    alignItems: 'center',
    width: '100%',
  },
  wizardTitle: {
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 40,
    textAlign: 'center',
  },
  stepsScroll: {
    paddingHorizontal: 10,
    gap: 10,
  },
  stepCard: {
    width: 120,
    height: 120,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginRight: 10,
  },
  stepCardActive: {
    borderColor: '#D32F2F',
    borderWidth: 2,
    shadowColor: '#D32F2F',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  stepIcon: {
    marginBottom: 10,
  },
  stepLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
  },
  stepLabelActive: {
    color: '#D32F2F',
  },
  wizardContentCard: {
    width: '100%',
    maxWidth: 800,
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
    position: 'relative',
    marginTop: 20,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  wizardStepBadge: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  wizardProgressBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  wizardStepText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  wizardQuestion: {
    fontWeight: '900',
    color: '#1A1A1A',
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 20,
  },
  wizardSubtext: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  wizardOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 40,
  },
  cityOption: {
    width: 150,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  cityOptionSelected: {
    borderColor: '#D32F2F',
    borderWidth: 2,
    backgroundColor: '#FFF8F8',
  },
  cityOptionText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  cityOptionTextSelected: {
    color: '#D32F2F',
  },
  wizardActions: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  skipBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  skipBtnText: {
    color: '#666',
    fontWeight: '600',
  },
  showPropertiesBtn: {
    backgroundColor: '#D32F2F',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  showPropertiesText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default DiscoveryWizard;
