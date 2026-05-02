export type WaitlistEntry = {
  id: string;
  email: string;
  created_at: string;
};

export type ActionResult<T = void> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string };
