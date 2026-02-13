import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import {
  User,
  Building2,
  FileText,
  Handshake,
  DollarSign,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Check,
  Percent,
  Home,
  Users,
} from 'lucide-react-native';
import { Alert } from 'react-native';

import Layout from '../../layout/Layout';
import PersonalDetails from './components/PersonalDetails';
import BasicDetails from './components/BasicDetails';
import LegalDetails from './components/LegalDetails';
import LeaseDetails from './components/LeaseDetails';
import FinancialDetails from './components/FinancialDetails';
import LocationDetails from './components/LocationDetails';

const STEPS = [
  { id: 1, title: 'Personal Details', icon: User },
  { id: 2, title: 'Basic Details', icon: DollarSign },
  { id: 3, title: 'Legal Details', icon: Percent },
  { id: 4, title: 'Lease Details', icon: Home },
  { id: 5, title: 'Financial Details', icon: Building2 },
  { id: 6, title: 'Location Details', icon: Users },
];

const ListPropertyScreen = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formData, setFormData] = useState({});
  const personalDetailsRef = useRef<any>(null);
  const scrollRef = useRef<ScrollView>(null);

  const handleNext = (stepData?: any) => {
    if (stepData) {
      setFormData(prev => ({ ...prev, ...stepData }));
    }

    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
      setIsFormValid(false);
      scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    } else {
      // Final Submit
      console.log('Final Form Data:', formData);
      Alert.alert('Success', 'Property Listed Successfully!');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setIsFormValid(true); // Assuming previous step was valid
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalDetails
            ref={personalDetailsRef}
            onNext={handleNext}
            onFormValid={setIsFormValid}
          />
        );
      case 2:
        return (
          <BasicDetails onNext={handleNext} onFormValid={setIsFormValid} />
        );
      case 3:
        return (
          <LegalDetails onNext={handleNext} onFormValid={setIsFormValid} />
        );
      case 4:
        return (
          <LeaseDetails onNext={handleNext} onFormValid={setIsFormValid} />
        );
      case 5:
        return (
          <FinancialDetails onNext={handleNext} onFormValid={setIsFormValid} />
        );
      case 6:
        return (
          <LocationDetails onNext={handleNext} onFormValid={setIsFormValid} />
        );
      default:
        return null;
    }
  };

  const handleFooterAction = () => {
    if (currentStep === 1) {
      personalDetailsRef.current?.submit();
    } else {
      handleNext();
    }
  };

  return (
    <Layout>
      <ScrollView
        ref={scrollRef}
        style={styles.mainContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>List Your Property</Text>
          <Text style={styles.heroSubtext}>
            Connect with serious investors looking for pre-leased commercial
            properties across India
          </Text>
          <TouchableOpacity style={styles.bulkUploadBtn}>
            <Text style={styles.bulkUploadText}>Bulk Upload</Text>
            <View style={styles.arrowBg}>
              <ChevronRight size={16} color="#EE2529" strokeWidth={3} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Dynamic Stepper Cards */}
        <View style={styles.stepperWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.stepperContent}
          >
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id <= currentStep;
              const isCurrent = step.id === currentStep;
              const accentColor = isActive ? '#EE2529' : '#767676';

              return (
                <View key={step.id} style={styles.stepCardContainer}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[
                      styles.stepCard,
                      { borderTopColor: accentColor },
                      isCurrent && styles.stepCardCurrent,
                    ]}
                    onPress={() =>
                      step.id < currentStep && setCurrentStep(step.id)
                    }
                  >
                    <Icon size={24} color={accentColor} />
                    <Text
                      style={[styles.stepCardLabel, { color: accentColor }]}
                    >
                      {step.title}
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={[styles.underline, { backgroundColor: accentColor }]}
                  />
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* Form Area */}
        <View style={styles.formCard}>{renderStep()}</View>

        {/* Navigation Actions */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.navBtn,
              styles.backBtn,
              currentStep === 1 && styles.btnHidden,
            ]}
            onPress={handleBack}
            disabled={currentStep === 1}
          >
            <ChevronLeft size={20} color="#666" />
            <Text style={styles.backBtnText}>Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navBtn,
              styles.nextBtn,
              !isFormValid && styles.nextBtnDisabled,
            ]}
            onPress={handleFooterAction}
            disabled={!isFormValid}
          >
            <Text style={styles.nextBtnText}>
              {currentStep === 6 ? 'List Property' : 'Next Step'}
            </Text>
            {currentStep < 6 && <ChevronRight size={20} color="#FFF" />}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#FFF',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  heroSubtext: {
    fontSize: 14,
    color: '#767676',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  bulkUploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EE2529',
    paddingLeft: 20,
    paddingRight: 6,
    paddingVertical: 6,
    borderRadius: 30,
    shadowColor: '#EE2529',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  bulkUploadText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    marginRight: 10,
  },
  arrowBg: {
    backgroundColor: '#FFF',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperWrapper: {
    marginTop: 10,
    paddingBottom: 10,
  },
  stepperContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  stepCardContainer: {
    width: 130,
    alignItems: 'center',
  },
  stepCard: {
    backgroundColor: '#FFF',
    width: '100%',
    height: 100,
    borderRadius: 12,
    borderTopWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    padding: 10,
  },
  stepCardCurrent: {
    shadowOpacity: 0.15,
    elevation: 6,
    transform: [{ scale: 1.02 }],
  },
  stepCardLabel: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 8,
  },
  underline: {
    width: '100%',
    height: 4,
    marginTop: 12,
    borderRadius: 2,
  },
  formCard: {
    backgroundColor: '#FFF',
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    minHeight: 400,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 10,
    paddingBottom: 40,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    height: 52,
  },
  backBtn: {
    backgroundColor: '#F5F5F5',
  },
  backBtnText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 4,
  },
  nextBtn: {
    backgroundColor: '#EE2529',
    flex: 1,
    marginLeft: 16,
  },
  nextBtnDisabled: {
    backgroundColor: '#FFCDD2',
  },
  nextBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
    marginRight: 4,
  },
  btnHidden: {
    opacity: 0,
  },
});

export default ListPropertyScreen;
