import { UserType } from "@/constants/userTypes";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost/charming_api';

export interface User {
  id: string;
  username: string;
  email: string;
  user_type: UserType;
  first_name: string;
  middle_name?: string;
  last_name: string;
  suffix?: string;
  date_of_birth: string;
  sex: string;
  blood_type?: string;
  civil_status: string;
  type_of_disability?: string;
  religion?: string;
  educational_attainment: string;
  house_no_and_street: string;
  barangay: string;
  municipality: string;
  province: string;
  region: string;
  cellphone_number: string;
  type_of_employment?: string;
  civil_service_eligibility_level?: string;
  salary_grade?: string;
  present_position?: string;
  office?: string;
  service?: string;
  division_province?: string;
  emergency_contact_name?: string;
  emergency_contact_relationship?: string;
  emergency_contact_address?: string;
  emergency_contact_number?: string;
  emergency_contact_email?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  user_type: UserType;
  first_name: string;
  middle_name?: string;
  last_name: string;
  suffix?: string;
  date_of_birth: string;
  sex: string;
  blood_type?: string;
  civil_status: string;
  type_of_disability?: string;
  religion?: string;
  educational_attainment: string;
  house_no_and_street: string;
  barangay: string;
  municipality: string;
  province: string;
  region: string;
  cellphone_number: string;
  type_of_employment?: string;
  civil_service_eligibility_level?: string;
  salary_grade?: string;
  present_position?: string;
  office?: string;
  service?: string;
  division_province?: string;
  emergency_contact_name?: string;
  emergency_contact_relationship?: string;
  emergency_contact_address?: string;
  emergency_contact_number?: string;
  emergency_contact_email?: string;
}

export const adminService = {
  async getAllUsers() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users.php`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          users: result.users || [],
        };
      } else {
        return {
          success: false,
          message: result.message || 'Failed to fetch users',
          users: [],
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch users',
        users: [],
      };
    }
  },

  async getUserById(userId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users.php?id=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          user: result.user,
        };
      } else {
        return {
          success: false,
          message: result.message || 'Failed to fetch user',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch user',
      };
    }
  },

  async createUser(data: CreateUserData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const rawText = await response.text();
      let result: any = null;
      try {
        result = rawText ? JSON.parse(rawText) : null;
      } catch {
        result = null;
      }

      if (response.ok) {
        return {
          success: true,
          message: result?.message || 'User created successfully',
          user: result?.user,
        };
      } else {
        return {
          success: false,
          message: result?.message || rawText || 'Failed to create user',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create user',
      };
    }
  },

  async updateUser(userId: string, data: Partial<CreateUserData>) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userId, ...data }),
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: result.message || 'User updated successfully',
          user: result.user,
        };
      } else {
        return {
          success: false,
          message: result.message || 'Failed to update user',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update user',
      };
    }
  },

  async deleteUser(userId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users.php`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userId }),
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: result.message || 'User deleted successfully',
        };
      } else {
        return {
          success: false,
          message: result.message || 'Failed to delete user',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete user',
      };
    }
  },

  async getUsersByType(userType: UserType) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users.php?user_type=${userType}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          users: result.users || [],
        };
      } else {
        return {
          success: false,
          message: result.message || 'Failed to fetch users',
          users: [],
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch users',
        users: [],
      };
    }
  },
};
