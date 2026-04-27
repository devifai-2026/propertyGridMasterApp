import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_DESKTOP_INITIAL = SCREEN_WIDTH >= 768;
import { COLORS, FONTS } from '../../../constants/theme';
import { useNavigation } from '../../../context/NavigationContext';
import LinearGradient from 'react-native-linear-gradient';
import {
  CitiesIcon,
  AnnualReturnsIcon,
  PropertyTypeIcon,
  BudgetIcon,
  TenantTypeIcon,
  TenureLeftIcon,
} from '../../../components/common/WizardIcons';



interface Step {
  id: string;
  label: string;
  Icon: React.FC<{ color: string; size: number; style?: any }>;
}

const STEPS: Step[] = [
  { id: '1', label: 'City', Icon: CitiesIcon },
  { id: '2', label: 'Annual\nReturns', Icon: AnnualReturnsIcon },
  { id: '3', label: 'Property\nType', Icon: PropertyTypeIcon },
  { id: '4', label: 'Budget', Icon: BudgetIcon },
  { id: '5', label: 'Tenant\nType', Icon: TenantTypeIcon },
  { id: '6', label: 'Tenure\nLeft', Icon: TenureLeftIcon },
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
  const isMobile = width < 768;
  const IconComponent = item.Icon;

  return (
    <View style={styles.stepItemWrapper}>
      <TouchableOpacity
        style={[
          styles.stepCard,
          active && styles.stepCardActive,
          { width: isMobile ? 80 : 110, height: isMobile ? 90 : 110 },
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <IconComponent
          size={35}
          color={active ? '#EE2529' : '#767676'}
          style={styles.stepIcon}
        />
        <Text
          style={[
            styles.stepLabel,
            active && styles.stepLabelActive,
            { fontSize: isMobile ? 11 : 16 },
          ]}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
      <View
        style={[
          styles.stepProgressIndicator,
          active && styles.stepProgressIndicatorActive,
          { width: isMobile ? 80 : 110 },
        ]}
      />
    </View>
  );
};

const WizardOption = ({ label, isSelected, onPress, isMobile, width }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const isWeb = Platform.OS === 'web';

  return (
    <LinearGradient
      colors={['#F2F2F2', '#FFFFFF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[
        styles.cityOption,
        isMobile && { width: Math.min((width - 60) / 2, 160) },
        isSelected && styles.cityOptionSelected,
        (isHovered && !isSelected) && {
          shadowColor: COLORS.primary,
          shadowOffset: { width: -3, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 8,
          elevation: 6,
        }
      ]}
      {...(isWeb ? {
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
      } : {})}
    >
      <TouchableOpacity
        style={styles.cityOptionInner}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.cityOptionText,
            isSelected && styles.cityOptionTextSelected,
            isMobile && { fontSize: 13 },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
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
    '1': ['Pune', 'Mumbai', 'Kolkata', 'Gurgaon', 'Chennai', 'New Delhi'],
    '2': [
      { label: '5%+', value: '5' },
      { label: '8%+', value: '8' },
      { label: '10%+', value: '10' },
      { label: '12%+', value: '12' },
      { label: '15%+', value: '15' },
      { label: '20%+', value: '20' },
    ],
    '3': ['Residential', 'Retail', 'Offices', 'Industrial', 'Institutional', 'Others'],
    '4': [
      { label: '< 1 Cr', value: { min: '0', max: '1' } },
      { label: '1 - 2.5 Cr', value: { min: '1', max: '2.5' } },
      { label: '2.5 - 5 Cr', value: { min: '2.5', max: '5' } },
      { label: '5 - 7.5 Cr', value: { min: '5', max: '7.5' } },
      { label: '7.5 - 10 Cr', value: { min: '7.5', max: '10' } },
      { label: '> 10 Cr', value: { min: '10', max: '1000' } },
    ],
    '5': ['Banks', 'IT/Tech', 'Retail', 'Logistics', 'Co-working', 'Others'],
    '6': [
      { label: '< 1 Yrs', value: '1' },
      { label: '2 - 4 Yrs', value: '2' },
      { label: '4 - 6 Yrs', value: '4' },
      { label: '6 - 7 Yrs', value: '6' },
      { label: '7 - 9 Yrs', value: '7' },
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
        `minPrice=${selections.budget.value?.min || selections.budget.min || 0
        }`,
      );
      queryParams.push(
        `maxPrice=${selections.budget.value?.max || selections.budget.max || 1000
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
          const isSelected =
            JSON.stringify(currentSelection) === JSON.stringify(opt);

          return (
            <WizardOption
              key={label}
              label={label}
              isSelected={isSelected}
              onPress={() => handleSelection(opt)}
              isMobile={isMobile}
              width={width}
            />
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
          {STEPS.map((step) => (
            <StepCard
              key={step.id}
              item={step}
              active={activeStep === step.id}
              onPress={() => setActiveStep(step.id)}
            />
          ))}
        </ScrollView>
      </View>

      <View
        style={[
          styles.wizardContentCard,
          isMobile && { width: '100%', paddingVertical: 35, paddingHorizontal: 15 },
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

        <Text style={[styles.wizardQuestion, { fontSize: isMobile ? 18 : 32 }]}>
          What's your {STEPS.find(s => s.id === activeStep)?.label} Preference?
        </Text>
        <Text style={styles.wizardSubtext}>
          Select your {STEPS.find(s => s.id === activeStep)?.label} Preference.
        </Text>

        {renderOptions()}
      </View>

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
          <Text style={[styles.skipBtnText, isMobile && { fontSize: 12 }]}>
            {parseInt(activeStep) < 6 ? 'Skip' : 'Finish'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[isMobile && { flex: 2.5 }]}
          onPress={handleShowProperties}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#EE2529', '#C73834']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.showPropertiesBtn}
          >
            <Text 
              numberOfLines={1}
              style={[styles.showPropertiesText, isMobile && { fontSize: 12 }]}
            >
              Show Properties
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wizardContainer: {
    // paddingVertical: 50,
    paddingBottom: 0,
    paddingTop: 50,
    alignItems: 'center',
    width: '100%',
    
  },
  wizardTitle: {
    fontFamily: FONTS.avenir,
    fontSize: 42,
    fontWeight: '400',
    color: '#262626',
    marginBottom: 40,
    textAlign: 'center',
  },
  stepsContainer: {
    width: '100%',
    maxWidth: 900,
    marginBottom: 40,
    position: 'relative',
    paddingBottom: 4,
  },
  stepsBaseLine: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    height: 3,
    backgroundColor: '#EAEAEA',
    borderRadius: 2,
  },
  stepsScroll: {
    paddingHorizontal: 20,
    gap: 10,
  },
  stepItemWrapper: {
    alignItems: 'center',
    gap: 12,
  },
  stepCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 5,
    borderTopColor: '#666',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 4,
  },
  stepCardActive: {
    borderTopColor: COLORS.primary,
    borderColor: 'rgba(211, 47, 47, 0.1)',
  },
  stepIcon: {
    marginBottom: 12,
  },
  stepLabel: {
    fontFamily: FONTS.main,
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  stepLabelActive: {
    color: '#EE2529',
    fontWeight: '700',
  },
  stepProgressIndicator: {
    height: 4,
    backgroundColor: '#EAEAEA',
    borderRadius: 2,
  },
  stepProgressIndicatorActive: {
    backgroundColor: '#EE2529',
  },
  wizardContentCard: {
    width: '90%',
    maxWidth: 600,
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.04,
    shadowRadius: 20,
    elevation: 8,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    overflow: 'hidden',
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
    backgroundColor: '#FFF3CA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  wizardProgressBadge: {
    backgroundColor: '#FFF3CA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  wizardStepText: {
    fontFamily: FONTS.main,
    fontSize: 12,
    fontWeight: '500',
    color: '#8B7B3E',
  },
  wizardQuestion: {
    fontFamily: FONTS.avenir,
    fontWeight: '400',
    color: '#1A1A1A',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: IS_DESKTOP_INITIAL ? 10 : 25,
  },
  wizardSubtext: {
    fontFamily: FONTS.main,
    fontSize: 16,
    fontWeight: '400',
    color: '#666',
    marginBottom: 35,
    textAlign: 'center',
  },
  wizardOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: IS_DESKTOP_INITIAL ? 30 : 10,
    marginBottom: IS_DESKTOP_INITIAL ? 40 : 20,
    width: IS_DESKTOP_INITIAL ? 550 : '100%',
    height: IS_DESKTOP_INITIAL ? 300 : 'auto',
    maxWidth: 550,
  },
  cityOption: {
  width: 130,
  height: IS_DESKTOP_INITIAL ? 130 : 90,
  borderRadius: 15,
  alignItems: 'center',
  justifyContent: 'center',
  shadowColor: '#000000',
  shadowOffset: { width: 2, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 3,
  marginBottom: IS_DESKTOP_INITIAL ? 0 : 10,
},
cityOptionInner: {
  width: '100%',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 15,
},
  cityOptionSelected: {
    borderWidth: 0,
    backgroundColor: '#FFF',
    shadowColor: COLORS.primary,
    shadowOffset: { width: -3, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  cityOptionText: {
    fontFamily: FONTS.main,
    fontSize: 18,
    fontWeight: '700',
    color: '#767676',

  },
  cityOptionTextSelected: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  wizardActions: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
    marginTop: 30,
  },
  skipBtn: {
    height: 48,
    minWidth: 91,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#767676',
    borderRadius: 8,
    paddingHorizontal: 25,
    paddingVertical: 15,
    backgroundColor:'white',
  },
  skipBtnText: {
    fontFamily: 'Montserrat',
    color: '#767676',
    fontSize: 18,
    fontWeight: '500',
  },
  showPropertiesBtn: {
    height: 48,
    minWidth: IS_DESKTOP_INITIAL ? 180 : 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: IS_DESKTOP_INITIAL ? 30 : 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  showPropertiesText: {
    fontFamily: 'Montserrat',
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    whiteSpace: 'nowrap' as any,
  },
  
});

export default DiscoveryWizard;
