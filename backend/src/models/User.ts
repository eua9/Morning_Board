/**
 * User Model
 * Represents a user in the Morning Board application
 * 
 * Properties:
 * - id: Unique identifier
 * - username: Unique username
 * - email: User email address
 * - password: Hashed password (should never be returned in API responses)
 * - firstName: User's first name
 * - lastName: User's last name
 * - createdAt: Account creation timestamp
 * - updatedAt: Last update timestamp
 * 
 * Relationships:
 * - One User can have many BankAccounts (one-to-many)
 *   Use BankAccount.findByUserId(userId) to retrieve all accounts for a user
 */

import bcrypt from 'bcrypt';

export interface IUser {
  id: string;
  username: string;
  email: string;
  password: string; // Hashed password (bcrypt hash)
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User implements IUser {
  id: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<IUser>) {
    this.id = data.id || '';
    this.username = data.username || '';
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
      this.username &&
      this.email &&
      this.password &&
      this.firstName &&
      this.lastName
    );
  }

  /**
   * Authenticate user by comparing plain password with stored hash
   * @param plainPassword - Plain text password to authenticate
   * @returns Promise resolving to true if password matches, false otherwise
   */
  async authenticate(plainPassword: string): Promise<boolean> {
    if (!plainPassword || !this.password) {
      return false;
    }
    return User.comparePassword(plainPassword, this.password);
  }

  /**
   * Hash password using bcrypt
   * @param plainPassword - Plain text password
   * @param saltRounds - Number of salt rounds (default: 10)
   * @returns Hashed password
   */
  static async hashPassword(
    plainPassword: string,
    saltRounds: number = 10
  ): Promise<string> {
    if (!plainPassword) {
      throw new Error('Password cannot be empty');
    }
    return bcrypt.hash(plainPassword, saltRounds);
  }

  /**
   * Compare plain password with hashed password using bcrypt
   * @param plainPassword - Plain text password to compare
   * @param hashedPassword - Hashed password to compare against
   * @returns true if passwords match, false otherwise
   */
  static async comparePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    if (!plainPassword || !hashedPassword) {
      return false;
    }
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error('Error comparing passwords:', error);
      return false;
    }
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
   * Find user by username
   * @param _username - Username
   * @returns User instance or null if not found
   */
  static async findByUsername(_username: string): Promise<User | null> {
    // TODO: Implement database lookup
    // This should query the database for a user with the given username
    return null;
  }

  /**
   * Find user by username or email (for login flexibility)
   * @param _identifier - Username or email
   * @returns User instance or null if not found
   */
  static async findByUsernameOrEmail(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _identifier: string
  ): Promise<User | null> {
    // TODO: Implement database lookup
    // This should query the database for a user with the given username or email
    // Try username first, then email
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

