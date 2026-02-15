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
import { Alert, ActivityIndicator } from 'react-native';

import Layout from '../../layout/Layout';
import { usePropertyAPIs } from '../../../helpers/hooks/propertyAPIs/usePropertyApis';
import { useNavigation } from '../../context/NavigationContext';
import { useAuth } from '../../context/AuthContext';
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

  const { createProperty, loading: apiLoading } = usePropertyAPIs();
  const { navigate } = useNavigation();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const personalDetailsRef = useRef<any>(null);
  const basicDetailsRef = useRef<any>(null);
  const legalDetailsRef = useRef<any>(null);
  const leaseDetailsRef = useRef<any>(null);
  const financialDetailsRef = useRef<any>(null);
  const locationDetailsRef = useRef<any>(null);

  const scrollRef = useRef<ScrollView>(null);

  const submitProperty = async (finalData: any) => {
    try {
      console.log('Submitting Property Data:', finalData);

      const apiFormData = new FormData();

      // --- Basic Details ---
      apiFormData.append('propertyType', finalData.propertyType || '');
      apiFormData.append('carpetAreaSqft', finalData.carpetArea || '');
      apiFormData.append('completionYear', finalData.builtYear || '');
      apiFormData.append('lastRefurbished', finalData.lastRefurbished || '');
      apiFormData.append('ownershipType', finalData.ownership || '');
      apiFormData.append('buildingGrade', finalData.buildingGrade || '');

      // Parking
      apiFormData.append('parkingSlots', finalData.fourWheelerParkings || '0');
      apiFormData.append('parkingRatio', finalData.twoWheelerParkings || '0');

      // Infrastructure
      apiFormData.append('powerBackupKva', finalData.powerBackup || '');
      apiFormData.append('numberOfLifts', finalData.numLifts || '0');
      apiFormData.append('hvacType', finalData.hvacType || '');
      apiFormData.append('furnishingStatus', finalData.furnishingStatus || '');
      apiFormData.append('caretakerId', finalData.buildingMaintained || '');

      apiFormData.append(
        'amenityIds',
        JSON.stringify(finalData.amenityIds || []),
      );

      // Description
      apiFormData.append('description', finalData.propertyDescription || '');

      // --- Legal Details ---
      apiFormData.append('titleStatus', finalData.titleStatus || '');
      apiFormData.append(
        'occupancyCertificate',
        finalData.occupancyCertificate || '',
      );
      apiFormData.append(
        'leaseRegistration',
        finalData.leaseRegistration || '',
      );
      apiFormData.append(
        'hasPendingLitigation',
        finalData.pendingLitigations === 'yes' ? 'true' : 'false',
      );
      apiFormData.append('litigationDetails', finalData.litigationNote || '');
      apiFormData.append('reraNumber', finalData.reraNumber || '');

      // Certifications
      const certs = {
        ...(finalData.certifications || {}),
        others: finalData.otherCertifications || [],
      };
      apiFormData.append('certifications', JSON.stringify(certs));

      // --- Lease Details ---
      apiFormData.append('tenantType', finalData.tenantType || '');
      apiFormData.append('leaseStartDate', finalData.leaseStartDate || '');
      apiFormData.append('leaseEndDate', finalData.leaseExpiryDate || '');
      apiFormData.append('lockInPeriodYears', finalData.lockInYears || '0');
      apiFormData.append('lockInPeriodMonths', finalData.lockInMonths || '0');
      apiFormData.append('leaseDurationYears', finalData.leaseDuration || '0');

      const rentTypeMap = { perSqFt: 'Per Sq Ft', lumpSum: 'Lump Sum' };
      apiFormData.append(
        'rentType',
        rentTypeMap[finalData.rentType as keyof typeof rentTypeMap] ||
          'Per Sq Ft',
      );
      apiFormData.append('rentPerSqftMonthly', finalData.rentPerSqFt || '0');
      apiFormData.append('totalMonthlyRent', finalData.totalMonthlyRent || '0');

      const depositTypeMap = { months: 'Months of Rent', lumpSum: 'Lump Sum' };
      apiFormData.append(
        'securityDepositType',
        depositTypeMap[
          finalData.securityDepositType as keyof typeof depositTypeMap
        ] || 'Months of Rent',
      );
      apiFormData.append(
        'securityDepositMonths',
        finalData.securityDepositMonths || '0',
      );
      apiFormData.append(
        'securityDepositAmount',
        finalData.securityDepositAmount || '0',
      );

      apiFormData.append(
        'escalationFrequencyYears',
        finalData.escalationFrequency || '0',
      );
      apiFormData.append(
        'annualEscalationPercent',
        finalData.escalationPercentage || '0',
      );

      const maintScopeMap = {
        included: 'Yes, included in rent',
        excluded: 'No, excluded from rent',
      };
      apiFormData.append(
        'maintenanceCostsIncluded',
        maintScopeMap[
          finalData.maintenanceScope as keyof typeof maintScopeMap
        ] || 'No, excluded from rent',
      );

      const maintTypeMap = { perSqFt: 'Per Sq Ft', lumpSum: 'Lump Sum' };
      apiFormData.append(
        'maintenanceType',
        maintTypeMap[finalData.maintenanceType as keyof typeof maintTypeMap] ||
          'Per Sq Ft',
      );
      apiFormData.append(
        'maintenanceAmount',
        finalData.maintenanceAmount || '0',
      );

      // --- Financial Details ---
      apiFormData.append('sellingPrice', finalData.sellingPrice || '0');
      apiFormData.append('propertyTaxAnnual', finalData.propertyTax || '0');
      apiFormData.append('insuranceAnnual', finalData.insurance || '0');
      apiFormData.append('otherCostsAnnual', finalData.otherCosts || '0');
      apiFormData.append(
        'additionalIncomeAnnual',
        finalData.additionalIncome || '0',
      );

      // -- Location Details --
      apiFormData.append('microMarket', finalData.microMarket || '');
      apiFormData.append('city', finalData.city || '');
      apiFormData.append('state', finalData.state || '');
      apiFormData.append('demandDrivers', finalData.demandDrivers || '');
      apiFormData.append(
        'upcomingDevelopments',
        finalData.futureInfrastructure || '',
      );

      const mappedConnectivity = (finalData.connectivity || [])
        .filter((conn: any) => conn.type && conn.type.trim() !== '')
        .map((conn: any) => ({
          connectivityType: conn.type,
          name: conn.name,
          distanceKm: conn.distance,
        }));
      apiFormData.append(
        'connectivityDetails',
        JSON.stringify(mappedConnectivity),
      );

      // Media
      if (finalData.mediaFiles && Array.isArray(finalData.mediaFiles)) {
        finalData.mediaFiles.forEach((file: any) => {
          if (Platform.OS === 'web') {
            if (file.fileObject) {
              apiFormData.append('files', file.fileObject);
            }
          } else {
            apiFormData.append('files', {
              uri: file.uri,
              name: file.fileName || 'image.jpg',
              type: file.type || 'image/jpeg',
            } as any);
          }
        });
      }

      // Call API
      createProperty(
        apiFormData,
        (response: any) => {
          if (Platform.OS === 'web') {
            navigate('/dashboard');
          } else {
            Alert.alert('Success', 'Property Listed Successfully!', [
              { text: 'OK', onPress: () => navigate('/dashboard') },
            ]);
          }
        },
        (error: any) => {
          const message =
            error?.response?.data?.message ||
            'Failed to list property. Please try again.';
          Alert.alert('Error', message);
          console.error('Property creation error:', error);
        },
      );
    } catch (error) {
      console.error('Error preparing submission:', error);
      Alert.alert('Error', 'Something went wrong while submitting.');
    }
  };

  const handleNext = (stepData?: any) => {
    let currentFormData = formData;
    if (stepData) {
      currentFormData = { ...formData, ...stepData };
      setFormData(currentFormData);
    }

    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
      setIsFormValid(false);
      scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    } else {
      submitProperty(currentFormData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setIsFormValid(true);
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
            ref={basicDetailsRef}
            onNext={handleNext}
            onFormValid={setIsFormValid}
            initialData={formData}
          />
        );
      case 3:
        return (
          <LegalDetails
            ref={legalDetailsRef}
            onNext={handleNext}
            onFormValid={setIsFormValid}
            initialData={formData}
          />
        );
      case 4:
        return (
          <LeaseDetails
            ref={leaseDetailsRef}
            onNext={handleNext}
            onFormValid={setIsFormValid}
            initialData={formData}
          />
        );
      case 5:
        return (
          <FinancialDetails
            ref={financialDetailsRef}
            onNext={handleNext}
            onFormValid={setIsFormValid}
            initialData={formData}
          />
        );
      case 6:
        return (
          <LocationDetails
            ref={locationDetailsRef}
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
    switch (currentStep) {
      case 1:
        personalDetailsRef.current?.submit();
        break;
      case 2:
        basicDetailsRef.current?.submit();
        break;
      case 3:
        legalDetailsRef.current?.submit();
        break;
      case 4:
        leaseDetailsRef.current?.submit();
        break;
      case 5:
        financialDetailsRef.current?.submit();
        break;
      case 6:
        locationDetailsRef.current?.submit();
        break;
      default:
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
        <View
          style={[styles.heroSection, isMobile && styles.heroSectionMobile]}
        >
          <Text style={[styles.heroTitle, isMobile && styles.heroTitleMobile]}>
            List Your Property
          </Text>
          <Text
            style={[styles.heroSubtext, isMobile && styles.heroSubtextMobile]}
          >
            Connect with serious investors looking for pre-leased commercial
            properties across India
          </Text>
          <TouchableOpacity
            style={[
              styles.bulkUploadBtn,
              isMobile && styles.bulkUploadBtnMobile,
            ]}
          >
            <Text
              style={[
                styles.bulkUploadText,
                isMobile && styles.bulkUploadTextMobile,
              ]}
            >
              Bulk Upload
            </Text>
            <View style={styles.arrowBg}>
              <ChevronRight
                size={isMobile ? 14 : 16}
                color="#EE2529"
                strokeWidth={3}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Dynamic Stepper Cards */}
        <View style={styles.stepperWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.stepperContent,
              isMobile && styles.stepperContentMobile,
            ]}
          >
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id <= currentStep;
              const isCurrent = step.id === currentStep;
              const accentColor = isActive ? '#EE2529' : '#767676';

              return (
                <View
                  key={step.id}
                  style={[
                    styles.stepCardContainer,
                    isMobile && styles.stepCardContainerMobile,
                  ]}
                >
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
                      style={[
                        styles.stepCardLabel,
                        isMobile && styles.stepCardLabelMobile,
                        { color: accentColor },
                      ]}
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
          <View style={[styles.formCard, isMobile && styles.formCardMobile]}>
            {renderStep()}
          </View>
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
              <Text
                style={[
                  styles.backBtnText,
                  isMobile && styles.backBtnTextMobile,
                ]}
              >
                Previous
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.navBtn,
                styles.nextBtn,
                isMobile && styles.navBtnMobile,
                (!isFormValid || apiLoading) && styles.nextBtnDisabled,
              ]}
              onPress={handleFooterAction}
              disabled={!isFormValid || apiLoading}
            >
              {apiLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Text
                    style={[
                      styles.nextBtnText,
                      isMobile && styles.nextBtnTextMobile,
                    ]}
                  >
                    {currentStep === 6 ? 'List Property' : 'Next Step'}
                  </Text>
                  {currentStep < 6 && (
                    <ChevronRight size={isMobile ? 18 : 20} color="#FFF" />
                  )}
                </>
              )}
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
