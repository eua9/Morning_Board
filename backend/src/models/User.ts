/**
 * User Model
 * Represents a user in the Morning Board application
 * 
 * Properties:
 * - id: Unique identifier
 * - email: User email address
 * - password: Hashed password (should never be returned in API responses)
 * - firstName: User's first name
 * - lastName: User's last name
 * - createdAt: Account creation timestamp
 * - updatedAt: Last update timestamp
 */

export interface IUser {
  id: string;
  email: string;
  password: string; // Hashed password
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User implements IUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<IUser>) {
    this.id = data.id || '';
    this.email = data.email || '';
    this.password = data.password || '';
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  /**
   * Get user's full name
   * @returns Full name string (firstName lastName)
   */
  getFullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  /**
   * Create a new user instance
   * @param userData - User data to create user from
   * @returns New User instance
   */
  static create(userData: Partial<IUser>): User {
    return new User({
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  /**
   * Update user properties
   * @param updates - Partial user data to update
   */
  update(updates: Partial<Omit<IUser, 'id' | 'createdAt'>>): void {
    Object.assign(this, updates);
    this.updatedAt = new Date();
  }

  /**
   * Convert user to plain object (excluding sensitive data)
   * @returns User object without password
   */
  toJSON(): Omit<IUser, 'password'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }

  /**
   * Validate user data
   * @returns true if user data is valid, false otherwise
   */
  validate(): boolean {
    // TODO: Implement validation logic
    // - Check email format
    // - Check password strength
    // - Validate required fields
    return !!(
      this.email &&
      this.password &&
      this.firstName &&
      this.lastName
    );
  }

  /**
   * Hash password (should use bcrypt or similar)
   * @param plainPassword - Plain text password
   * @returns Hashed password
   */
  static async hashPassword(plainPassword: string): Promise<string> {
    // TODO: Implement password hashing using bcrypt
    // Example: return await bcrypt.hash(plainPassword, 10);
    return Promise.resolve(plainPassword); // Placeholder
  }

  /**
   * Compare password with hashed password
   * @param plainPassword - Plain text password to compare
   * @param hashedPassword - Hashed password to compare against
   * @returns true if passwords match, false otherwise
   */
  static async comparePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    // TODO: Implement password comparison using bcrypt
    // Example: return await bcrypt.compare(plainPassword, hashedPassword);
    return plainPassword === hashedPassword; // Placeholder
  }

  /**
   * Find user by ID
   * @param _id - User ID
   * @returns User instance or null if not found
   */
  static async findById(_id: string): Promise<User | null> {
    // TODO: Implement database lookup
    // This should query the database for a user with the given ID
    return null;
  }

  /**
   * Find user by email
   * @param _email - User email
   * @returns User instance or null if not found
   */
  static async findByEmail(_email: string): Promise<User | null> {
    // TODO: Implement database lookup
    // This should query the database for a user with the given email
    return null;
  }

  /**
   * Save user to database
   * @returns Saved user instance
   */
  async save(): Promise<User> {
    // TODO: Implement database save operation
    // This should insert or update the user in the database
    this.updatedAt = new Date();
    return this;
  }

  /**
   * Delete user from database
   * @returns true if deleted successfully, false otherwise
   */
  async delete(): Promise<boolean> {
    // TODO: Implement database delete operation
    return false;
  }
}

