import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';

interface TemplateConfig {
  fonts?: {
    title?: { family?: string; size?: number; weight?: string; color?: string };
    subtitle?: { family?: string; size?: number; color?: string };
    name?: { family?: string; size?: number; weight?: string; color?: string };
    course?: { family?: string; size?: number; weight?: string; color?: string };
    body?: { family?: string; size?: number; color?: string };
  };
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    border?: string;
  };
}

interface CertificateData {
  participantName: string;
  documentType: string;
  documentNumber: string;
  courseName: string;
  courseType: 'DIPLOMADO' | 'CERTIFICADO' | 'CONSTANCIA';
  hours: number;
  chronologicalHours?: number;
  credits?: number;
  syllabus: string[];
  modality: string;
  startDate?: string;
  endDate?: string;
  issueDate: string;
  verificationCode: string;
  verificationUrl: string;
  qrCodeDataUrl?: string;
  logoUrl?: string;
  logoGobUrl?: string;
  watermarkUrl?: string;
  signatureUrl?: string;
  isPreview: boolean;
  config?: TemplateConfig;
}

const typeLabels = {
  DIPLOMADO: 'DIPLOMADO',
  CERTIFICADO: 'CERTIFICADO',
  CONSTANCIA: 'CONSTANCIA',
};

// Professional certificate styles - Two column layout
const styles = StyleSheet.create({
  page: {
    position: 'relative',
    backgroundColor: '#ffffff',
  },
  // Security pattern background
  securityPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  securityLine: {
    position: 'absolute',
    height: 1,
    left: 0,
    right: 0,
    backgroundColor: '#f5f5f5',
  },
  // Decorative borders - gold elegant style
  borderOuter: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    bottom: 12,
    borderWidth: 3,
    borderColor: '#c9a227',
    borderStyle: 'solid',
  },
  borderInner: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    borderWidth: 1,
    borderColor: '#c9a227',
    borderStyle: 'solid',
  },
  // Watermark image - elegant center logo
  watermarkContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  watermarkImage: {
    width: 650,
    height: 325,
    opacity: 0.06,
  },
  // Watermark text for preview
  watermarkText: {
    position: 'absolute',
    top: '35%',
    left: '5%',
    transform: 'rotate(-35deg)',
    fontSize: 72,
    color: '#e0e0e0',
    fontWeight: 'bold',
    letterSpacing: 15,
  },
  previewBadge: {
    position: 'absolute',
    top: 25,
    right: 25,
    backgroundColor: '#dc2626',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  previewBadgeText: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold',
  },
  // Content container
  content: {
    position: 'relative',
    width: '100%',
    height: '100%',
    padding: 35,
  },
  // Header with logos
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoLeft: {
    width: 70,
    height: 70,
    objectFit: 'contain',
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },
  institutionName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#dc2626',
    letterSpacing: 1,
  },
  institutionSlogan: {
    fontSize: 8,
    color: '#666666',
    marginTop: 2,
  },
  logoRight: {
    width: 70,
    height: 70,
    objectFit: 'contain',
  },
  // Title section
  titleSection: {
    alignItems: 'center',
    marginBottom: 15,
  },
  certificateType: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1a1a1a',
    letterSpacing: 10,
  },
  // Decorative line under title
  decorativeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 5,
  },
  decorativeLineLeft: {
    width: 80,
    height: 1,
    backgroundColor: '#c9a227',
  },
  decorativeLineDiamond: {
    width: 8,
    height: 8,
    backgroundColor: '#c9a227',
    transform: 'rotate(45deg)',
    marginHorizontal: 10,
  },
  decorativeLineRight: {
    width: 80,
    height: 1,
    backgroundColor: '#c9a227',
  },
  subtitle: {
    fontSize: 11,
    color: '#555555',
    marginTop: 5,
  },
  // Main content - Two columns
  mainContent: {
    flexDirection: 'row',
    flex: 1,
  },
  // Left column - Certificate info
  leftColumn: {
    flex: 1,
    paddingRight: 20,
  },
  // Right column - Syllabus
  rightColumn: {
    width: 220,
    paddingLeft: 20,
    borderLeftWidth: 1,
    borderLeftColor: '#e0e0e0',
    borderLeftStyle: 'solid',
  },
  // Participant section
  participantSection: {
    alignItems: 'center',
    marginBottom: 15,
  },
  certifyText: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 8,
  },
  participantName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textTransform: 'uppercase',
    letterSpacing: 2,
    textAlign: 'center',
  },
  documentInfo: {
    fontSize: 9,
    color: '#777777',
    marginTop: 4,
  },
  // Course section
  courseSection: {
    alignItems: 'center',
    marginBottom: 15,
  },
  courseLabel: {
    fontSize: 9,
    color: '#666666',
    marginBottom: 6,
  },
  courseName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    lineHeight: 1.3,
  },
  // Course details
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 20,
  },
  detailItem: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  detailLabel: {
    fontSize: 6,
    color: '#999999',
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 2,
  },
  // Dates section
  datesSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
    gap: 30,
  },
  dateItem: {
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 6,
    color: '#999999',
    textTransform: 'uppercase',
  },
  dateValue: {
    fontSize: 8,
    color: '#444444',
    marginTop: 2,
  },
  // Syllabus section (right column)
  syllabusTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
    textAlign: 'center',
  },
  syllabusItemRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  syllabusBullet: {
    fontSize: 8,
    color: '#555555',
    width: 10,
  },
  syllabusItemText: {
    fontSize: 8,
    color: '#555555',
    flex: 1,
  },
  // Footer section
  footer: {
    position: 'absolute',
    bottom: 35,
    left: 35,
    right: 35,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  qrSection: {
    alignItems: 'center',
  },
  qrCode: {
    width: 55,
    height: 55,
  },
  verificationLabel: {
    fontSize: 5,
    color: '#999999',
    marginTop: 3,
  },
  verificationCode: {
    fontSize: 6,
    fontWeight: 'bold',
    color: '#444444',
  },
  signatureSection: {
    alignItems: 'center',
    width: 140,
  },
  signatureImage: {
    width: 180,
    height: 90,
    objectFit: 'contain',
    marginBottom: -20,
  },
  signatureLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#333333',
    marginBottom: 3,
  },
  signatureName: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#333333',
  },
  signatureTitle: {
    fontSize: 7,
    color: '#666666',
  },
  // Flag at bottom center
  flagContainer: {
    alignItems: 'center',
  },
  flagImage: {
    width: 75,
    height: 75,
  },
  // Official seal (next to flag in footer)
  sealContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15,
  },
  sealOuter: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#c9a227',
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  sealInner: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    borderWidth: 1,
    borderColor: '#c9a227',
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sealText: {
    fontSize: 6,
    color: '#c9a227',
    textAlign: 'center',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  sealTextMain: {
    fontSize: 7,
    color: '#dc2626',
    textAlign: 'center',
    fontWeight: 'bold',
    marginVertical: 2,
  },
  sealStar: {
    fontSize: 10,
    color: '#c9a227',
  },
});

