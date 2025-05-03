
import { User } from "@/types";

// This utility file contains functions related to user management
// that we can use across our application

/**
 * Removes a user from a list of users
 * @param users The current list of users
 * @param userId The ID of the user to remove
 * @returns A new array with the user removed
 */
export const removeUserFromList = (users: User[], userId: string): User[] => {
  return users.filter(user => user.id !== userId);
};

/**
 * Checks if a user email already exists in the system
 * @param users The current list of users
 * @param email The email to check
 * @returns Boolean indicating if the email exists
 */
export const doesEmailExist = (users: User[], email: string): boolean => {
  return users.some(user => user.email === email);
};

/**
 * Gets the count of users in a specific department
 * @param users The list of users
 * @param department The department to check
 * @returns Number of users in the department
 */
export const getUserCountByDepartment = (
  users: User[],
  department: string
): number => {
  return users.filter(user => user.department === department).length;
};

/**
 * Gets the count of users with a specific role
 * @param users The list of users
 * @param role The role to check
 * @returns Number of users with the role
 */
export const getUserCountByRole = (
  users: User[],
  role: "Admin" | "Member"
): number => {
  return users.filter(user => user.role === role).length;
};
