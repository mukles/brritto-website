"use server";

import { post, get } from "../api-client";
import { StandardApiResponse } from "@/types/api";
import { getSession } from "../session";

// ============================================================================
// Types
// ============================================================================

export type PaymentGatewayType = "BKASH" | "AAMARPAY";

export interface InitiatePaymentRequest {
  courseId: string;
  description: string;
  paymentType: PaymentGatewayType;
}

export interface InitiatePaymentData {
  result: boolean;
  paymentUrl: string;
}

export interface PaymentHistory {
  _id: string;
  orderId: string;
  tranId: string;
  amount: number;
  status: "COMPLETED" | "PENDING" | "FAILED";
  description: string;
  courseName: string;
  invoiceUrl?: string;
  createdAt: string;
}

// ============================================================================
// Service Functions
// ============================================================================

/**
 * Initiate a payment for course enrollment
 */
export async function initiatePayment(
  courseId: string,
  paymentType: PaymentGatewayType
): Promise<StandardApiResponse<InitiatePaymentData | null>> {
  const session = await getSession();

  if (!session) {
    return {
      success: false,
      statusCode: 401,
      message: "Please login to continue",
      data: null,
    };
  }

  try {
    const response = await post<InitiatePaymentData>(
      "/web/payments/initiate",
      {
        courseId,
        description: "Course purchase",
        paymentType,
      },
      session.accessToken
    );
    return response as StandardApiResponse<InitiatePaymentData | null>;
  } catch (error) {
    console.error("Failed to initiate payment:", error);
    return {
      success: false,
      statusCode: 500,
      message: "Failed to initiate payment. Please try again.",
      data: null,
    };
  }
}

/**
 * Get payment history
 */
export async function getPaymentHistory(
  page: number = 1,
  limit: number = 10
): Promise<StandardApiResponse<PaymentHistory[]>> {
  const session = await getSession();

  if (!session) {
    return {
      success: false,
      statusCode: 401,
      message: "Please login to view payment history",
      data: [],
    };
  }

  try {
    const response = await get<PaymentHistory[]>(
      `/web/payments/history?page=${page}&limit=${limit}`,
      session.accessToken
    );
    return response;
  } catch (error) {
    console.error("Failed to fetch payment history:", error);
    return {
      success: false,
      statusCode: 500,
      message: "Failed to fetch payment history",
      data: [],
    };
  }
}
