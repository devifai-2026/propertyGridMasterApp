import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  useWindowDimensions,
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
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;
  const isMobile = width < 480;

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
            initialData={formData}
          />
        );
      case 2:
        return (
          <BasicDetails
            onNext={handleNext}
            onFormValid={setIsFormValid}
            initialData={formData}
          />
        );
      case 3:
        return (
          <LegalDetails
            onNext={handleNext}
            onFormValid={setIsFormValid}
            initialData={formData}
          />
        );
      case 4:
        return (
          <LeaseDetails
            onNext={handleNext}
            onFormValid={setIsFormValid}
            initialData={formData}
          />
        );
      case 5:
        return (
          <FinancialDetails
            onNext={handleNext}
            onFormValid={setIsFormValid}
            initialData={formData}
          />
        );
      case 6:
        return (
          <LocationDetails
            onNext={handleNext}
            onFormValid={setIsFormValid}
            initialData={formData}
          />
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
        <View style={[styles.heroSection, isMobile && styles.heroSectionMobile]}>
          <Text style={[styles.heroTitle, isMobile && styles.heroTitleMobile]}>List Your Property</Text>
          <Text style={[styles.heroSubtext, isMobile && styles.heroSubtextMobile]}>
            Connect with serious investors looking for pre-leased commercial
            properties across India
          </Text>
          <TouchableOpacity style={[styles.bulkUploadBtn, isMobile && styles.bulkUploadBtnMobile]}>
            <Text style={[styles.bulkUploadText, isMobile && styles.bulkUploadTextMobile]}>Bulk Upload</Text>
            <View style={styles.arrowBg}>
              <ChevronRight size={isMobile ? 14 : 16} color="#EE2529" strokeWidth={3} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Dynamic Stepper Cards */}
        <View style={styles.stepperWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.stepperContent, isMobile && styles.stepperContentMobile]}
          >
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id <= currentStep;
              const isCurrent = step.id === currentStep;
              const accentColor = isActive ? '#EE2529' : '#767676';

              return (
                <View key={step.id} style={[styles.stepCardContainer, isMobile && styles.stepCardContainerMobile]}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[
                      styles.stepCard,
                      isMobile && styles.stepCardMobile,
                      { borderTopColor: accentColor },
                      isCurrent && styles.stepCardCurrent,
                    ]}
                    onPress={() =>
                      step.id < currentStep && setCurrentStep(step.id)
                    }
                  >
                    <Icon size={isMobile ? 20 : 24} color={accentColor} />
                    <Text
                      style={[styles.stepCardLabel, isMobile && styles.stepCardLabelMobile, { color: accentColor }]}
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
        <View style={styles.formCardWrapper}>
          <View style={[styles.formCard, isMobile && styles.formCardMobile]}>{renderStep()}</View>
        </View>

        {/* Navigation Actions */}
        <View style={styles.footerWrapper}>
          <View style={[styles.footer, isMobile && styles.footerMobile]}>
            <TouchableOpacity
              style={[
                styles.navBtn,
                styles.backBtn,
                isMobile && styles.navBtnMobile,
                currentStep === 1 && styles.btnHidden,
              ]}
              onPress={handleBack}
              disabled={currentStep === 1}
            >
              <ChevronLeft size={isMobile ? 18 : 20} color="#666" />
              <Text style={[styles.backBtnText, isMobile && styles.backBtnTextMobile]}>Previous</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.navBtn,
                styles.nextBtn,
                isMobile && styles.navBtnMobile,
                !isFormValid && styles.nextBtnDisabled,
              ]}
              onPress={handleFooterAction}
              disabled={!isFormValid}
            >
              <Text style={[styles.nextBtnText, isMobile && styles.nextBtnTextMobile]}>
                {currentStep === 6 ? 'List Property' : 'Next Step'}
              </Text>
              {currentStep < 6 && <ChevronRight size={isMobile ? 18 : 20} color="#FFF" />}
            </TouchableOpacity>
          </View>
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
  heroSectionMobile: {
    paddingVertical: 24,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  heroTitleMobile: {
    fontSize: 22,
    marginBottom: 8,
  },
  heroSubtext: {
    fontSize: 14,
    color: '#767676',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  heroSubtextMobile: {
    fontSize: 13,
    lineHeight: 18,
    paddingHorizontal: 16,
    marginBottom: 16,
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
  bulkUploadBtnMobile: {
    paddingLeft: 16,
    paddingRight: 4,
    paddingVertical: 4,
  },
  bulkUploadText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    marginRight: 10,
  },
  bulkUploadTextMobile: {
    fontSize: 12,
    marginRight: 8,
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
    alignItems: 'center',
  },
  stepperContent: {
    paddingHorizontal: 16,
    gap: 12,
    justifyContent: 'center',
  },
  stepperContentMobile: {
    paddingHorizontal: 12,
    gap: 8,
    justifyContent: 'flex-start',
  },
  stepCardContainer: {
    width: 130,
    alignItems: 'center',
  },
  stepCardContainerMobile: {
    width: 110,
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
  stepCardMobile: {
    height: 85,
    borderRadius: 10,
    padding: 8,
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
  stepCardLabelMobile: {
    fontSize: 10,
    marginTop: 6,
  },
  underline: {
    width: '100%',
    height: 4,
    marginTop: 12,
    borderRadius: 2,
  },
  formCardWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  formCard: {
    backgroundColor: '#FFF',
    width: '80%',
    maxWidth: 1200,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    minHeight: 400,
  },
  formCardMobile: {
    width: '100%',
    margin: 12,
    borderRadius: 10,
  },
  footerWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    maxWidth: 1200,
    paddingHorizontal: 16,
    marginTop: 10,
    paddingBottom: 40,
  },
  footerMobile: {
    width: '100%',
    paddingHorizontal: 12,
    paddingBottom: 24,
    marginTop: 8,
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
  navBtnMobile: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 10,
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
  backBtnTextMobile: {
    fontSize: 13,
  },
  nextBtn: {
    backgroundColor: '#EE2529',
    flex: 0,
    flexGrow: 1,
    maxWidth: 300,
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
  nextBtnTextMobile: {
    fontSize: 13,
  },
  btnHidden: {
    opacity: 0,
  },
});

export default ListPropertyScreen;
