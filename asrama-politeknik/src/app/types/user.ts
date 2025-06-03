export interface User {
  id?: number;
  username?: string;
  email?: string;
  dormRoomNumber?: string;
  dormApplicationStatus?: "none" | "pending" | "approved" | "rejected";
}
