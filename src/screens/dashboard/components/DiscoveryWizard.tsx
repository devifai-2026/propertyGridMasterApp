import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../../../constants/theme';
import {
  Building2,
  Percent,
  Home,
  DollarSign,
  User,
  Clock,
  LucideProps,
} from 'lucide-react-native';
import { useNavigation } from '../../../context/NavigationContext';

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
  const { width } = useWindowDimensions();
  const IconComponent = item.Icon;
  return (
    <TouchableOpacity
      style={[
        styles.stepCard,
        active && styles.stepCardActive,
        { width: width < 768 ? 90 : 120, height: width < 768 ? 90 : 120 },
      ]}
      onPress={onPress}
    >
      <IconComponent
        size={width < 768 ? 24 : 32}
        color={active ? COLORS.primary : COLORS.textSecondary}
        strokeWidth={1.5}
        style={styles.stepIcon}
      />
      <Text
        style={[
          styles.stepLabel,
          active && styles.stepLabelActive,
          { fontSize: width < 768 ? 12 : 14 },
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );
};

const DiscoveryWizard = () => {
  const [activeStep, setActiveStep] = useState('1');
  const [selections, setSelections] = useState<any>({
    city: null,
    roi: null,
    type: null,
    budget: null,
    tenant: null,
    tenure: null,
  });

  const { width } = useWindowDimensions();
  const { navigate } = useNavigation();
  const isMobile = width < 768;

  const OPTIONS: any = {
    '1': ['Pune', 'Mumbai', 'Gurgaon', 'New Delhi', 'Others'],
    '2': [
      { label: '5%+', value: '5' },
      { label: '8%+', value: '8' },
      { label: '10%+', value: '10' },
      { label: '12%+', value: '12' },
    ],
    '3': ['Residential', 'Retail', 'Offices', 'Industrial', 'Others'],
    '4': [
      { label: '< 1 Cr', value: { min: '0', max: '1' } },
      { label: '1 - 5 Cr', value: { min: '1', max: '5' } },
      { label: '5 - 10 Cr', value: { min: '5', max: '10' } },
      { label: '> 10 Cr', value: { min: '10', max: '1000' } },
    ],
    '5': ['Banks', 'IT/Tech', 'Retail', 'Logistics', 'Others'],
    '6': [
      { label: '< 3 Yrs', value: '1' },
      { label: '3 - 6 Yrs', value: '3' },
      { label: '6 - 9 Yrs', value: '6' },
      { label: '9+ Yrs', value: '9' },
    ],
  };

  const stepKeys: any = {
    '1': 'city',
    '2': 'roi',
    '3': 'type',
    '4': 'budget',
    '5': 'tenant',
    '6': 'tenure',
  };

  const handleSelection = (value: any) => {
    const key = stepKeys[activeStep];
    setSelections((prev: any) => ({ ...prev, [key]: value }));

    // Auto-advance if not on last step
    if (parseInt(activeStep) < 6) {
      setActiveStep(String(parseInt(activeStep) + 1));
    }
  };

  const handleShowProperties = () => {
    let queryParams = [];
    if (selections.city) queryParams.push(`city=${selections.city}`);
    if (selections.roi)
      queryParams.push(`minROI=${selections.roi.value || selections.roi}`);
    if (selections.type) queryParams.push(`propertyTypes=${selections.type}`);
    if (selections.budget) {
      queryParams.push(
        `minPrice=${
          selections.budget.value?.min || selections.budget.min || 0
        }`,
      );
      queryParams.push(
        `maxPrice=${
          selections.budget.value?.max || selections.budget.max || 1000
        }`,
      );
    }
    if (selections.tenure)
      queryParams.push(
        `minTenure=${selections.tenure.value || selections.tenure}`,
      );

    const queryString =
      queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    navigate(`/explore-properties${queryString}`);
  };

  const renderOptions = () => {
    const currentOptions = OPTIONS[activeStep];
    const currentKey = stepKeys[activeStep];
    const currentSelection = selections[currentKey];

    return (
      <View style={[styles.wizardOptions, isMobile && { gap: 10 }]}>
        {currentOptions.map((opt: any) => {
          const label = opt.label || opt;
          const value = opt.value || opt;
          const isSelected =
            JSON.stringify(currentSelection) === JSON.stringify(opt);

          return (
            <TouchableOpacity
              key={label}
              style={[
                styles.cityOption,
                isMobile && { width: (width - (isMobile ? 40 : 120) - 10) / 2 },
                isSelected && styles.cityOptionSelected,
              ]}
              onPress={() => handleSelection(opt)}
            >
              <Text
                style={[
                  styles.cityOptionText,
                  isSelected && styles.cityOptionTextSelected,
                  isMobile && { fontSize: 16 },
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

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
            {Math.round((parseInt(activeStep) / 6) * 100)}%
          </Text>
        </View>

        <Text style={[styles.wizardQuestion, { fontSize: isMobile ? 22 : 28 }]}>
          What's your {STEPS.find(s => s.id === activeStep)?.label} Preference?
        </Text>
        <Text style={styles.wizardSubtext}>
          Select your {STEPS.find(s => s.id === activeStep)?.label} Preference.
        </Text>

        {renderOptions()}

        <View style={styles.wizardActions}>
          <TouchableOpacity
            style={[styles.skipBtn, isMobile && { flex: 1 }]}
            onPress={() => {
              if (parseInt(activeStep) < 6) {
                setActiveStep(String(parseInt(activeStep) + 1));
              } else {
                handleShowProperties();
              }
            }}
          >
            <Text style={styles.skipBtnText}>
              {parseInt(activeStep) < 6 ? 'Skip' : 'Finish'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.showPropertiesBtn, isMobile && { flex: 2 }]}
            onPress={handleShowProperties}
          >
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
    color: COLORS.textDark,
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
    borderColor: COLORS.divider,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    marginRight: 10,
  },
  stepCardActive: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  stepIcon: {
    marginBottom: 10,
  },
  stepLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  stepLabelActive: {
    color: COLORS.primary,
  },
  wizardContentCard: {
    width: '100%',
    maxWidth: 800,
    backgroundColor: COLORS.white,
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
    borderColor: COLORS.divider,
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
    color: COLORS.textSecondary,
  },
  wizardQuestion: {
    fontWeight: '900',
    color: COLORS.textDark,
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 20,
  },
  wizardSubtext: {
    fontSize: 16,
    color: COLORS.textSecondary,
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
    backgroundColor: COLORS.white,
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
    borderColor: COLORS.primary,
    borderWidth: 2,
    backgroundColor: COLORS.lightRed,
  },
  cityOptionText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  cityOptionTextSelected: {
    color: COLORS.primary,
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
    borderColor: COLORS.divider,
    borderRadius: 8,
  },
  skipBtnText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  showPropertiesBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  showPropertiesText: {
    color: COLORS.white,
    fontWeight: '600',
  },
});

export default DiscoveryWizard;
