import { createClient } from '@/utils/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { Transaction, WasteListing } from '@/types/marketplace';

const supabase = createClient();

interface WasteTransferNote {
  id: string;
  transactionId: string;
  sellerId: string;
  buyerId: string;
  wasteType: string;
  quantity: number;
  unit: string;
  pickupLocation: string;
  destination: string;
  pickupDate: string;
  transporterDetails?: string;
  vehicleRegNumber?: string;
  wasteDescription: string;
  ewcCode?: string; // European Waste Catalogue code
  specialHandlingRequirements?: string;
  documentUrl: string;
  createdAt: string;
  updatedAt: string;
}

export class DocumentService {
  private static instance: DocumentService;

  private constructor() {}

  public static getInstance(): DocumentService {
    if (!DocumentService.instance) {
      DocumentService.instance = new DocumentService();
    }
    return DocumentService.instance;
  }

  public async generateWasteTransferNote(
    transaction: Transaction,
    listing: WasteListing,
    sellerDetails: any,
    buyerDetails: any
  ): Promise<{ success: boolean; documentUrl?: string; error?: string }> {
    try {
      // 1. Prepare document data
      const documentId = `wtn-${uuidv4()}`;
      const documentData = {
        id: documentId,
        transactionId: transaction.id,
        sellerId: transaction.sellerId,
        buyerId: transaction.buyerId,
        wasteType: listing.wasteType,
        quantity: transaction.quantity,
        unit: transaction.unit,
        pickupLocation: listing.location.address,
        destination: buyerDetails.address,
        pickupDate: new Date().toISOString(),
        wasteDescription: listing.description,
        ewcCode: this.getEWCCode(listing.wasteType),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // 2. Generate PDF (in a real app, you'd use a PDF generation library)
      const pdfUrl = await this.generatePDF('waste-transfer-note', documentData);
      
      // 3. Store the document reference
      const { error } = await supabase
        .from('documents')
        .insert([
          {
            id: documentId,
            type: 'waste_transfer_note',
            transaction_id: transaction.id,
            document_url: pdfUrl,
            metadata: documentData
          }
        ]);

      if (error) throw error;

      // 4. Update transaction with document reference
      await supabase
        .from('transactions')
        .update({ waste_transfer_note_id: documentId })
        .eq('id', transaction.id);

      return { success: true, documentUrl: pdfUrl };
    } catch (error) {
      console.error('Error generating waste transfer note:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate document' 
      };
    }
  }

  public async getDocument(documentId: string) {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching document:', error);
      return null;
    }
  }

  public async getTransactionDocuments(transactionId: string) {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('transaction_id', transactionId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching transaction documents:', error);
      return [];
    }
  }

  private getEWCCode(wasteType: string): string {
    // Map waste types to EWC codes (simplified example)
    const ewcCodes: Record<string, string> = {
      'plastic': '15 01 02',
      'paper': '20 01 01',
      'glass': '15 01 07',
      'metal': '17 04 05',
      'organic': '20 01 08',
      'e-waste': '16 02 13',
      'hazardous': '16 06 01',
      'construction': '17 01 01',
      'textile': '04 02 21',
      'other': '20 03 01'
    };

    return ewcCodes[wasteType] || '20 03 01'; // Default to 'other'
  }

  private async generatePDF(templateName: string, data: any): Promise<string> {
    // In a real app, this would generate a PDF using a library like pdfkit, jsPDF, or an API
    // For now, we'll return a placeholder URL
    return `https://api.wastematch.ke/documents/${templateName}/${data.id}.pdf`;
  }
}

export const documentService = DocumentService.getInstance();
