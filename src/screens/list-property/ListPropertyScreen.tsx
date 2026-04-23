import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  useWindowDimensions,
  ImageBackground,
  Image,
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
  AlertTriangle,
} from 'lucide-react-native';
import { Alert, ActivityIndicator } from 'react-native';
import bannerBg from "../../assets/listProperty/bannerBg.png"

import Layout from '../../layout/Layout';
import { usePropertyAPIs } from '../../../helpers/hooks/propertyAPIs/usePropertyApis';
import { useNavigation } from '../../context/NavigationContext';
import { useAuth } from '../../context/AuthContext';
import PersonalDetails from './components/PersonalDetails';
import BasicDetails from './components/BasicDetails';
import LegalDetails from './components/LegalDetails';
import LeaseDetails from './components/LeaseDetails';
import FinancialDetails from './components/FinancialDetails';
import { FONTS } from '../../constants/theme';
import LocationDetails from './components/LocationDetails';
import bulk from "../../assets/listProperty/bulk.png"

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

  const {
    createProperty,
    updateProperty,
    getPropertyById,
    loading: apiLoading,
  } = usePropertyAPIs();
  const { navigate, currentPath } = useNavigation();
  const { user } = useAuth();

  const propertyId = currentPath.split('/list-property/')[1];
  const isEditMode = !!propertyId;

  const [currentStep, setCurrentStep] = useState(1);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const personalDetailsRef = useRef<any>(null);
  const basicDetailsRef = useRef<any>(null);
  const legalDetailsRef = useRef<any>(null);
  const leaseDetailsRef = useRef<any>(null);
  const financialDetailsRef = useRef<any>(null);
  const locationDetailsRef = useRef<any>(null);

  const stepperScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (isMobile && stepperScrollRef.current) {
      const tabWidth = 110;
      const gap = 8;
      const padding = 12;
      const index = currentStep - 1;
      
      const tabOffset = padding + (index * (tabWidth + gap));
      const tabCenter = tabOffset + (tabWidth / 2);
      const scrollX = tabCenter - (width / 2);
      
      stepperScrollRef.current.scrollTo({
        x: Math.max(0, scrollX),
        animated: true,
      });
    }
  }, [currentStep, isMobile, width]);

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (isEditMode) {
      setInitialLoading(true);
      getPropertyById(
        propertyId,
        (data: any) => {
          console.log('Fetched Property Data for Edit:', data);

          // Map backend data to form data structure
          const mappedData: any = {
            // Step 1: Personal
            firstName: data.Owner?.firstName || '',
            lastName: data.Owner?.lastName || '',
            email: data.Owner?.email || '',
            mobile: data.Owner?.mobileNumber || '',
            listUnder: data.brokerId ? 'broker' : 'owner',
            agreeTerms: true,
            agreePrivacy: true,

            // Step 2: Basic
            propertyType: data.propertyType,
            builtYear: String(data.completionYear || ''),
            buildingGrade: data.buildingGrade,
            carpetArea: String(data.carpetArea || ''),
            lastRefurbished: String(data.lastRefurbishedYear || ''),
            ownership: data.ownershipType,
            fourWheelerParkings: String(data.parkingFourWheeler || ''),
            twoWheelerParkings: String(data.parkingTwoWheeler || ''),
            powerBackup: data.powerBackup,
            numLifts: String(data.numberOfLifts || ''),
            hvacType: data.hvacType,
            furnishingStatus: data.furnishingStatus,
            buildingMaintained: String(data.maintainedById || ''),
            amenityIds: (data.amenities || []).map((a: any) => a.amenityId),
            propertyDescription: data.description,
            mediaFiles: (data.media || []).map((m: any) => ({
              uri: m.fileUrl,
              fileName: m.fileName,
              type: m.fileType,
              isExisting: true,
              mediaId: m.mediaId,
            })),

            // Step 3: Legal
            titleStatus: data.titleStatus,
            occupancyCertificate: data.occupancyCertificate,
            leaseRegistration: data.leaseRegistration,
            pendingLitigations: data.hasPendingLitigation ? 'yes' : 'no',
            litigationNote: data.litigationDetails,
            certifications: data.certifications ? data.certifications : {},
            otherCertifications: data.certifications?.others || [''],

            // Step 4: Lease
            tenantType: data.tenantType,
            leaseStartDate: data.leaseStartDate,
            leaseExpiryDate: data.leaseEndDate,
            lockInYears: String(data.lockInPeriodYears || ''),
            lockInMonths: String(data.lockInPeriodMonths || ''),
            leaseDuration: String(data.leaseDurationYears || ''),
            rentType: data.rentType === 'Per Sq Ft' ? 'perSqFt' : 'lumpSum',
            rentPerSqFt: String(data.rentPerSqftMonthly || ''),
            totalMonthlyRent: String(data.totalMonthlyRent || ''),
            securityDepositType:
              data.securityDepositType === 'Months of Rent'
                ? 'months'
                : 'lumpSum',
            securityDepositMonths: String(data.securityDepositMonths || ''),
            securityDepositAmount: String(data.securityDepositAmount || ''),
            escalationPercentage: String(data.annualEscalationPercent || ''),
            escalationFrequency: String(data.escalationFrequencyYears || ''),
            maintenanceScope: data.maintenanceCostsIncluded?.includes(
              'included',
            )
              ? 'included'
              : 'excluded',
            maintenanceType:
              data.maintenanceType === 'Per Sq Ft' ? 'perSqFt' : 'lumpSum',
            maintenanceAmount: String(data.maintenanceAmount || ''),

            // Step 5: Financial
            sellingPrice: String(data.sellingPrice || ''),
            propertyTax: String(data.propertyTaxAnnual || ''),
            insurance: String(data.insuranceAnnual || ''),
            otherCosts: String(data.otherCostsAnnual || ''),
            additionalIncome: String(data.additionalIncomeAnnual || ''),

            // Step 6: Location
            microMarket: data.microMarket,
            city: data.city,
            state: data.state,
            demandDrivers: data.demandDrivers,
            futureInfrastructure: data.upcomingDevelopments,
            connectivity: (data.connectivity || []).map(
              (c: any, idx: number) => ({
                id: idx + 1,
                type: c.connectivityType,
                name: c.name,
                distance: String(c.distanceKm || ''),
              }),
            ),
            faqs: data.faqs || [],
          };

          if (mappedData.connectivity.length === 0) {
            mappedData.connectivity = [
              { id: 1, type: '', name: '', distance: '' },
            ];
          }

          setFormData(mappedData);
          setInitialLoading(false);
          setIsFormValid(true);
        },
        err => {
          console.error('Error fetching property for edit:', err);
          setInitialLoading(false);
          Alert.alert('Error', 'Failed to fetch property details.');
        },
      );
    }
  }, [propertyId, isEditMode]);

  const submitProperty = async (finalData: any) => {
    try {
      setErrorMessage(null);
      console.log('Submitting Property Data:', finalData);

      const apiFormData = new FormData();

      // --- Identification ---
      if (finalData.listUnder) {
        apiFormData.append('createdAs', finalData.listUnder);
      }

      // --- Basic Details ---
      if (finalData.propertyType)
        apiFormData.append('propertyType', finalData.propertyType);
      if (finalData.carpetArea)
        apiFormData.append('carpetArea', finalData.carpetArea);
      if (finalData.builtYear)
        apiFormData.append('completionYear', finalData.builtYear);
      if (finalData.lastRefurbished)
        apiFormData.append('lastRefurbished', finalData.lastRefurbished);
      if (finalData.ownership)
        apiFormData.append('ownershipType', finalData.ownership);
      if (finalData.buildingGrade)
        apiFormData.append('buildingGrade', finalData.buildingGrade);

      // Parking
      apiFormData.append('parkingFourWheeler', finalData.fourWheelerParkings || '0');
      apiFormData.append('parkingTwoWheeler', finalData.twoWheelerParkings || '0');

      // Infrastructure
      if (finalData.powerBackup)
        apiFormData.append('powerBackupKva', finalData.powerBackup);
      apiFormData.append('numberOfLifts', finalData.numLifts || '0');
      if (finalData.hvacType)
        apiFormData.append('hvacType', finalData.hvacType);
      if (finalData.furnishingStatus)
        apiFormData.append('furnishingStatus', finalData.furnishingStatus);
      if (finalData.buildingMaintained)
        apiFormData.append('caretakerId', finalData.buildingMaintained);

      apiFormData.append(
        'amenityIds',
        JSON.stringify(finalData.amenityIds || []),
      );

      // Description
      apiFormData.append('description', finalData.propertyDescription || '');

      // --- Legal Details ---
      if (finalData.titleStatus)
        apiFormData.append('titleStatus', finalData.titleStatus);
      if (finalData.occupancyCertificate)
        apiFormData.append(
          'occupancyCertificate',
          finalData.occupancyCertificate,
        );
      if (finalData.leaseRegistration)
        apiFormData.append('leaseRegistration', finalData.leaseRegistration);
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
      if (finalData.tenantType)
        apiFormData.append('tenantType', finalData.tenantType);
      if (finalData.leaseStartDate)
        apiFormData.append('leaseStartDate', finalData.leaseStartDate);
      if (finalData.leaseExpiryDate)
        apiFormData.append('leaseEndDate', finalData.leaseExpiryDate);
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
          if (file.isExisting) {
            // If it's an existing file, we might need a separate way to tell backend to KEEP it
            // or just skip it if backend handles delta updates.
            // For now, let's just not append it as a new file.
            return;
          }
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

      const onSuccess = (response: any) => {
        if (Platform.OS === 'web') {
          navigate('/dashboard');
        } else {
          Alert.alert(
            'Success',
            isEditMode
              ? 'Property Updated Successfully!'
              : 'Property Listed Successfully!',
            [{ text: 'OK', onPress: () => navigate('/dashboard') }],
          );
        }
      };

      const onError = (error: any) => {
        const message =
          error?.response?.data?.message ||
          `Failed to ${
            isEditMode ? 'update' : 'list'
          } property. Please try again.`;

        setErrorMessage(message);
        scrollRef.current?.scrollTo({ y: 0, animated: true });

        Alert.alert('Error', message);
        console.error(
          `Property ${isEditMode ? 'update' : 'creation'} error:`,
          error,
        );
      };

      // Call API
      if (isEditMode && propertyId) {
        updateProperty(propertyId, apiFormData, onSuccess, onError);
      } else {
        createProperty(apiFormData, onSuccess, onError);
      }
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
    setErrorMessage(null);

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
      setErrorMessage(null);
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
            isEditMode={isEditMode}
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
        <ImageBackground
          source={bannerBg}
          style={[styles.heroSection, isMobile && styles.heroSectionMobile]}
          resizeMode="cover"
        >
          <Text style={[styles.heroTitle, isMobile && styles.heroTitleMobile]}>
            {isEditMode ? 'Edit Your Property' : 'List Your Property'}
          </Text>
          <Text
            style={[styles.heroSubtext, isMobile && styles.heroSubtextMobile]}
          >
            {isEditMode
              ? 'Update your property details to keep investors informed'
              : 'Connect with serious investors looking for pre-leased commercial\n properties across India'}
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
              <Image 
                source={bulk} 
                style={{ width: isMobile ? 14 : 15, height: isMobile ? 14 : 15 }} 
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
        </ImageBackground>

        {/* Dynamic Stepper Cards */}
        <View style={styles.stepperWrapper}>
          <ScrollView
            ref={stepperScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={isMobile ? { width: '100%' } : undefined}
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
          {errorMessage && (
            <View style={styles.errorBanner}>
              <AlertTriangle size={16} color="#EE2529" strokeWidth={3} />
              <Text style={styles.errorBannerText}>{errorMessage}</Text>
              {(errorMessage.includes('broker profile') ||
                errorMessage.includes('complete your profile')) && (
                <TouchableOpacity
                  style={styles.errorActionBtn}
                  onPress={() => navigate('/my-prifile')}
                >
                  <Text style={styles.errorActionText}>Go to Profile</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          <View style={[styles.formCard, isMobile && styles.formCardMobile]}>
            <View style={styles.badgeRow}>
              <View style={styles.wizardStepBadge}>
                <Text style={styles.wizardStepText}>Step {currentStep} of 6</Text>
              </View>
              <View style={styles.wizardProgressBadge}>
                <Text style={styles.wizardStepText}>
                  {Math.round((currentStep / 6) * 100)}% complete
                </Text>
              </View>
            </View>

            {initialLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#EE2529" />
                <Text style={styles.loadingText}>
                  Fetching property details...
                </Text>
              </View>
            ) : (
              <View style={{ marginTop: 60 }}>
                {renderStep()}
              </View>
            )}
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
                    numberOfLines={1}
                  >
                    {currentStep === 6
                      ? isEditMode
                        ? 'Update Property'
                        : 'List Property'
                      : 'Next'}
                  </Text>
                 
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
  loadingContainer: {
    flex: 1,
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
    fontWeight: '600',
    fontFamily: FONTS.main,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 100,
    width: '100%',
  },
  heroSectionMobile: {
    paddingVertical: 24,
  },
  heroTitle: {
    fontSize: 56,
    fontWeight: '700',
    color: '#262626',
    marginBottom: 10,
    textAlign: 'center',
    lineHeight: 64,
    fontFamily: FONTS.avenir,
  },
  heroTitleMobile: {
    fontSize: 22,
    marginBottom: 8,
  },
  heroSubtext: {
    fontSize: 20,
    color: '#767676',
    textAlign: 'center',
    lineHeight: 32,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontFamily: FONTS.main,
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
    paddingRight: 8,
    paddingVertical: 12,
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
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
    fontFamily: FONTS.main,
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
    height: 140,
    borderRadius: 12,
    borderTopWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    padding: 12,
  },
  stepCardMobile: {
    height: 100,
    borderRadius: 10,
    padding: 10,
  },
  stepCardCurrent: {
    shadowOpacity: 0.15,
    elevation: 6,
    transform: [{ scale: 1.02 }],
  },
  stepCardLabel: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 8,
    fontFamily: FONTS.main,
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
    fontFamily: FONTS.main,
  },
  backBtnTextMobile: {
    fontSize: 13,
  },
  nextBtn: {
    backgroundColor: '#EE2529',
    flex: 0,
    flexGrow: 1,
    maxWidth: 150,
    marginLeft: 16,
  },
  nextBtnDisabled: {
    backgroundColor: '#FFCDD2',
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 18,
    marginRight: 4,
    fontFamily: 'Montserrat',
  },
  nextBtnTextMobile: {
    fontSize: 14,
  },
  btnHidden: {
    opacity: 0,
  },
  errorBanner: {
    backgroundColor: '#FFEBEE',
    width: '80%',
    maxWidth: 1200,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#EE2529',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  errorBannerText: {
    color: '#EE2529',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    fontFamily: FONTS.main,
  },
  errorActionBtn: {
    backgroundColor: '#EE2529',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 12,
  },
  errorActionText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: FONTS.main,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    position: 'absolute',
    top: 25,
    paddingHorizontal: 30,
    zIndex: 10,
  },
  wizardStepBadge: {
    backgroundColor: '#FFF3CA',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
  },
  wizardProgressBadge: {
    backgroundColor: '#FFF3CA',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
  },
  wizardStepText: {
    fontFamily: FONTS.main,
    fontSize: 14,
    fontWeight: '600',
    color: '#8B7B3E',
  },
});

export default ListPropertyScreen;
