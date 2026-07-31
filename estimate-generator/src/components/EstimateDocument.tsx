import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import {
  type Client,
  type Company,
  type EstimateLine,
  type Totals,
  formatDate,
  formatMoney,
  lineAmount,
} from '@/lib/estimate';

const INK = '#111827';
const INK_SOFT = '#4b5563';
const LINE = '#d6dae1';
const SHADE = '#f4f6f8';
const HEADER_BG = '#1f2937';

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 46,
    paddingHorizontal: 44,
    fontSize: 9.5,
    fontFamily: 'Helvetica',
    color: INK,
    lineHeight: 1.4,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerBlock: { marginBottom: 4 },
  headerLeft: { width: '50%' },
  headerRight: { width: '50%', textAlign: 'right' },
  logo: { maxWidth: 170, maxHeight: 64, objectFit: 'contain' },
  businessName: { fontSize: 15, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  companyLine: { color: INK_SOFT, fontSize: 9 },

  rule: { borderBottomWidth: 1.5, borderBottomColor: INK, marginTop: 14 },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 14,
  },
  title: { fontSize: 24, fontFamily: 'Helvetica-Bold', letterSpacing: 2 },
  metaTable: { textAlign: 'right' },
  metaRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 2 },
  metaLabel: { color: INK_SOFT, fontSize: 9 },
  metaValue: { fontFamily: 'Helvetica-Bold', fontSize: 9, marginLeft: 8, minWidth: 90, textAlign: 'right' },

  parties: { flexDirection: 'row', marginTop: 12, gap: 24 },
  party: { flex: 1 },
  partyLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
    color: INK_SOFT,
    marginBottom: 4,
  },
  partyName: { fontFamily: 'Helvetica-Bold', fontSize: 11, marginBottom: 1 },

  table: { marginTop: 18 },
  tableHead: {
    flexDirection: 'row',
    backgroundColor: HEADER_BG,
    paddingVertical: 7,
    paddingHorizontal: 8,
  },
  headCell: { color: '#ffffff', fontSize: 8, fontFamily: 'Helvetica-Bold', letterSpacing: 0.8 },
  row: {
    flexDirection: 'row',
    paddingVertical: 4.5,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: LINE,
  },
  rowShaded: { backgroundColor: SHADE },
  colDescription: { flex: 1, paddingRight: 10 },
  colQty: { width: 46, textAlign: 'right' },
  colUnit: { width: 62, paddingLeft: 8 },
  colRate: { width: 68, textAlign: 'right' },
  colAmount: { width: 76, textAlign: 'right' },

  totals: { marginTop: 12, flexDirection: 'row', justifyContent: 'flex-end' },
  totalsBox: { width: 252 },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  totalsLabel: { color: INK_SOFT },
  totalsValue: { textAlign: 'right' },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
    paddingHorizontal: 8,
    marginTop: 4,
    backgroundColor: HEADER_BG,
  },
  grandTotalLabel: {
    color: '#ffffff',
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  grandTotalValue: { color: '#ffffff', fontFamily: 'Helvetica-Bold', fontSize: 13 },

  notes: { marginTop: 14, borderTopWidth: 0.5, borderTopColor: LINE, paddingTop: 10 },
  notesHeading: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
    color: INK_SOFT,
    marginBottom: 5,
  },
  notesBody: { color: INK, fontSize: 8.5, lineHeight: 1.4 },

  /**
   * Deliberately compact: a full two-column signature block pushed a typical
   * eight-line estimate onto a second, almost-empty page.
   */
  acceptance: { flexDirection: 'row', marginTop: 12, gap: 24 },
  acceptanceWide: {
    flex: 2,
    borderTopWidth: 0.75,
    borderTopColor: INK,
    marginTop: 14,
    paddingTop: 3,
  },
  acceptanceNarrow: {
    flex: 1,
    borderTopWidth: 0.75,
    borderTopColor: INK,
    marginTop: 14,
    paddingTop: 3,
  },
  signatureLabel: { fontSize: 8, color: INK_SOFT },

  // Absolutely-positioned text needs an explicit width in react-pdf; without
  // one the box collapses and the content never lays out. These repeat on
  // every page so a stapled multi-page estimate cannot get shuffled.
  footerLeft: {
    position: 'absolute',
    bottom: 26,
    left: 44,
    width: 380,
    color: INK_SOFT,
    fontSize: 8,
  },
  footerRight: {
    position: 'absolute',
    bottom: 26,
    right: 44,
    width: 120,
    color: INK_SOFT,
    fontSize: 8,
    textAlign: 'right',
  },
});

export type EstimateDocumentProps = {
  company: Company;
  client: Client;
  lines: EstimateLine[];
  totals: Totals;
  markupPercent: number;
  taxPercent: number;
  notes: string;
};

function MetaRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <View style={styles.metaRow}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

