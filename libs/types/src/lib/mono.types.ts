type VerificationMethodType = 'email' | 'phone' | 'phone_1' | 'alternate_phone';

interface VerificationMethod {
  method: VerificationMethodType;
  hint: string;
}

export interface BvnLookupData {
  status: string;
  message: string;
  data: {
    session_id: string;
    bvn: string;
    methods: VerificationMethod[];
  };
}

export interface BvnVerifyRequest {
  method: VerificationMethodType;
  phoneNumber?: string;
}

export interface MonoResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface OtpVerifyRequest {
  otp: string;
}

interface Institution {
  name: string;
  branch: string;
  bank_code: string;
}

export interface BankAccount {
  account_name: string;
  account_number: string;
  account_type: 'SAVINGS' | 'CURRENT';
  account_designation: 'OTHERS';
  institution: Institution;
}

export type BankAccountsMonoResponse = MonoResponse<BankAccount[]>;
