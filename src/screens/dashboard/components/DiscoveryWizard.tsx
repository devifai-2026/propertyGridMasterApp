import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import { COLORS, FONTS } from '../../../constants/theme';
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
  isLast,
}: {
  item: Step;
  active: boolean;
  onPress: () => void;
  isLast?: boolean;
}) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const IconComponent = item.Icon;
  
  return (
    <View style={styles.stepWrapper}>
      <TouchableOpacity
        style={[
          styles.stepCard,
          active && styles.stepCardActive,
          { width: isMobile ? 90 : 120, height: isMobile ? 90 : 120 },
        ]}
        onPress={onPress}
      >
        <IconComponent
          size={isMobile ? 24 : 32}
          color={active ? '#EE2529' : '#888'}
          strokeWidth={active ? 2.5 : 1.5}
          style={styles.stepIcon}
        />
        <Text
          style={[
            styles.stepLabel,
            active && styles.stepLabelActive,
            { fontSize: isMobile ? 12 : 14 },
          ]}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
      <View style={[styles.stepProgressLine, active && styles.stepProgressLineActive]} />
    </View>
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

      <View style={styles.stepsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.stepsScroll,
            !isMobile && { justifyContent: 'center', flexGrow: 1 },
          ]}
          style={{ flexGrow: 0, width: '100%' }}
        >
          {STEPS.map((step, index) => (
            <StepCard
              key={step.id}
              item={step}
              active={activeStep === step.id}
              onPress={() => setActiveStep(step.id)}
              isLast={index === STEPS.length - 1}
            />
          ))}
        </ScrollView>
      </View>

      <View
        style={[
          styles.wizardContentCard,
          isMobile && { paddingVertical: 20, paddingHorizontal: 15 },
        ]}
      >
        <View style={styles.badgeRow}>
          <View style={styles.wizardStepBadge}>
            <Text style={styles.wizardStepText}>Step {activeStep} of 6</Text>
          </View>
          <View style={styles.wizardProgressBadge}>
            <Text style={styles.wizardStepText}>
              {Math.round((parseInt(activeStep) / 6) * 100)}%
            </Text>
          </View>
        </View>

        <Text style={[styles.wizardQuestion, { fontSize: isMobile ? 22 : 36 }]}>
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
    paddingVertical: 50,
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  wizardTitle: {
    fontFamily: FONTS.main,
    fontWeight: '400',
    color: '#1A1A1A',
    marginBottom: 50,
    textAlign: 'center',
  },
  stepsContainer: {
    width: '100%',
    maxWidth: 900,
    marginBottom: 40,
  },
  stepsScroll: {
    paddingHorizontal: 20,
    gap: 15,
  },
  stepWrapper: {
    alignItems: 'center',
    gap: 15,
  },
  stepCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#EAEAEA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  stepCardActive: {
    borderColor: '#EE2529',
    backgroundColor: '#FFF',
    shadowColor: '#EE2529',
    shadowOpacity: 0.08,
  },
  stepIcon: {
    marginBottom: 8,
  },
  stepLabel: {
    fontFamily: FONTS.main,
    fontSize: 14,
    color: '#888',
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  stepLabelActive: {
    color: '#EE2529',
  },
  stepProgressLine: {
    height: 4,
    width: '100%',
    backgroundColor: '#EAEAEA',
    borderRadius: 2,
  },
  stepProgressLineActive: {
    backgroundColor: '#EE2529',
  },
  wizardContentCard: {
    width: '100%',
    maxWidth: 900,
    backgroundColor: '#FFF',
    borderRadius: 24,
    paddingHorizontal: 30,
    paddingVertical: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.06,
    shadowRadius: 30,
    elevation: 8,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    position: 'absolute',
    top: 25,
    paddingHorizontal: 30,
  },
  wizardStepBadge: {
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
  },
  wizardProgressBadge: {
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
  },
  wizardStepText: {
    fontFamily: FONTS.main,
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
  },
  wizardQuestion: {
    fontFamily: FONTS.main,
    fontWeight: '400',
    color: '#1A1A1A',
    marginBottom: 15,
    textAlign: 'center',
    marginTop: 20,
  },
  wizardSubtext: {
    fontFamily: FONTS.main,
    fontSize: 18,
    color: '#666',
    marginBottom: 45,
    textAlign: 'center',
  },
  wizardOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 50,
    width: '100%',
  },
  cityOption: {
    width: 200,
    height: 120,
    backgroundColor: '#FFF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  cityOptionSelected: {
    borderColor: '#EE2529',
    backgroundColor: '#FFF',
    shadowColor: '#EE2529',
    shadowOpacity: 0.1,
  },
  cityOptionText: {
    fontFamily: FONTS.main,
    fontSize: 20,
    fontWeight: '500',
    color: '#666',
  },
  cityOptionTextSelected: {
    color: '#EE2529',
    fontWeight: '700',
  },
  wizardActions: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  skipBtn: {
    height: 54,
    minWidth: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#EAEAEA',
    borderRadius: 12,
    paddingHorizontal: 30,
  },
  skipBtnText: {
    fontFamily: FONTS.main,
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  showPropertiesBtn: {
    backgroundColor: '#EE2529',
    height: 54,
    minWidth: 180,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 40,
    shadowColor: '#EE2529',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  showPropertiesText: {
    fontFamily: FONTS.main,
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DiscoveryWizard;