export function CertificateDocument({ data }: { data: CertificateData }) {
  const typeLabel = typeLabels[data.courseType] || 'CERTIFICADO';

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Security Pattern Background */}
        <View style={styles.securityPattern}>
          {Array.from({ length: 30 }).map((_, i) => (
            <View
              key={i}
              style={{
                ...styles.securityLine,
                top: 25 + i * 18,
              }}
            />
          ))}
        </View>

        {/* Decorative Borders */}
        <View style={styles.borderOuter} />
        <View style={styles.borderInner} />

        {/* Elegant watermark image - always show */}
        {data.watermarkUrl && (
          <View style={styles.watermarkContainer}>
            <Image src={data.watermarkUrl} style={styles.watermarkImage} />
          </View>
        )}

        {/* Additional text watermark for preview */}
        {data.isPreview && (
          <Text style={styles.watermarkText}>VISTA PREVIA</Text>
        )}

        {/* Preview Badge */}
        {data.isPreview && (
          <View style={styles.previewBadge}>
            <Text style={styles.previewBadgeText}>VISTA PREVIA - NO VÁLIDO</Text>
          </View>
        )}

        {/* Content */}
        <View style={styles.content}>
          {/* Header with Logos */}
          <View style={styles.header}>
            {/* Left Logo - Company */}
            {data.logoUrl && (
              <Image src={data.logoUrl} style={styles.logoLeft} />
            )}

            {/* Center - Institution name */}
            <View style={styles.headerCenter}>
              <Text style={styles.institutionName}>CERTIFICADOSPERÚ</Text>
              <Text style={styles.institutionSlogan}>Formación profesional certificada</Text>
            </View>

            {/* Right Logo - Government */}
            {data.logoGobUrl && (
              <Image src={data.logoGobUrl} style={styles.logoRight} />
            )}
          </View>

          {/* Title */}
          <View style={styles.titleSection}>
            <Text style={styles.certificateType}>{typeLabel}</Text>
            {/* Decorative line */}
            <View style={styles.decorativeLine}>
              <View style={styles.decorativeLineLeft} />
              <View style={styles.decorativeLineDiamond} />
              <View style={styles.decorativeLineRight} />
            </View>
            <Text style={styles.subtitle}>Otorgado por CertificadosPerú</Text>
          </View>

          {/* Main Content - Two Columns */}
          <View style={styles.mainContent}>
            {/* Left Column - Certificate Info */}
            <View style={styles.leftColumn}>
              {/* Participant */}
              <View style={styles.participantSection}>
                <Text style={styles.certifyText}>Se certifica que:</Text>
                <Text style={styles.participantName}>{data.participantName}</Text>
                <Text style={styles.documentInfo}>
                  {data.documentType}: {data.documentNumber}
                </Text>
              </View>

              {/* Course */}
              <View style={styles.courseSection}>
                <Text style={styles.courseLabel}>
                  Ha culminado satisfactoriamente el programa de:
                </Text>
                <Text style={styles.courseName}>{data.courseName}</Text>

                <View style={styles.detailsRow}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Horas Académicas</Text>
                    <Text style={styles.detailValue}>{data.hours}</Text>
                  </View>
                  {data.chronologicalHours && (
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Horas Cronológicas</Text>
                      <Text style={styles.detailValue}>{data.chronologicalHours}</Text>
                    </View>
                  )}
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Modalidad</Text>
                    <Text style={styles.detailValue}>{data.modality}</Text>
                  </View>
                </View>
              </View>

              {/* Issue Date */}
              <View style={styles.datesSection}>
                <View style={styles.dateItem}>
                  <Text style={styles.dateLabel}>Fecha de Emisión</Text>
                  <Text style={styles.dateValue}>{data.issueDate}</Text>
                </View>
              </View>
            </View>

            {/* Right Column - Syllabus */}
            {data.syllabus && data.syllabus.length > 0 && (
              <View style={styles.rightColumn}>
                <Text style={styles.syllabusTitle}>CONTENIDO TEMÁTICO</Text>
                {data.syllabus.map((tema, index) => (
                  <View key={index} style={styles.syllabusItemRow}>
                    <Text style={styles.syllabusBullet}>•</Text>
                    <Text style={styles.syllabusItemText}>{tema}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            {/* QR Code */}
            {data.qrCodeDataUrl && (
              <View style={styles.qrSection}>
                <Image style={styles.qrCode} src={data.qrCodeDataUrl} />
                <Text style={styles.verificationLabel}>Verificar en:</Text>
                <Text style={styles.verificationCode}>{data.verificationCode}</Text>
              </View>
            )}

            {/* Official Seal - Center */}
            <View style={styles.sealContainer}>
              <View style={styles.sealOuter}>
                <View style={styles.sealInner}>
                  <Text style={styles.sealText}>CERTIFICADO</Text>
                  <Text style={styles.sealStar}>★</Text>
                  <Text style={styles.sealTextMain}>CERTIFICADOS{'\n'}PERÚ</Text>
                  <Text style={styles.sealStar}>★</Text>
                  <Text style={styles.sealText}>OFICIAL</Text>
                </View>
              </View>
            </View>

            {/* Signature */}
            <View style={styles.signatureSection}>
              {data.signatureUrl && (
                <Image src={data.signatureUrl} style={styles.signatureImage} />
              )}
              <View style={styles.signatureLine} />
              <Text style={styles.signatureName}>CertificadosPerú</Text>
              <Text style={styles.signatureTitle}>Director Académico</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export type { CertificateData, TemplateConfig };
