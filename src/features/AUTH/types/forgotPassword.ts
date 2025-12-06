export interface IMobileNo {
	mobile_no: string;
}


export interface IOtp {
	mobile_no: string;
	otp?: number;
}


export interface IPassword {
	mobile_no: string;
	password: string;
}

export type Step = 'mobile' | 'otp' | 'password' | 'success';

