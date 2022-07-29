export interface ICreateTransferDTO {
  receiver_id?: string;
  sender_id: string;
  amount: number;
  description: string;
}
