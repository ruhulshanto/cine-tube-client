export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export type PaymentType = "PURCHASE" | "RENTAL" | "SUBSCRIPTION";

export interface AdminPaymentRow {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  type: PaymentType;
  description: string | null;
  createdAt: string;
  user: {
    id: string;
    username: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
  movie: { id: string; title: string } | null;
  subscription: { id: string; plan: string; status: string } | null;
}
