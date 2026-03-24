const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost/charming_api';

export interface EnrollmentStudent {
  first_name: string;
  last_name: string;
  middle_name?: string;
  email: string;
  cellphone_number?: string;
  profile_image_url?: string;
}

export interface EnrollmentCourse {
  course_code: string;
  course_name: string;
  category?: string;
  subcategory?: string;
  duration_hours?: number;
}

export interface EnrollmentApprover {
  first_name: string;
  last_name: string;
}

export interface PendingEnrollment {
  enrollment_id: number;
  course_id: number;
  student_id: number;
  student_uuid: string;
  enrollment_date: string;
  status: 'pending' | 'enrolled' | 'rejected';
  approved_by?: number;
  approved_at?: string;
  rejection_reason?: string;
  course: EnrollmentCourse;
  student: EnrollmentStudent;
  approver?: EnrollmentApprover | null;
}

export interface FetchEnrollmentsResponse {
  success: boolean;
  enrollments: PendingEnrollment[];
  count: number;
  message?: string;
}

export interface ApproveEnrollmentRequest {
  enrollment_id: number;
  action: 'approve' | 'reject';
  management_user_id: number;
  rejection_reason?: string;
  management_message?: string;
}

export interface ApproveEnrollmentResponse {
  success: boolean;
  message: string;
  enrollment_id?: number;
  new_status?: string;
}

export const managementService = {
  async fetchEnrollments(status: string = 'pending'): Promise<FetchEnrollmentsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/management/pending-enrollments.php?status=${status}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      return {
        success: false,
        enrollments: [],
        count: 0,
        message: 'Failed to fetch enrollments'
      };
    }
  },

  async approveEnrollment(request: ApproveEnrollmentRequest): Promise<ApproveEnrollmentResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/management/approve-enrollment.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error approving enrollment:', error);
      return {
        success: false,
        message: 'Failed to process enrollment'
      };
    }
  },

  async rejectEnrollment(enrollmentId: number, managementUserId: number, reason?: string): Promise<ApproveEnrollmentResponse> {
    return this.approveEnrollment({
      enrollment_id: enrollmentId,
      action: 'reject',
      management_user_id: managementUserId,
      rejection_reason: reason
    });
  }
};