export function EstimateDocument({
  company,
  client,
  lines,
  totals,
  markupPercent,
  taxPercent,
  notes,
}: EstimateDocumentProps) {
  const businessName = company.businessName.trim() || 'Your Business Name';
  const companyLines = [company.address, company.phone, company.email].filter(
    (value) => value.trim().length > 0,
  );
  const notesParagraphs = notes
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <Document
      title={`Estimate ${client.estimateNumber} — ${businessName}`}
      author={businessName}
      subject={client.projectName || 'Estimate'}
      creator={businessName}
      producer={businessName}
    >
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header} fixed>
          <View style={styles.headerLeft}>
            {company.logoDataUrl ? (
              // eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image takes no alt
              <Image style={styles.logo} src={company.logoDataUrl} />
            ) : (
              <Text style={styles.businessName}>{businessName}</Text>
            )}
          </View>
          <View style={styles.headerRight}>
            {company.logoDataUrl ? (
              <Text style={styles.businessName}>{businessName}</Text>
            ) : null}
            {companyLines.map((value) => (
              <Text key={value} style={styles.companyLine}>
                {value}
              </Text>
            ))}
            {company.licenceNumber.trim() ? (
              <Text style={styles.companyLine}>Licence #{company.licenceNumber}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.rule} fixed />

        <View style={styles.titleRow}>
          <Text style={styles.title}>ESTIMATE</Text>
          <View style={styles.metaTable}>
            <MetaRow label="Estimate no." value={client.estimateNumber} />
            <MetaRow label="Date" value={formatDate(client.date)} />
            <MetaRow label="Valid until" value={formatDate(client.validUntil)} />
          </View>
        </View>

        <View style={styles.parties}>
          <View style={styles.party}>
            <Text style={styles.partyLabel}>BILL TO</Text>
            <Text style={styles.partyName}>
              {client.clientName.trim() || 'Customer name'}
            </Text>
            {client.clientAddress
              .split('\n')
              .filter((value) => value.trim())
              .map((value, index) => (
                <Text key={`${value}-${index}`} style={styles.companyLine}>
                  {value}
                </Text>
              ))}
          </View>
          {client.projectName.trim() ? (
            <View style={styles.party}>
              <Text style={styles.partyLabel}>PROJECT</Text>
              <Text style={styles.partyName}>{client.projectName}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.table}>
          <View style={styles.tableHead} fixed>
            <Text style={[styles.headCell, styles.colDescription]}>DESCRIPTION</Text>
            <Text style={[styles.headCell, styles.colQty]}>QTY</Text>
            <Text style={[styles.headCell, styles.colUnit]}>UNIT</Text>
            <Text style={[styles.headCell, styles.colRate]}>RATE</Text>
            <Text style={[styles.headCell, styles.colAmount]}>AMOUNT</Text>
          </View>

          {lines.map((line, index) => (
            <View
              key={line.id}
              style={index % 2 === 1 ? [styles.row, styles.rowShaded] : styles.row}
              wrap={false}
            >
              <Text style={styles.colDescription}>{line.description || '—'}</Text>
              <Text style={styles.colQty}>{formatQty(line.qty)}</Text>
              <Text style={styles.colUnit}>{line.unit}</Text>
              <Text style={styles.colRate}>{formatMoney(line.rate)}</Text>
              <Text style={styles.colAmount}>{formatMoney(lineAmount(line))}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totals} wrap={false}>
          <View style={styles.totalsBox}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Subtotal</Text>
              <Text style={styles.totalsValue}>{formatMoney(totals.subtotal)}</Text>
            </View>
            {markupPercent > 0 ? (
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>
                  Overhead and profit ({formatPercent(markupPercent)}%)
                </Text>
                <Text style={styles.totalsValue}>{formatMoney(totals.markupAmount)}</Text>
              </View>
            ) : null}
            {taxPercent > 0 ? (
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Tax ({formatPercent(taxPercent)}%)</Text>
                <Text style={styles.totalsValue}>{formatMoney(totals.taxAmount)}</Text>
              </View>
            ) : null}
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>TOTAL</Text>
              <Text style={styles.grandTotalValue}>{formatMoney(totals.total)}</Text>
            </View>
          </View>
        </View>

        {notesParagraphs.length > 0 ? (
          <View style={styles.notes} wrap={false}>
            <Text style={styles.notesHeading}>NOTES AND TERMS</Text>
            {notesParagraphs.map((paragraph, index) => (
              <Text key={`${index}-${paragraph.slice(0, 12)}`} style={styles.notesBody}>
                {paragraph}
              </Text>
            ))}
          </View>
        ) : null}

        <View style={styles.acceptance} wrap={false}>
          <View style={styles.acceptanceWide}>
            <Text style={styles.signatureLabel}>Accepted by (customer signature)</Text>
          </View>
          <View style={styles.acceptanceNarrow}>
            <Text style={styles.signatureLabel}>Date</Text>
          </View>
        </View>

        <Text style={styles.footerLeft} fixed>
          {businessName}
          {client.estimateNumber ? ` · Estimate ${client.estimateNumber}` : ''}
        </Text>
        <Text style={styles.footerRight} fixed>
          {client.date ? formatDate(client.date) : ''}
        </Text>
      </Page>
    </Document>
  );
}

function formatQty(qty: number): string {
  if (!Number.isFinite(qty)) return '0';
  return Number.isInteger(qty) ? String(qty) : qty.toFixed(2);
}

function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return '0';
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}
