type VerificationMethodType = 'email' | 'phone' | 'phone_1' | 'alternate_phone';

interface VerificationMethod {
  method: VerificationMethodType;
  hint: string;
}

export interface BvnLookupData {
  session_id: string;
  bvn: string;
  methods: VerificationMethod[];
}

export interface BvnVerifyRequest {
  method: VerificationMethodType;
  phone_number: string;
}

